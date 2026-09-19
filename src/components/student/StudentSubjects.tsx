"use client";

import { useEffect, useState } from "react";
import { BookOpen, Plus, Trash2, Award, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

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
    const [isSuccess, setIsSuccess] = useState(false);

    async function loadData() {
        try {
            setLoading(true);

            const [subjectsResponse, mySubjectsResponse] = await Promise.all([
                fetch("/api/subjects"),
                fetch("/api/student/subjects"),
            ]);

            const subjectsData = await subjectsResponse.json();
            const mySubjectsData = await mySubjectsResponse.json();

            if (!subjectsResponse.ok) {
                setMessage(subjectsData.message || "Failed to load subjects");
                setIsSuccess(false);
                return;
            }

            if (!mySubjectsResponse.ok) {
                setMessage(mySubjectsData.message || "Failed to load your subjects");
                setIsSuccess(false);
                return;
            }

            setSubjects(subjectsData.subjects || []);
            setMySubjects(mySubjectsData.subjects || []);
        } catch (error) {
            console.error(error);
            setMessage("Failed to load subjects.");
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    async function addSubject(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedSubject) {
            setMessage("Please select a subject.");
            setIsSuccess(false);
            return;
        }

        setAdding(true);
        setMessage("");
        setIsSuccess(false);

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
                setIsSuccess(false);
                return;
            }

            setMessage("Subject added successfully.");
            setIsSuccess(true);
            setSelectedSubject("");
            setCurrentLevel("Beginner");
            setNeedsHelp(true);

            await loadData();
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong while adding subject.");
            setIsSuccess(false);
        } finally {
            setAdding(false);
        }
    }

    async function removeSubject(id: string) {
        try {
            const response = await fetch(`/api/student/subjects/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to remove subject.");
                setIsSuccess(false);
                return;
            }

            setMessage("Subject removed successfully.");
            setIsSuccess(true);
            await loadData();
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

    const selectedIds = new Set(mySubjects.map((item) => item.subject.id));
    const availableSubjects = subjects.filter((subject) => !selectedIds.has(subject.id));

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

            {/* Add Subject Form */}
            <form onSubmit={addSubject} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-[#0070ad]" />
                        Enrol in Learning Subject
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Select a subject from the platform catalog to receive tailored tutor recommendations.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label htmlFor="subject" className="block text-xs font-bold text-slate-700 mb-1">
                            Available Subject
                        </label>
                        <select
                            id="subject"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-[#0070ad]"
                        >
                            <option value="">-- Select a subject --</option>
                            {availableSubjects.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="level" className="block text-xs font-bold text-slate-700 mb-1">
                            Current Proficiency Level
                        </label>
                        <select
                            id="level"
                            value={currentLevel}
                            onChange={(e) => setCurrentLevel(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-[#0070ad]"
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Elementary">Elementary</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                    <input
                        type="checkbox"
                        id="needsHelp"
                        checked={needsHelp}
                        onChange={(e) => setNeedsHelp(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-[#0070ad] focus:ring-[#0070ad]"
                    />
                    <label htmlFor="needsHelp" className="text-xs font-bold text-slate-700 cursor-pointer">
                        I am actively seeking tutor guidance for this subject
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={adding || !selectedSubject}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#002b49] px-5 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-[#0070ad] transition disabled:opacity-50"
                >
                    <Plus className="h-4 w-4" />
                    {adding ? "Adding..." : "Add Subject"}
                </button>
            </form>

            {/* My Subjects List */}
            <section className="space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Award className="h-5 w-5 text-[#0070ad]" />
                    My Enrolled Subjects ({mySubjects.length})
                </h2>

                {mySubjects.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                        <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
                        <p className="mt-2 text-xs font-bold text-slate-700">No subjects added yet</p>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                            Select subjects above to customize your learning profile.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {mySubjects.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between space-y-4"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                            <Sparkles className="h-4 w-4 text-[#0070ad]" />
                                            {item.subject.name}
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => removeSubject(item.id)}
                                            className="rounded-xl border border-slate-200 p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
                                            title="Remove Subject"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {item.subject.description && (
                                        <p className="text-xs text-slate-500 line-clamp-2">
                                            {item.subject.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                                    <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-[#0070ad] border border-sky-100">
                                        Level: {item.currentLevel || "Beginner"}
                                    </span>
                                    <span
                                        className={`text-[11px] font-bold ${item.needsHelp ? "text-amber-600" : "text-slate-400"
                                            }`}
                                    >
                                        {item.needsHelp ? "Actively Seeking Tutor" : "Self-Study"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}