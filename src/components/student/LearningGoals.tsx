"use client";

import { useEffect, useState } from "react";
import { Target, Plus, Trash2, Award, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

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
    const [isSuccess, setIsSuccess] = useState(false);

    async function loadGoals() {
        try {
            setLoading(true);
            const response = await fetch("/api/student/goals");
            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to load goals.");
                setIsSuccess(false);
                return;
            }

            setGoals(data.goals || []);
        } catch (error) {
            console.error(error);
            setMessage("Failed to load learning goals.");
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadGoals();
    }, []);

    async function createGoal(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) {
            setMessage("Please enter a learning goal title.");
            setIsSuccess(false);
            return;
        }

        setSaving(true);
        setMessage("");
        setIsSuccess(false);

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
                setIsSuccess(false);
                return;
            }

            setMessage("Learning goal added successfully.");
            setIsSuccess(true);
            setTitle("");
            setDescription("");
            setPriority("1");

            await loadGoals();
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong while creating goal.");
            setIsSuccess(false);
        } finally {
            setSaving(false);
        }
    }

    async function deleteGoal(id: string) {
        try {
            const response = await fetch(`/api/student/goals/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to delete goal.");
                setIsSuccess(false);
                return;
            }

            setMessage("Learning goal deleted.");
            setIsSuccess(true);
            await loadGoals();
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong.");
            setIsSuccess(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0070ad] border-t-transparent" />
            </div>
        );
    }

    function getPriorityBadge(p: number) {
        switch (p) {
            case 1:
                return <span className="bg-red-50 text-red-700 border-red-200 font-extrabold">P1 - Highest</span>;
            case 2:
                return <span className="bg-amber-50 text-amber-700 border-amber-200 font-extrabold">P2 - High</span>;
            case 3:
                return <span className="bg-sky-50 text-[#0070ad] border-sky-200 font-extrabold">P3 - Medium</span>;
            case 4:
                return <span className="bg-slate-100 text-slate-700 border-slate-200 font-bold">P4 - Low</span>;
            default:
                return <span className="bg-slate-100 text-slate-500 border-slate-200 font-medium">P5 - Lowest</span>;
        }
    }

    return (
        <div className="space-y-8">
            {message && (
                <div
                    className={`rounded-xl border p-4 text-xs font-bold flex items-center gap-2.5 ${isSuccess
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-red-200 bg-red-50 text-red-700"
                        }`}
                >
                    {isSuccess ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : (
                        <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                    )}
                    {message}
                </div>
            )}

            {/* Create Goal Form */}
            <form onSubmit={createGoal} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Target className="h-5 w-5 text-[#0070ad]" />
                        Set a New Learning Goal
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Define learning milestones and priorities for your tutors to focus on during sessions.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Goal Title / Target
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Master Calculus Integration & Derivatives by end of month"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-[#0070ad]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Priority Rank
                        </label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-[#0070ad]"
                        >
                            <option value="1">1 - Highest Priority</option>
                            <option value="2">2 - High Priority</option>
                            <option value="3">3 - Medium Priority</option>
                            <option value="4">4 - Low Priority</option>
                            <option value="5">5 - Lowest Priority</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                        Detailed Description / Milestones
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Detail specific topics, exam dates, or target scores..."
                        rows={3}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#0070ad]"
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#002b49] px-5 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-[#0070ad] transition disabled:opacity-50"
                >
                    <Plus className="h-4 w-4" />
                    {saving ? "Creating..." : "Add Learning Goal"}
                </button>
            </form>

            {/* Goals List */}
            <section className="space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Award className="h-5 w-5 text-[#0070ad]" />
                    My Active Goals ({goals.length})
                </h2>

                {goals.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                        <Target className="mx-auto h-10 w-10 text-slate-300" />
                        <p className="mt-2 text-xs font-bold text-slate-700">No learning goals defined</p>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                            Add learning goals above to track your academic progress.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {goals.map((goal) => (
                            <div
                                key={goal.id}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between space-y-4"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                            <Sparkles className="h-4 w-4 text-[#0070ad] shrink-0" />
                                            {goal.title}
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => deleteGoal(goal.id)}
                                            className="rounded-xl border border-slate-200 p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
                                            title="Delete Goal"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {goal.description && (
                                        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                            {goal.description}
                                        </p>
                                    )}
                                </div>

                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                    <span className="text-[11px] font-bold text-slate-400">
                                        Priority Level
                                    </span>
                                    <div className="rounded-lg border px-2.5 py-0.5 text-[11px]">
                                        {getPriorityBadge(goal.priority)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}