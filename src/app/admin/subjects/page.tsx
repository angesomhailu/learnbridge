"use client";

import { useEffect, useState } from "react";
import {
    BookOpen,
    Plus,
    Search,
    Edit3,
    Trash2,
    Clock,
    AlertCircle,
    X,
    Users,
    GraduationCap,
} from "lucide-react";

interface Subject {
    id: string;
    name: string;
    description?: string | null;
    createdAt: string;
    _count: {
        tutors: number;
        students: number;
    };
}

export default function AdminSubjectsPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

    const [nameInput, setNameInput] = useState("");
    const [descInput, setDescInput] = useState("");

    async function loadSubjects() {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/subjects");
            const data = await res.json();
            if (!res.ok) {
                setMessage(data.message || "Failed to load subjects");
                return;
            }
            setSubjects(data.subjects || []);
        } catch (error) {
            console.error(error);
            setMessage("Failed to fetch subject catalog.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSubjects();
    }, []);

    const handleCreateSubject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nameInput.trim()) return;

        try {
            const res = await fetch("/api/admin/subjects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: nameInput, description: descInput }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMessage(data.message || "Failed to create subject.");
                return;
            }
            setMessage(data.message);
            setIsAddModalOpen(false);
            setNameInput("");
            setDescInput("");
            await loadSubjects();
        } catch (error) {
            console.error(error);
            setMessage("Error creating subject.");
        }
    };

    const handleUpdateSubject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSubject || !nameInput.trim()) return;

        try {
            const res = await fetch(`/api/admin/subjects/${editingSubject.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: nameInput, description: descInput }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMessage(data.message || "Failed to update subject.");
                return;
            }
            setMessage(data.message);
            setEditingSubject(null);
            setNameInput("");
            setDescInput("");
            await loadSubjects();
        } catch (error) {
            console.error(error);
            setMessage("Error updating subject.");
        }
    };

    const handleDeleteSubject = async (id: string) => {
        if (!confirm("Are you sure you want to remove this subject from LearnBridge catalog?")) return;

        try {
            const res = await fetch(`/api/admin/subjects/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) {
                setMessage(data.message || "Failed to delete subject.");
                return;
            }
            setMessage(data.message);
            await loadSubjects();
        } catch (error) {
            console.error(error);
            setMessage("Error deleting subject.");
        }
    };

    const filteredSubjects = subjects.filter(
        (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-2xs">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold uppercase tracking-wider">
                        <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
                        Platform Catalog Controls
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Subject Catalog Management
                    </h1>
                    <p className="text-sm text-slate-600 max-w-xl leading-relaxed font-medium">
                        Create and organize academic subjects, monitor tutor coverage, and inspect student interest across the LearnBridge ecosystem.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setNameInput("");
                        setDescInput("");
                        setIsAddModalOpen(true);
                    }}
                    className="flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3.5 shadow-md transition shrink-0"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add New Subject</span>
                </button>
            </div>

            {message && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs font-bold text-blue-800 shadow-xs flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        {message}
                    </span>
                    <button onClick={() => setMessage("")} className="text-blue-800 underline font-bold">Dismiss</button>
                </div>
            )}

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
                <Search className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                    type="text"
                    placeholder="Search subject catalog by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs font-medium text-slate-800 placeholder-slate-400 outline-none bg-transparent"
                />
            </div>

            {/* Grid View */}
            {loading ? (
                <div className="flex items-center justify-center p-12 text-slate-500 text-xs font-bold">
                    <Clock className="h-5 w-5 animate-spin text-emerald-600 mr-2" />
                    <span>Loading subject catalog...</span>
                </div>
            ) : filteredSubjects.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500 text-xs font-medium shadow-2xs">
                    No subjects found. Add a new subject to populate the catalog.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredSubjects.map((subject) => (
                        <div
                            key={subject.id}
                            className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-4 hover:shadow-md transition flex flex-col justify-between"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-extrabold text-base text-slate-900">
                                        {subject.name}
                                    </h3>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => {
                                                setEditingSubject(subject);
                                                setNameInput(subject.name);
                                                setDescInput(subject.description || "");
                                            }}
                                            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition"
                                            title="Edit Subject"
                                        >
                                            <Edit3 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSubject(subject.id)}
                                            className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-600 transition"
                                            title="Delete Subject"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2 min-h-[36px]">
                                    {subject.description || "No description specified for this subject."}
                                </p>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                                    <GraduationCap className="h-3.5 w-3.5" />
                                    {subject._count.tutors} Tutors
                                </span>
                                <span className="flex items-center gap-1.5 font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl">
                                    <Users className="h-3.5 w-3.5" />
                                    {subject._count.students} Students
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-5 border border-slate-200">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h2 className="text-base font-extrabold text-slate-900">Add New Subject</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubject} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">Subject Name *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Advanced Calculus, Physics Grade 12"
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">Description</label>
                                <textarea
                                    rows={3}
                                    placeholder="Brief course/subject overview..."
                                    value={descInput}
                                    onChange={(e) => setDescInput(e.target.value)}
                                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                                >
                                    Create Subject
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingSubject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-5 border border-slate-200">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h2 className="text-base font-extrabold text-slate-900">Edit Subject</h2>
                            <button onClick={() => setEditingSubject(null)} className="p-1 text-slate-400 hover:text-slate-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateSubject} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">Subject Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">Description</label>
                                <textarea
                                    rows={3}
                                    value={descInput}
                                    onChange={(e) => setDescInput(e.target.value)}
                                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingSubject(null)}
                                    className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
