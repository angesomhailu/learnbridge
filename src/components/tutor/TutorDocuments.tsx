"use client";

import { useEffect, useState } from "react";

type DocumentItem = {
    id: string;
    type: string;
    title: string;
    fileUrl: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    verificationStatus: string;
};

const documentTypes = [
    { value: "DEGREE", label: "Degree" },
    { value: "CERTIFICATE", label: "Certificate" },
    { value: "IDENTITY", label: "Identity Document" },
    { value: "TRANSCRIPT", label: "Transcript" },
    { value: "OTHER", label: "Other" },
];

export default function TutorDocuments() {
    const [documents, setDocuments] = useState<DocumentItem[]>([]);

    const [type, setType] = useState("DEGREE");
    const [title, setTitle] = useState("");
    const [fileUrl, setFileUrl] = useState("");
    const [fileName, setFileName] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    async function loadDocuments() {
        try {
            const response = await fetch("/api/tutor/documents");
            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to load documents.");
                return;
            }

            setDocuments(data.documents || []);
        } catch (error) {
            console.error(error);
            setMessage("Failed to load documents.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDocuments();
    }, []);

    async function addDocument() {
        if (!title || !fileUrl || !fileName) {
            setMessage("Please complete all document fields.");
            return;
        }

        setSaving(true);
        setMessage("");

        try {
            const response = await fetch(
                "/api/tutor/documents/upload",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        type,
                        title,
                        fileUrl,
                        fileName,
                        mimeType: "application/pdf",
                        fileSize: 0,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Failed to upload document."
                );
                return;
            }

            setMessage("Document added successfully.");

            setTitle("");
            setFileUrl("");
            setFileName("");

            await loadDocuments();
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong.");
        } finally {
            setSaving(false);
        }
    }

    async function deleteDocument(id: string) {
        try {
            const response = await fetch(
                `/api/tutor/documents/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Failed to delete document."
                );
                return;
            }

            setMessage("Document deleted successfully.");

            await loadDocuments();
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong.");
        }
    }

    if (loading) {
        return <p>Loading documents...</p>;
    }

    return (
        <div className="space-y-8">
            {message && (
                <div className="rounded-lg border p-4">
                    {message}
                </div>
            )}

            <section className="rounded-xl border p-6">
                <h2 className="text-xl font-semibold">
                    Add Document
                </h2>

                <div className="mt-5 space-y-4">
                    <div>
                        <label className="mb-2 block font-medium">
                            Document Type
                        </label>

                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full rounded-lg border p-3"
                        >
                            {documentTypes.map((item) => (
                                <option
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Document Title
                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Example: BSc Software Engineering"
                            className="w-full rounded-lg border p-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            File Name
                        </label>

                        <input
                            type="text"
                            value={fileName}
                            onChange={(e) =>
                                setFileName(e.target.value)
                            }
                            placeholder="degree-certificate.pdf"
                            className="w-full rounded-lg border p-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            File URL
                        </label>

                        <input
                            type="url"
                            value={fileUrl}
                            onChange={(e) => setFileUrl(e.target.value)}
                            placeholder="https://example.com/document.pdf"
                            className="w-full rounded-lg border p-3"
                        />

                        <p className="mt-1 text-sm text-gray-500">
                            Temporary field. We'll connect real file
                            storage later.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={addDocument}
                        disabled={saving}
                        className="rounded-lg bg-black px-6 py-3 font-medium text-white disabled:opacity-50"
                    >
                        {saving ? "Adding..." : "Add Document"}
                    </button>
                </div>
            </section>

            <section>
                <h2 className="mb-4 text-xl font-semibold">
                    My Documents
                </h2>

                {documents.length === 0 ? (
                    <div className="rounded-xl border p-6 text-gray-600">
                        No documents uploaded yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {documents.map((document) => (
                            <div
                                key={document.id}
                                className="flex items-center justify-between rounded-xl border p-5"
                            >
                                <div>
                                    <h3 className="font-semibold">
                                        {document.title}
                                    </h3>

                                    <p className="text-sm text-gray-600">
                                        {document.fileName}
                                    </p>

                                    <p className="mt-1 text-sm">
                                        Status:{" "}
                                        <span className="font-medium">
                                            {document.verificationStatus}
                                        </span>
                                    </p>

                                    <a
                                        href={document.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 inline-block text-sm underline"
                                    >
                                        View document
                                    </a>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        deleteDocument(document.id)
                                    }
                                    className="rounded-lg border px-4 py-2 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}