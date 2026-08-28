"use client";

import { useEffect, useState } from "react";

type Student = {
    id: string;

    user: {
        email: string;
    };

    grade: string;

    schoolName?: string | null;

    bio?: string | null;

    learningNeeds?: string | null;

    subjects: {
        id: string;

        currentLevel?: string | null;

        needsHelp: boolean;

        subject: {
            name: string;
        };
    }[];
};

type TutorRequest = {
    id: string;

    message?: string | null;

    status: string;

    createdAt: string;

    student: Student;
};

export default function TutorRequestsPage() {
    const [requests, setRequests] =
        useState<TutorRequest[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [message, setMessage] =
        useState("");

    async function loadRequests() {
        try {
            setLoading(true);

            const response = await fetch(
                "/api/tutor/requests"
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Failed to load requests."
                );

                return;
            }

            setRequests(
                data.requests || []
            );
        } catch (error) {
            console.error(error);

            setMessage(
                "Failed to load tutor requests."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRequests();
    }, []);

    async function updateRequest(
        requestId: string,
        status: "ACCEPTED" | "REJECTED"
    ) {
        try {
            const response = await fetch(
                `/api/tutor/requests/${requestId}`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        status,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                    "Failed to update request."
                );

                return;
            }

            alert(data.message);

            await loadRequests();
        } catch (error) {
            console.error(error);

            alert(
                "Something went wrong."
            );
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen p-6">
                <div className="mx-auto max-w-5xl">
                    Loading requests...
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-5xl">
                <h1 className="text-3xl font-bold">
                    Tutor Requests
                </h1>

                <p className="mt-2 text-gray-600">
                    Review students who want to
                    learn with you.
                </p>

                {message && (
                    <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                        {message}
                    </div>
                )}

                {requests.length === 0 ? (
                    <div className="mt-8 rounded-xl border bg-white p-10 text-center">
                        <h2 className="text-xl font-semibold">
                            No tutor requests
                        </h2>

                        <p className="mt-2 text-gray-600">
                            You don't have any tutor
                            requests yet.
                        </p>
                    </div>
                ) : (
                    <div className="mt-8 space-y-6">
                        {requests.map(
                            (request) => (
                                <div
                                    key={
                                        request.id
                                    }
                                    className="rounded-xl border bg-white p-6 shadow-sm"
                                >
                                    <div className="flex flex-col justify-between gap-4 md:flex-row">
                                        <div>
                                            <h2 className="text-xl font-bold">
                                                Student
                                            </h2>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {
                                                    request
                                                        .student
                                                        .user
                                                        .email
                                                }
                                            </p>
                                        </div>

                                        <span
                                            className={`h-fit rounded-full px-3 py-1 text-sm font-medium ${request.status ===
                                                    "PENDING"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : request.status ===
                                                        "ACCEPTED"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {
                                                request.status
                                            }
                                        </span>
                                    </div>

                                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                                        <div>
                                            <p className="text-sm font-semibold">
                                                Grade
                                            </p>

                                            <p className="text-gray-600">
                                                {
                                                    request
                                                        .student
                                                        .grade
                                                }
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold">
                                                School
                                            </p>

                                            <p className="text-gray-600">
                                                {request
                                                    .student
                                                    .schoolName ||
                                                    "Not provided"}
                                            </p>
                                        </div>
                                    </div>

                                    {request
                                        .student
                                        .learningNeeds && (
                                            <div className="mt-6">
                                                <p className="text-sm font-semibold">
                                                    Learning Needs
                                                </p>

                                                <p className="mt-1 text-gray-600">
                                                    {
                                                        request
                                                            .student
                                                            .learningNeeds
                                                    }
                                                </p>
                                            </div>
                                        )}

                                    {request.message && (
                                        <div className="mt-6 rounded-lg bg-gray-50 p-4">
                                            <p className="text-sm font-semibold">
                                                Student Message
                                            </p>

                                            <p className="mt-1 text-gray-600">
                                                {
                                                    request.message
                                                }
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-6">
                                        <p className="text-sm font-semibold">
                                            Subjects
                                        </p>

                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {request.student.subjects.map(
                                                (
                                                    subject
                                                ) => (
                                                    <span
                                                        key={
                                                            subject.id
                                                        }
                                                        className="rounded-full border px-3 py-1 text-sm"
                                                    >
                                                        {
                                                            subject
                                                                .subject
                                                                .name
                                                        }

                                                        {subject.currentLevel
                                                            ? ` (${subject.currentLevel})`
                                                            : ""}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {request.status ===
                                        "PENDING" && (
                                            <div className="mt-6 flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateRequest(
                                                            request.id,
                                                            "ACCEPTED"
                                                        )
                                                    }
                                                    className="rounded-lg bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700"
                                                >
                                                    Accept Request
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateRequest(
                                                            request.id,
                                                            "REJECTED"
                                                        )
                                                    }
                                                    className="rounded-lg border border-red-300 px-5 py-3 font-medium text-red-600 hover:bg-red-50"
                                                >
                                                    Reject Request
                                                </button>
                                            </div>
                                        )}

                                    <p className="mt-4 text-xs text-gray-400">
                                        Requested{" "}
                                        {new Date(
                                            request.createdAt
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}