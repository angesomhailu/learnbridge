"use client";

import { useEffect, useState } from "react";

type Goal = {
    id: string;
    title: string;
    description: string | null;
    priority: number;
};

export default function LearningGoals() {
    const [goals, setGoals] = useState<Goal[]>([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("1");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    async function loadGoals() {
        try {
            setLoading(true);

            const response = await fetch("/api/student/goals");
            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to load goals.");
                return;
            }

            setGoals(data.goals);
        } catch (error) {
            console.error(error);
            setMessage("Failed to load learning goals.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadGoals();
    }, []);

    async function createGoal() {
        if (!title.trim()) {
            setMessage("Please enter a goal.");
            return;
        }

        setSaving(true);
        setMessage("");

        try {
            const response = await fetch("/api/student/goals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                    priority: Number(priority),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to create goal.");
                return;
            }

            setMessage("Learning goal added successfully.");

            setTitle("");
            setDescription("");
            setPriority("1");

            await loadGoals();
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong.");
        } finally {
            setSaving(false);
        }
    }

    async function deleteGoal(id: string) {
        if (!window.confirm("Delete this learning goal?")) {
            return;
        }

        try {
            const response = await fetch(
                `/api/student/goals/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to delete goal.");
                return;
            }

            setMessage("Learning goal deleted.");

            await loadGoals();
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong.");
        }
    }

    if (loading) {
        return <p>Loading learning goals...</p>;
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
                    Add Learning Goal
                </h2>

                <div className="mt-5 space-y-5">
                    <div>
                        <label className="mb-2 block font-medium">
                            Goal
                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Example: Improve my mathematics grade"
                            className="w-full rounded-lg border p-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            placeholder="Describe what you want to achieve..."
                            rows={4}
                            className="w-full rounded-lg border p-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Priority
                        </label>

                        <select
                            value={priority}
                            onChange={(e) =>
                                setPriority(e.target.value)
                            }
                            className="w-full rounded-lg border p-3"
                        >
                            <option value="1">1 - Highest</option>
                            <option value="2">2 - High</option>
                            <option value="3">3 - Medium</option>
                            <option value="4">4 - Low</option>
                            <option value="5">5 - Lowest</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={createGoal}
                        disabled={saving}
                        className="rounded-lg bg-black px-6 py-3 font-medium text-white disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Add Goal"}
                    </button>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold">
                    My Learning Goals
                </h2>

                {goals.length === 0 ? (
                    <div className="mt-4 rounded-xl border p-6 text-gray-600">
                        You haven't added any learning goals yet.
                    </div>
                ) : (
                    <div className="mt-4 space-y-4">
                        {goals.map((goal) => (
                            <div
                                key={goal.id}
                                className="rounded-xl border p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {goal.title}
                                        </h3>

                                        {goal.description && (
                                            <p className="mt-2 text-gray-600">
                                                {goal.description}
                                            </p>
                                        )}

                                        <p className="mt-3 text-sm">
                                            <strong>Priority:</strong>{" "}
                                            {goal.priority}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => deleteGoal(goal.id)}
                                        className="rounded-lg border px-4 py-2 text-sm"
                                    >
                                        Delete
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