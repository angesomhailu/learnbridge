"use client";

import { useEffect, useState } from "react";
import { BookOpen, Plus, Trash2, CheckCircle2, Award, GraduationCap } from "lucide-react";

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
    const [mySubjects, setMySubjects] = useState<TutorSubject[]>([]);
    const [subjectId, setSubjectId] = useState("");
    const [proficiencyLevel, setProficiencyLevel] = useState("INTERMEDIATE");
    const [gradeLevels, setGradeLevels] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    async function loadData() {
        try {
            const [subjectsResponse, tutorResponse] = await Promise.all([
                fetch("/api/subjects"),
                fetch("/api/tutor/subjects"),
            ]);

            const subjectsData = await subjectsResponse.json();
            const tutorData = await tutorResponse.json();

            if (subjectsResponse.ok && subjectsData.success) {
                setSubjects(subjectsData.subjects || []);
            }

            if (tutorResponse.ok && tutorData.success) {
                setMySubjects(tutorData.subjects || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    async function addSubject() {
        if (!subjectId) {
            setMessage("Please select a subject to add.");
            return;
        }

        setSaving(true);
        setMessage("");

        try {
            const response = await fetch("/api/tutor/subjects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subjectId,
                    proficiencyLevel,
                    gradeLevels: gradeLevels
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Subject competency added successfully!");
                setSubjectId("");
                setGradeLevels("");
                await loadData();
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage(data.message || "Failed to add subject.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    }

    async function removeSubject(id: string) {
        try {
            const response = await fetch(`/api/tutor/subjects/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setMessage("Subject removed from profile.");
                await loadData();
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
                    Add Subject Competency
                </h2>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Subject</label>
                        <select
                            value={subjectId}
                            onChange={(e) => setSubjectId(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">Select subject...</option>
                            {subjects.map((subject) => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Proficiency Level</label>
                        <select
                            value={proficiencyLevel}
                            onChange={(e) => setProficiencyLevel(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="BEGINNER">Beginner</option>
                            <option value="INTERMEDIATE">Intermediate</option>
                            <option value="ADVANCED">Advanced</option>
                            <option value="EXPERT">Expert / Master</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Eligible Grade Levels</label>
                        <input
                            type="text"
                            value={gradeLevels}
                            onChange={(e) => setGradeLevels(e.target.value)}
                            placeholder="e.g. Grade 9, Grade 10, Grade 11"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="button"
                        onClick={addSubject}
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition shadow-xs"
                    >
                        <Plus className="h-4 w-4" />
                        {saving ? "Saving..." : "Add Subject"}
                    </button>
                </div>
            </section>

            {/* List */}
            <section className="space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-emerald-600" />
                    My Teaching Competencies
                </h2>

                {mySubjects.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-2">
                        <BookOpen className="h-10 w-10 text-slate-300 mx-auto" />
                        <h3 className="text-sm font-bold text-slate-900">No subjects added yet</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            Add the subjects you specialize in above to allow student matching.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {mySubjects.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
                            >
                                <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-sm text-slate-900">{item.subject.name}</h3>
                                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                                            {item.proficiencyLevel || "STANDARD"}
                                        </span>
                                    </div>

                                    {item.gradeLevels?.length > 0 && (
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                                                Target Grades
                                            </span>
                                            <div className="flex flex-wrap gap-1">
                                                {item.gradeLevels.map((g, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-[10px] bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-semibold"
                                                    >
                                                        {g}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => removeSubject(item.id)}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-1 rounded-lg transition"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Remove Subject
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