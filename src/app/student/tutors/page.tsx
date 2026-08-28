"use client";

import { useEffect, useState } from "react";

type Subject = {
    id: string;
    name: string;
};

type Tutor = {
    id: string;

    user: {
        id: string;
        email: string;
    };

    bio?: string | null;
    experienceYears?: number | null;

    subjects: {
        id: string;
        proficiencyLevel?: string | null;
        subject: {
            id: string;
            name: string;
        };
    }[];

    pricing: {
        id: string;
        amount: string;
        currency: string;
        durationMinutes: number;
    }[];
};

export default function StudentTutorsPage() {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    async function loadSubjects() {
        try {
            const response = await fetch("/api/subjects");
            const data = await response.json();

            if (response.ok) {
                setSubjects(data.subjects || []);
            }
        } catch (error) {
            console.error("Failed to load subjects:", error);
        }
    }

    async function loadTutors(subject = "") {
        try {
            setLoading(true);
            setMessage("");

            const url = subject
                ? `/api/tutors?subject=${encodeURIComponent(subject)}`
                : "/api/tutors";

            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Failed to load tutors."
                );
                return;
            }

            setTutors(data.tutors || []);
        } catch (error) {
            console.error("Failed to load tutors:", error);

            setMessage("Failed to load tutors.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSubjects();
        loadTutors();
    }, []);

    async function handleSubjectChange(
        event: React.ChangeEvent<HTMLSelectElement>
    ) {
        const subject = event.target.value;

        setSelectedSubject(subject);

        await loadTutors(subject);
    }

    async function sendRequest(tutorId: string) {
        const message = window.prompt(
            "Write a message to the tutor:"
        );

        if (message === null) {
            return;
        }

        try {
            const response = await fetch(
                "/api/student/tutor-requests",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        tutorId,
                        message,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                    "Failed to send request."
                );
                return;
            }

            alert(
                "Tutor request sent successfully!"
            );
        } catch (error) {
            console.error(error);

            alert(
                "Something went wrong while sending the request."
            );
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-7xl">
                <div>
                    <h1 className="text-3xl font-bold">
                        Find a Tutor
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Find a verified tutor who matches
                        your learning needs.
                    </p>
                </div>

                {/* Subject filter */}

                <div className="mt-8 rounded-xl border bg-white p-5">
                    <label
                        htmlFor="subject"
                        className="block text-sm font-medium"
                    >
                        Filter by subject
                    </label>

                    <select
                        id="subject"
                        value={selectedSubject}
                        onChange={handleSubjectChange}
                        className="mt-2 w-full rounded-lg border p-3 md:w-96"
                    >
                        <option value="">
                            All Subjects
                        </option>

                        {subjects.map((subject) => (
                            <option
                                key={subject.id}
                                value={subject.name}
                            >
                                {subject.name}
                            </option>
                        ))}
                    </select>
                </div>

                {message && (
                    <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                        {message}
                    </div>
                )}

                {/* Tutors */}

                {loading ? (
                    <div className="mt-10 text-center">
                        Loading tutors...
                    </div>
                ) : tutors.length === 0 ? (
                    <div className="mt-10 rounded-xl border bg-white p-10 text-center">
                        <h2 className="text-xl font-semibold">
                            No tutors found
                        </h2>

                        <p className="mt-2 text-gray-600">
                            Try another subject or check
                            back later.
                        </p>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {tutors.map((tutor) => (
                            <div
                                key={tutor.id}
                                className="rounded-xl border bg-white p-6 shadow-sm"
                            >
                                <div>
                                    <h2 className="text-xl font-bold">
                                        Tutor
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {tutor.user.email}
                                    </p>
                                </div>

                                {tutor.bio && (
                                    <p className="mt-4 line-clamp-3 text-gray-600">
                                        {tutor.bio}
                                    </p>
                                )}

                                <div className="mt-4">
                                    <p className="text-sm font-semibold">
                                        Experience
                                    </p>

                                    <p className="text-gray-600">
                                        {tutor.experienceYears ??
                                            0}{" "}
                                        years
                                    </p>
                                </div>

                                <div className="mt-4">
                                    <p className="text-sm font-semibold">
                                        Subjects
                                    </p>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {tutor.subjects.map(
                                            (subject) => (
                                                <span
                                                    key={
                                                        subject.id
                                                    }
                                                    className="rounded-full border px-3 py-1 text-xs"
                                                >
                                                    {
                                                        subject
                                                            .subject
                                                            .name
                                                    }
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>

                                {tutor.pricing.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm font-semibold">
                                            Pricing
                                        </p>

                                        {tutor.pricing.map(
                                            (price) => (
                                                <p
                                                    key={
                                                        price.id
                                                    }
                                                    className="text-gray-600"
                                                >
                                                    {
                                                        price.currency
                                                    }{" "}
                                                    {
                                                        price.amount
                                                    }{" "}
                                                    /{" "}
                                                    {
                                                        price.durationMinutes
                                                    }{" "}
                                                    minutes
                                                </p>
                                            )
                                        )}
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() =>
                                        sendRequest(
                                            tutor.id
                                        )
                                    }
                                    className="mt-6 w-full rounded-lg bg-black px-4 py-3 font-medium text-white hover:opacity-90"
                                >
                                    Send Tutor Request
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}