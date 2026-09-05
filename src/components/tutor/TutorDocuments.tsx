"use client";

import { useEffect, useState } from "react";
import { FileCheck, Plus, Trash2, CheckCircle2, ShieldCheck, FileText, ExternalLink } from "lucide-react";

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
    { value: "DEGREE", label: "University Degree" },
    { value: "CERTIFICATE", label: "Teaching Certificate" },
    { value: "IDENTITY", label: "Government ID / Passport" },
    { value: "TRANSCRIPT", label: "Academic Transcript" },
    { value: "OTHER", label: "Other Verification Document" },
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
            if (response.ok && data.success) {
                setDocuments(data.documents || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDocuments();
    }, []);

    async function addDocument() {
        if (!title || !fileUrl || !fileName) {
            setMessage("Please enter document title, file name, and file URL.");
            return;
        }

        setSaving(true);
        setMessage("");

        try {
            const response = await fetch("/api/tutor/documents/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type,
                    title,
                    fileUrl,
                    fileName,
                    mimeType: "application/pdf",
                    fileSize: 1024 * 500,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Document uploaded and submitted for verification!");
                setTitle("");
                setFileUrl("");
                setFileName("");
                await loadDocuments();
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage(data.message || "Failed to submit document.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    }

    async function deleteDocument(id: string) {
        try {
            const response = await fetch(`/api/tutor/documents/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setMessage("Document deleted.");
                await loadDocuments();
                setTimeout(() => setMessage(""), 3000);
            }
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="h-7 w-7 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {message && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {message}
                </div>
            )}

            {/* Form */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Plus className="h-5 w-5 text-emerald-600" />
                    Upload Verification Document
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Document Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            {documentTypes.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Document Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Bachelor Degree Certificate"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">File Name</label>
                        <input
                            type="text"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            placeholder="e.g. bsc-degree.pdf"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">File URL</label>
                        <input
                            type="url"
                            value={fileUrl}
                            onChange={(e) => setFileUrl(e.target.value)}
                            placeholder="https://example.com/docs/degree.pdf"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="button"
                        onClick={addDocument}
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition shadow-xs"
                    >
                        <Plus className="h-4 w-4" />
                        {saving ? "Uploading..." : "Upload Document"}
                    </button>
                </div>
            </section>

            {/* List */}
            <section className="space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-emerald-600" />
                    Uploaded Identity & Qualification Files
                </h2>

                {documents.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-2">
                        <FileText className="h-10 w-10 text-slate-300 mx-auto" />
                        <h3 className="text-sm font-bold text-slate-900">No verification documents uploaded</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            Upload your degree certificates or identity documents to verify your educator account.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {documents.map((document) => (
                            <div
                                key={document.id}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                                                {document.type}
                                            </span>
                                            <h3 className="font-bold text-sm text-slate-900">{document.title}</h3>
                                        </div>
                                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                            <ShieldCheck className="h-3 w-3" />
                                            {document.verificationStatus || "VERIFIED"}
                                        </span>
                                    </div>

                                    <p className="text-xs text-slate-500 truncate">{document.fileName}</p>

                                    <a
                                        href={document.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 pt-1"
                                    >
                                        View Document <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => deleteDocument(document.id)}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-1 rounded-lg transition"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Delete Document
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}