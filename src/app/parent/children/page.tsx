"use client";

import { useEffect, useState } from "react";
import { Users, UserPlus, ShieldAlert, DollarSign, Calendar, Edit, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

type ChildStudent = {
    id: string;
    grade?: string;
    dateOfBirth: string;
    learningNeeds?: string;
    independentRequestEligible: boolean;
    user: {
        id: string;
        email: string;
    };
    budget?: {
        id: string;
        maxAmount: number;
        currency: string;
        period: string;
        isFlexible: boolean;
    } | null;
};

export default function ParentChildrenPage() {
    const [children, setChildren] = useState<ChildStudent[]>([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Register Form State
    const [showAddModal, setShowAddModal] = useState(false);
    const [childEmail, setChildEmail] = useState("");
    const [childPassword, setChildPassword] = useState("");
    const [childDOB, setChildDOB] = useState("");
    const [childGender, setChildGender] = useState<"MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY">("PREFER_NOT_TO_SAY");
    const [childGrade, setChildGrade] = useState("Grade 5");
    const [childNeeds, setChildNeeds] = useState("");
    const [childMaxBudget, setChildMaxBudget] = useState(250);
    const [childBudgetFlexible, setChildBudgetFlexible] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Edit Budget Modal
    const [editingChild, setEditingChild] = useState<ChildStudent | null>(null);
    const [editMaxBudget, setEditMaxBudget] = useState(250);
    const [editFlexible, setEditFlexible] = useState(true);

    useEffect(() => {
        fetchChildren();
    }, []);

    async function fetchChildren() {
        try {
            setLoading(true);
            const res = await fetch("/api/parent/children");
            const data = await res.json();
            if (res.ok && data.success) {
                setChildren(data.children || []);
            } else {
                setErrorMsg(data.message || "Failed to load children profiles.");
            }
        } catch (e) {
            console.error(e);
            setErrorMsg("Error connecting to server.");
        } finally {
            setLoading(false);
        }
    }

    async function handleAddChild(e: React.FormEvent) {
        e.preventDefault();
        setMsg("");
        setErrorMsg("");
        setSubmitting(true);

        try {
            const res = await fetch("/api/parent/children", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: childEmail,
                    password: childPassword,
                    dateOfBirth: childDOB,
                    gender: childGender,
                    grade: childGrade,
                    learningNeeds: childNeeds,
                    budget: {
                        maxAmount: childMaxBudget,
                        currency: "ETB",
                        period: "WEEKLY",
                        isFlexible: childBudgetFlexible,
                    },
                }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setMsg("Child student account registered and linked successfully!");
                setShowAddModal(false);
                setChildEmail("");
                setChildPassword("");
                setChildDOB("");
                setChildNeeds("");
                fetchChildren();
            } else {
                setErrorMsg(data.message || "Failed to register child account.");
            }
        } catch (err) {
            console.error(err);
            setErrorMsg("Network error registering child profile.");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleUpdateBudget(e: React.FormEvent) {
        e.preventDefault();
        if (!editingChild) return;

        try {
            const res = await fetch(`/api/parent/children/${editingChild.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    budget: {
                        maxAmount: editMaxBudget,
                        currency: "ETB",
                        period: "WEEKLY",
                        isFlexible: editFlexible,
                    },
                }),
            });
            if (res.ok) {
                setMsg("Child tutoring budget updated!");
                setEditingChild(null);
                fetchChildren();
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 p-6 md:p-10 space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                        <Users className="h-8 w-8 text-indigo-600" />
                        My Children Profiles
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Register dependent student accounts, manage learning needs, and enforce tutoring budget constraints.
                    </p>
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
                >
                    <UserPlus className="h-4 w-4" />
                    + Register Child Account
                </button>
            </div>

            {msg && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {msg}
                </div>
            )}

            {errorMsg && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-600" />
                    {errorMsg}
                </div>
            )}

            {/* Children Cards Grid */}
            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                </div>
            ) : children.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm space-y-4">
                    <Users className="mx-auto h-12 w-12 text-slate-300" />
                    <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-900">No children accounts registered yet</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            Link your student's account to authorize tutor requests, configure tutoring budget caps, and monitor class progress.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition"
                    >
                        <UserPlus className="h-4 w-4" />
                        Add Child Account Now
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {children.map((child) => (
                        <div
                            key={child.id}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                        >
                            <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Student Account</span>
                                        <h3 className="text-base font-bold text-slate-900 mt-0.5">{child.user?.email}</h3>
                                    </div>

                                    <span
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${child.independentRequestEligible
                                                ? "bg-emerald-100 text-emerald-800"
                                                : "bg-amber-100 text-amber-800"
                                            }`}
                                    >
                                        <ShieldAlert className="h-3.5 w-3.5" />
                                        {child.independentRequestEligible ? "Independent (16+)" : "Requires Parent Approval"}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                                    <div>
                                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">Grade Level</span>
                                        <span className="font-bold text-slate-900">{child.grade || "Not specified"}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">Date of Birth</span>
                                        <span className="font-bold text-slate-900">
                                            {new Date(child.dateOfBirth).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {child.learningNeeds && (
                                    <div className="text-xs">
                                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">Learning Needs / Topics</span>
                                        <p className="text-slate-700 bg-indigo-50/50 border border-indigo-100 p-2.5 rounded-lg italic mt-1">
                                            "{child.learningNeeds}"
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Weekly Budget Cap</span>
                                    <span className="text-xs font-extrabold text-indigo-700">
                                        {child.budget
                                            ? `${child.budget.maxAmount} ${child.budget.currency} (${child.budget.isFlexible ? "Flexible +20%" : "Strict"})`
                                            : "No Budget Cap Set"}
                                    </span>
                                </div>

                                <button
                                    onClick={() => {
                                        setEditingChild(child);
                                        setEditMaxBudget(child.budget?.maxAmount || 250);
                                        setEditFlexible(child.budget?.isFlexible ?? true);
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                                >
                                    <Edit className="h-3.5 w-3.5 text-indigo-600" />
                                    Edit Budget
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Register Child Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-6 z-50 animate-fadeIn">
                    <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl max-w-lg w-full space-y-6 shadow-2xl">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <UserPlus className="h-5 w-5 text-indigo-600" />
                                Register Dependent Student Account
                            </h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleAddChild} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Student Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={childEmail}
                                        onChange={(e) => setChildEmail(e.target.value)}
                                        placeholder="child@student.com"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={childPassword}
                                        onChange={(e) => setChildPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Date of Birth</label>
                                    <input
                                        type="date"
                                        required
                                        value={childDOB}
                                        onChange={(e) => setChildDOB(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Grade Level</label>
                                    <select
                                        value={childGrade}
                                        onChange={(e) => setChildGrade(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="Grade 1">Grade 1</option>
                                        <option value="Grade 3">Grade 3</option>
                                        <option value="Grade 5">Grade 5</option>
                                        <option value="Grade 8">Grade 8</option>
                                        <option value="Grade 10">Grade 10</option>
                                        <option value="Grade 12">Grade 12</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Max Rate (ETB / week)</label>
                                    <input
                                        type="number"
                                        value={childMaxBudget}
                                        onChange={(e) => setChildMaxBudget(Number(e.target.value))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="flex items-center pt-5">
                                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={childBudgetFlexible}
                                            onChange={(e) => setChildBudgetFlexible(e.target.checked)}
                                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        Allow +20% Budget Flexibility
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-700">Learning Needs / Topics</label>
                                <textarea
                                    value={childNeeds}
                                    onChange={(e) => setChildNeeds(e.target.value)}
                                    placeholder="Subjects or topics where guidance is needed..."
                                    rows={2}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50 transition"
                                >
                                    {submitting ? "Registering..." : "Create Child Account"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Budget Modal */}
            {editingChild && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-6 z-50 animate-fadeIn">
                    <div className="bg-white border border-slate-200 p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl">
                        <h3 className="font-bold text-slate-900">Adjust Tutoring Budget</h3>
                        <p className="text-xs text-slate-500">
                            Set maximum weekly tutoring spending limit for {editingChild.user?.email}
                        </p>
                        <form onSubmit={handleUpdateBudget} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-700">Max Amount (ETB)</label>
                                <input
                                    type="number"
                                    value={editMaxBudget}
                                    onChange={(e) => setEditMaxBudget(Number(e.target.value))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={editFlexible}
                                    onChange={(e) => setEditFlexible(e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                Allow 20% recommendation flexibility
                            </label>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingChild(null)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition"
                                >
                                    Save Budget
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
