
"use client";

import { useEffect, useState } from "react";

type Session = {
    id: string;
    status: string;
    startedAt?: string | null;
    completedAt?: string | null;
    notes?: string | null;

    booking: {
        id: string;
        startTime: string;
        endTime: string;

        student: {
            user: {
                email: string;
            };
        };
    };

    attendance?: {
        present: boolean;
        joinedAt?: string | null;
        leftAt?: string | null;
    } | null;
};

export default function TutorSessionsPage() {
    const [sessions, setSessions] =
        useState<Session[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [message, setMessage] =
        useState("");

    const [updating, setUpdating] =
        useState<string | null>(null);

    async function loadSessions() {
        try {
            setLoading(true);

            const response = await fetch(
                "/api/tutor/sessions"
            );

            const data =
                await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Failed to load sessions."
                );
                return;
            }

            setSessions(
                data.sessions || []
            );
        } catch (error) {
            console.error(error);

            setMessage(
                "Failed to load sessions."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSessions();
    }, []);

    async function updateSession(
        id: string,
        action: "START" | "END"
    ) {
        try {
            setUpdating(id);
            setMessage("");

            const response = await fetch(
                `/api/tutor/sessions/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        action,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Failed to update session."
                );
                return;
            }

            setMessage(data.message);

            await loadSessions();
        } catch (error) {
            console.error(error);

            setMessage(
                "Failed to update session."
            );
        } finally {
            setUpdating(null);
        }
    }

    async function saveNotes(
        id: string,
        notes: string
    ) {
        try {
            const response = await fetch(
                `/api/tutor/sessions/${id}/notes`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        notes,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Failed to save notes."
                );
                return;
            }

            setMessage(
                "Session notes saved successfully."
            );

            await loadSessions();
        } catch (error) {
            console.error(error);

            setMessage(
                "Failed to save notes."
            );
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen p-6">
                <div className="mx-auto max-w-5xl">
                    <p>Loading sessions...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-5xl">

                <h1 className="text-3xl font-bold">
                    Tutor Sessions
                </h1>

                <p className="mt-2 text-gray-600">
                    Manage your tutoring sessions,
                    attendance, and session notes.
                </p>

                {message && (
                    <div className="mt-6 rounded-lg border bg-white p-4">
                        {message}
                    </div>
                )}

                {sessions.length === 0 ? (
                    <div className="mt-8 rounded-xl border bg-white p-8 text-center">
                        <p className="text-gray-600">
                            You don't have any sessions
                            yet.
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                            Sessions will appear here
                            after a booking is confirmed.
                        </p>
                    </div>
                ) : (
                    <div className="mt-8 space-y-6">

                        {sessions.map((session) => (
                            <div
                                key={session.id}
                                className="rounded-xl border bg-white p-6 shadow-sm"
                            >

                                <div className="flex flex-col gap-6">

                                    {/* Session information */}

                                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                                        <div>
                                            <h2 className="text-xl font-semibold">
                                                Student
                                            </h2>

                                            <p className="mt-1 text-gray-600">
                                                {
                                                    session
                                                        .booking
                                                        .student
                                                        .user
                                                        .email
                                                }
                                            </p>

                                            <p className="mt-3 text-sm text-gray-500">
                                                Start:{" "}
                                                {new Date(
                                                    session
                                                        .booking
                                                        .startTime
                                                ).toLocaleString()}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                End:{" "}
                                                {new Date(
                                                    session
                                                        .booking
                                                        .endTime
                                                ).toLocaleString()}
                                            </p>
                                        </div>

                                        {/* Status */}

                                        <span className="w-fit rounded-full border px-3 py-1 text-sm font-medium">
                                            {
                                                session.status
                                            }
                                        </span>

                                    </div>

                                    {/* Session actions */}

                                    <div className="flex flex-wrap gap-3">

                                        {session.status ===
                                            "SCHEDULED" && (
                                                <button
                                                    type="button"
                                                    disabled={
                                                        updating ===
                                                        session.id
                                                    }
                                                    onClick={() =>
                                                        updateSession(
                                                            session.id,
                                                            "START"
                                                        )
                                                    }
                                                    className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
                                                >
                                                    {updating ===
                                                        session.id
                                                        ? "Starting..."
                                                        : "Start Session"}
                                                </button>
                                            )}

                                        {session.status ===
                                            "IN_PROGRESS" && (
                                                <button
                                                    type="button"
                                                    disabled={
                                                        updating ===
                                                        session.id
                                                    }
                                                    onClick={() =>
                                                        updateSession(
                                                            session.id,
                                                            "END"
                                                        )
                                                    }
                                                    className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
                                                >
                                                    {updating ===
                                                        session.id
                                                        ? "Ending..."
                                                        : "End Session"}
                                                </button>
                                            )}

                                    </div>

                                    {/* Attendance */}

                                    {session.attendance && (
                                        <div className="rounded-lg bg-gray-50 p-4">

                                            <h3 className="font-semibold">
                                                Attendance
                                            </h3>

                                            <p className="mt-2 text-sm">
                                                Present:{" "}
                                                {session
                                                    .attendance
                                                    .present
                                                    ? "Yes"
                                                    : "No"}
                                            </p>

                                            {session
                                                .attendance
                                                .joinedAt && (
                                                    <p className="text-sm text-gray-500">
                                                        Joined:{" "}
                                                        {new Date(
                                                            session
                                                                .attendance
                                                                .joinedAt
                                                        ).toLocaleString()}
                                                    </p>
                                                )}

                                            {session
                                                .attendance
                                                .leftAt && (
                                                    <p className="text-sm text-gray-500">
                                                        Left:{" "}
                                                        {new Date(
                                                            session
                                                                .attendance
                                                                .leftAt
                                                        ).toLocaleString()}
                                                    </p>
                                                )}

                                        </div>
                                    )}

                                    {/* Notes */}

                                    <div>
                                        <label
                                            htmlFor={`notes-${session.id}`}
                                            className="block text-sm font-medium"
                                        >
                                            Session Notes
                                        </label>

                                        <textarea
                                            id={`notes-${session.id}`}
                                            defaultValue={
                                                session.notes ||
                                                ""
                                            }
                                            placeholder="Write notes about this tutoring session..."
                                            rows={4}
                                            className="mt-2 w-full rounded-lg border p-3 outline-none focus:ring-2"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => {
                                                const element =
                                                    document.getElementById(
                                                        `notes-${session.id}`
                                                    ) as HTMLTextAreaElement;

                                                saveNotes(
                                                    session.id,
                                                    element.value
                                                );
                                            }}
                                            className="mt-3 rounded-lg border px-4 py-2 text-sm font-medium"
                                        >
                                            Save Notes
                                        </button>
                                    </div>

                                    {/* Session timestamps */}

                                    {session.startedAt && (
                                        <p className="text-sm text-gray-500">
                                            Session started:{" "}
                                            {new Date(
                                                session.startedAt
                                            ).toLocaleString()}
                                        </p>
                                    )}

                                    {session.completedAt && (
                                        <p className="text-sm text-gray-500">
                                            Session completed:{" "}
                                            {new Date(
                                                session.completedAt
                                            ).toLocaleString()}
                                        </p>
                                    )}

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </div>
        </main>
    );
}