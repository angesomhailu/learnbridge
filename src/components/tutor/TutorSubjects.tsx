"use client";

import { useEffect, useState } from "react";

type Subject = {
    id: string;
    name: string;
};

type TutorSubject = {
    id: string;
    proficiencyLevel: string | null;
    gradeLevels: string[];
    subject: Subject;
};

export default function TutorSubjects() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [mySubjects, setMySubjects] = useState<TutorSubject[]>(
        []
    );

    const [subjectId, setSubjectId] = useState("");
    const [proficiencyLevel, setProficiencyLevel] =
        useState("INTERMEDIATE");

    const [gradeLevels, setGradeLevels] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    async function loadData() {
        try {
            const [subjectsResponse, tutorResponse] =
                await Promise.all([
                    fetch("/api/subjects"),
                    fetch("/api/tutor/subjects"),
                ]);

            const subjectsData = await subjectsResponse.json();
            const tutorData = await tutorResponse.json();

            if (!subjectsResponse.ok) {
                setMessage(
                    subjectsData.message ||
                    "Failed to load subjects."
                );
                return;
            }

            if (!tutorResponse.ok) {
                setMessage(
                    tutorData.message ||
                    "Failed to load your subjects."
                );
                return;
            }

            setSubjects(subjectsData.subjects || []);
            setMySubjects(tutorData.subjects || []);
        } catch (error) {
            console.error(error);
            setMessage("Failed to load subject data.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    async function addSubject() {
        if (!subjectId) {
            setMessage("Please select a subject.");
            return;
        }

        setSaving(true);
        setMessage("");

        try {
            const response = await fetch(
                "/api/tutor/subjects",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        subjectId,
                        proficiencyLevel,
                        gradeLevels: gradeLevels
                            .split(",")
                            .map((item) => item.trim())
                            .filter(Boolean),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Failed to add subject."
                );
                return;
            }

            setMessage("Subject added successfully.");

            setSubjectId("");
            setGradeLevels("");

            await loadData();
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong.");
        } finally {
            setSaving(false);
        }
    }

    async function removeSubject(id: string) {
        try {
            const response = await fetch(
                `/api/tutor/subjects/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Failed to remove subject."
                );
                return;
            }

            setMessage("Subject removed.");

            await loadData();
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong.");
        }
    }

    if (loading) {
        return <p>Loading subjects...</p>;
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
                    Add Subject
                </h2>

                <div className="mt-5 space-y-4">
                    <div>
                        <label className="mb-2 block font-medium">
                            Subject
                        </label>

                        <select
                            value={subjectId}
                            onChange={(e) =>
                                setSubjectId(e.target.value)
                            }
                            className="w-full rounded-lg border p-3"
                        >
                            <option value="">
                                Select a subject
                            </option>

                            {subjects.map((subject) => (
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
                        <label className="mb-2 block font-medium">
                            Proficiency Level
                        </label>

                        <select
                            value={proficiencyLevel}
                            onChange={(e) =>
                                setProficiencyLevel(e.target.value)
                            }
                            className="w-full rounded-lg border p-3"
                        >
                            <option value="BEGINNER">
                                Beginner
                            </option>

                            <option value="INTERMEDIATE">
                                Intermediate
                            </option>

                            <option value="ADVANCED">
                                Advanced
                            </option>

                            <option value="EXPERT">
                                Expert
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Grade Levels
                        </label>

                        <input
                            type="text"
                            value={gradeLevels}
                            onChange={(e) =>
                                setGradeLevels(e.target.value)
                            }
                            placeholder="Example: Grade 9, Grade 10, Grade 11"
                            className="w-full rounded-lg border p-3"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={addSubject}
                        disabled={saving}
                        className="rounded-lg bg-black px-6 py-3 font-medium text-white disabled:opacity-50"
                    >
                        {saving ? "Adding..." : "Add Subject"}
                    </button>
                </div>
            </section>

            <section>
                <h2 className="mb-4 text-xl font-semibold">
                    My Subjects
                </h2>

                {mySubjects.length === 0 ? (
                    <div className="rounded-xl border p-6 text-gray-600">
                        You have not added any subjects yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {mySubjects.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between rounded-xl border p-5"
                            >
                                <div>
                                    <h3 className="font-semibold">
                                        {item.subject.name}
                                    </h3>

                                    <p className="text-sm text-gray-600">
                                        Level:{" "}
                                        {item.proficiencyLevel ||
                                            "Not specified"}
                                    </p>

                                    {item.gradeLevels.length > 0 && (
                                        <p className="text-sm text-gray-600">
                                            Grades:{" "}
                                            {item.gradeLevels.join(", ")}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        removeSubject(item.id)
                                    }
                                    className="rounded-lg border px-4 py-2 text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}