"use client";

import { useEffect, useState } from "react";

type Subject = {
    id: string;
    name: string;
    description: string | null;
};

type StudentSubject = {
    id: string;
    currentLevel: string | null;
    needsHelp: boolean;
    subject: Subject;
};

export default function StudentSubjects() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [mySubjects, setMySubjects] = useState<StudentSubject[]>([]);

    const [selectedSubject, setSelectedSubject] = useState("");
    const [currentLevel, setCurrentLevel] = useState("Beginner");
    const [needsHelp, setNeedsHelp] = useState(true);

    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [message, setMessage] = useState("");

    async function loadData() {
        try {
            setLoading(true);

            const [subjectsResponse, mySubjectsResponse] =
                await Promise.all([
                    fetch("/api/subjects"),
                    fetch("/api/student/subjects"),
                ]);

            const subjectsData = await subjectsResponse.json();
            const mySubjectsData = await mySubjectsResponse.json();

            if (!subjectsResponse.ok) {
                setMessage(
                    subjectsData.message || "Failed to load subjects"
                );
                return;
            }

            if (!mySubjectsResponse.ok) {
                setMessage(
                    mySubjectsData.message ||
                    "Failed to load your subjects"
                );
                return;
            }

            setSubjects(subjectsData.subjects);
            setMySubjects(mySubjectsData.subjects);
        } catch (error) {
            console.error(error);
            setMessage("Failed to load subjects.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    async function addSubject() {
        if (!selectedSubject) {
            setMessage("Please select a subject.");
            return;
        }

        setAdding(true);
        setMessage("");

        try {
            const response = await fetch("/api/student/subjects", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    subjectId: selectedSubject,
                    currentLevel,
                    needsHelp,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to add subject.");
                return;
            }

            setMessage("Subject added successfully.");

            setSelectedSubject("");
            setCurrentLevel("Beginner");
            setNeedsHelp(true);

            await loadData();
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong.");
        } finally {
            setAdding(false);
        }
    }

    async function removeSubject(id: string) {
        const confirmed = window.confirm(
            "Are you sure you want to remove this subject?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `/api/student/subjects/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Failed to remove subject."
                );
                return;
            }

            setMessage("Subject removed successfully.");

            await loadData();
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong.");
        }
    }

    if (loading) {
        return <p>Loading subjects...</p>;
    }

    const selectedIds = new Set(
        mySubjects.map((item) => item.subject.id)
    );

    const availableSubjects = subjects.filter(
        (subject) => !selectedIds.has(subject.id)
    );

    return (
        <div className="space-y-8">
            {message && (
                <div className="rounded-lg border p-4">
                    {message}
                </div>
            )}

            {/* Add subject */}

            <section className="rounded-xl border p-6">
                <h2 className="text-xl font-semibold">
                    Add a Subject
                </h2>

                <div className="mt-5 space-y-5">
                    <div>
                        <label
                            htmlFor="subject"
                            className="mb-2 block font-medium"
                        >
                            Subject
                        </label>

                        <select
                            id="subject"
                            value={selectedSubject}
                            onChange={(event) =>
                                setSelectedSubject(event.target.value)
                            }
                            className="w-full rounded-lg border p-3"
                        >
                            <option value="">
                                Select a subject
                            </option>

                            {availableSubjects.map((subject) => (
                                <option
                                    key={subject.id}
                                    value={subject.id}
                                >
                                    {subject.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="level"
                            className="mb-2 block font-medium"
                        >
                            Current Level
                        </label>

                        <select
                            id="level"
                            value={currentLevel}
                            onChange={(event) =>
                                setCurrentLevel(event.target.value)
                            }
                            className="w-full rounded-lg border p-3"
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Elementary">Elementary</option>
                            <option value="Intermediate">
                                Intermediate
                            </option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                        </select>
                    </div>

                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={needsHelp}
                            onChange={(event) =>
                                setNeedsHelp(event.target.checked)
                            }
                            className="h-4 w-4"
                        />

                        <span>I need help with this subject</span>
                    </label>

                    <button
                        type="button"
                        onClick={addSubject}
                        disabled={adding || !selectedSubject}
                        className="rounded-lg bg-black px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {adding ? "Adding..." : "Add Subject"}
                    </button>
                </div>
            </section>

            {/* My subjects */}

            <section>
                <h2 className="text-xl font-semibold">
                    My Subjects
                </h2>

                {mySubjects.length === 0 ? (
                    <div className="mt-4 rounded-xl border p-6 text-gray-600">
                        You haven't added any subjects yet.
                    </div>
                ) : (
                    <div className="mt-4 space-y-4">
                        {mySubjects.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-xl border p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {item.subject.name}
                                        </h3>

                                        {item.subject.description && (
                                            <p className="mt-1 text-sm text-gray-600">
                                                {item.subject.description}
                                            </p>
                                        )}

                                        <div className="mt-3 space-y-1 text-sm">
                                            <p>
                                                <strong>Level:</strong>{" "}
                                                {item.currentLevel || "Not specified"}
                                            </p>

                                            <p>
                                                <strong>Needs help:</strong>{" "}
                                                {item.needsHelp ? "Yes" : "No"}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeSubject(item.id)
                                        }
                                        className="rounded-lg border px-4 py-2 text-sm font-medium"
                                    >
                                        Remove
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