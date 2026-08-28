"use client";

import { useEffect, useState } from "react";

type Tutor = {
    id: string;

    user: {
        id: string;
        email: string;
        status: string;
        createdAt: string;
    };

    bio?: string | null;
    experienceYears?: number | null;

    verificationStatus: string;

    educationRecords: {
        id: string;
        degree: string;
        department?: string | null;
        institution: string;
        graduationYear?: number | null;
    }[];

    documents: {
        id: string;
        type: string;
        title: string;
        fileUrl: string;
        fileName: string;
        verificationStatus: string;
    }[];

    subjects: {
        id: string;
        proficiencyLevel?: string | null;
        subject: {
            name: string;
        };
    }[];
};

export default function AdminTutorsPage() {
    const [tutors, setTutors] =
        useState<Tutor[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [message, setMessage] =
        useState("");

    async function loadTutors() {
        try {
            const response = await fetch(
                "/api/admin/tutors/pending"
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Failed to load tutors."
                );
                return;
            }

            setTutors(data.tutors || []);
        } catch (error) {
            console.error(error);

            setMessage(
                "Failed to load pending tutors."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTutors();
    }, []);

    async function updateVerification(
        tutorId: string,
        verificationStatus: string
    ) {
        try {
            const response = await fetch(
                `/api/admin/tutors/${tutorId}/verification`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        verificationStatus,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Failed to update tutor."
                );

                return;
            }

            setMessage(data.message);

            await loadTutors();
        } catch (error) {
            console.error(error);

            setMessage(
                "Something went wrong."
            );
        }
    }

    if (loading) {
        return (
            <main className="p-6">
                Loading tutors...
            </main>
        );
    }

    return (
        <main className="min-h-screen p-6">
            <div className="mx-auto max-w-6xl">
                <h1 className="text-3xl font-bold">
                    Tutor Verification
                </h1>

                <p className="mt-2 text-gray-600">
                    Review tutor profiles and submitted
                    credentials.
                </p>

                {message && (
                    <div className="mt-6 rounded-lg border p-4">
                        {message}
                    </div>
                )}

                {tutors.length === 0 ? (
                    <div className="mt-8 rounded-xl border p-8 text-center">
                        <h2 className="text-xl font-semibold">
                            No pending tutors
                        </h2>

                        <p className="mt-2 text-gray-600">
                            All tutors have been reviewed.
                        </p>
                    </div>
                ) : (
                    <div className="mt-8 space-y-6">
                        {tutors.map((tutor) => (
                            <div
                                key={tutor.id}
                                className="rounded-xl border p-6"
                            >
                                <div className="flex flex-col justify-between gap-4 md:flex-row">
                                    <div>
                                        <h2 className="text-xl font-bold">
                                            {tutor.user.email}
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Status:{" "}
                                            {tutor.verificationStatus}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateVerification(
                                                    tutor.id,
                                                    "VERIFIED"
                                                )
                                            }
                                            className="rounded-lg bg-green-600 px-4 py-2 text-white"
                                        >
                                            Approve
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateVerification(
                                                    tutor.id,
                                                    "REJECTED"
                                                )
                                            }
                                            className="rounded-lg bg-red-600 px-4 py-2 text-white"
                                        >
                                            Reject
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateVerification(
                                                    tutor.id,
                                                    "RESUBMISSION_REQUIRED"
                                                )
                                            }
                                            className="rounded-lg border px-4 py-2"
                                        >
                                            Request Resubmission
                                        </button>
                                    </div>
                                </div>

                                {tutor.bio && (
                                    <div className="mt-6">
                                        <h3 className="font-semibold">
                                            Bio
                                        </h3>

                                        <p className="mt-1 text-gray-600">
                                            {tutor.bio}
                                        </p>
                                    </div>
                                )}

                                <div className="mt-6">
                                    <h3 className="font-semibold">
                                        Education
                                    </h3>

                                    <div className="mt-2 space-y-2">
                                        {tutor.educationRecords.map(
                                            (education) => (
                                                <div
                                                    key={education.id}
                                                    className="rounded-lg border p-3"
                                                >
                                                    <p className="font-medium">
                                                        {education.degree}
                                                    </p>

                                                    <p className="text-sm text-gray-600">
                                                        {
                                                            education.institution
                                                        }
                                                        {education.department
                                                            ? ` — ${education.department}`
                                                            : ""}
                                                    </p>

                                                    {education.graduationYear && (
                                                        <p className="text-sm text-gray-500">
                                                            Graduated:{" "}
                                                            {
                                                                education.graduationYear
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="font-semibold">
                                        Subjects
                                    </h3>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {tutor.subjects.map(
                                            (subject) => (
                                                <span
                                                    key={subject.id}
                                                    className="rounded-full border px-3 py-1 text-sm"
                                                >
                                                    {subject.subject.name}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="font-semibold">
                                        Documents
                                    </h3>

                                    <div className="mt-2 space-y-2">
                                        {tutor.documents.length ===
                                            0 ? (
                                            <p className="text-gray-500">
                                                No documents submitted.
                                            </p>
                                        ) : (
                                            tutor.documents.map(
                                                (document) => (
                                                    <div
                                                        key={document.id}
                                                        className="flex flex-col justify-between gap-3 rounded-lg border p-3 md:flex-row md:items-center"
                                                    >
                                                        <div>
                                                            <p className="font-medium">
                                                                {document.title}
                                                            </p>

                                                            <p className="text-sm text-gray-500">
                                                                {document.type}
                                                            </p>
                                                        </div>

                                                        <a
                                                            href={
                                                                document.fileUrl
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="rounded-lg border px-3 py-2 text-sm"
                                                        >
                                                            View Document
                                                        </a>
                                                    </div>
                                                )
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}