"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Search,
    BookOpen,
    Star,
    Award,
    DollarSign,
    Send,
    X,
    Filter,
    ShieldAlert,
    CheckCircle2,
    MessageSquare,
    UserCircle,
    Clock,
    Sparkles,
} from "lucide-react";

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
    const [independentEligible, setIndependentEligible] = useState(true);

    // Modal state for sending requests
    const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
    const [requestMsg, setRequestMsg] = useState("");
    const [sending, setSending] = useState(false);
    const [modalError, setModalError] = useState("");
    const [modalSuccess, setModalSuccess] = useState("");

    useEffect(() => {
        fetchProfile();
        loadSubjects();
        loadTutors();
    }, []);

    async function fetchProfile() {
        try {
            const res = await fetch("/api/student/profile");
            const data = await res.json();
            if (data.success && data.profile) {
                setIndependentEligible(data.profile.independentRequestEligible);
            }
        } catch (e) {
            console.error("Failed to load profile:", e);
        }
    }

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
                setMessage(data.message || "Failed to load tutors.");
                return;
            }

            setTutors(data.tutors || []);
        } catch (error) {
            console.error("Failed to load tutors:", error);
            setMessage("Failed to connect to server.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSubjectChange(subject: string) {
        setSelectedSubject(subject);
        await loadTutors(subject);
    }

    function openRequestModal(tutor: Tutor) {
        if (!independentEligible) {
            alert(
                "Security Restriction: You are under 16. Your parent/guardian must submit tutor requests on your behalf."
            );
            return;
        }
        setSelectedTutor(tutor);
        setRequestMsg("");
        setModalError("");
        setModalSuccess("");
    }

    async function submitRequest(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedTutor) return;

        setSending(true);
        setModalError("");
        setModalSuccess("");

        try {
            const response = await fetch("/api/student/tutor-requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tutorId: selectedTutor.id,
                    message: requestMsg,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setModalError(data.message || "Failed to send tutor request.");
                return;
            }

            setModalSuccess("Request submitted successfully!");
            setTimeout(() => {
                setSelectedTutor(null);
                setModalSuccess("");
            }, 1800);
        } catch (error) {
            console.error(error);
            setModalError("Something went wrong while sending the request.");
        } finally {
            setSending(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 p-6 md:p-10">
            <div className="mx-auto max-w-7xl space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <Search className="h-8 w-8 text-[#0070ad]" />
                            Verified Tutors Catalog
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Discover expert tutors matched to your subject goals and learning budget.
                        </p>
                    </div>

                    <Link
                        href="/student/requests"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#0070ad] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-sky-700 transition"
                    >
                        <MessageSquare className="h-4 w-4" />
                        My Sent Requests
                    </Link>
                </div>

                {!independentEligible && (
                    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-sm">
                        <ShieldAlert className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs leading-relaxed">
                            <p className="font-semibold">Minor Safety Guard Active (Under 16)</p>
                            <p className="text-amber-700 mt-0.5">
                                You can browse verified tutors below, but submitting match requests requires approval from your linked parent/guardian account.
                            </p>
                        </div>
                    </div>
                )}

                {/* Subject Filter Bar */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                            <Filter className="h-4 w-4 text-[#0070ad]" />
                            Filter Tutors by Subject
                        </label>
                        {selectedSubject && (
                            <button
                                onClick={() => handleSubjectChange("")}
                                className="text-xs font-semibold text-[#0070ad] hover:underline"
                            >
                                Clear Filter
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleSubjectChange("")}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${selectedSubject === ""
                                ? "bg-[#002b49] text-white shadow-sm"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200/70"
                                }`}
                        >
                            All Subjects ({tutors.length})
                        </button>

                        {subjects.map((subject) => (
                            <button
                                key={subject.id}
                                onClick={() => handleSubjectChange(subject.name)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${selectedSubject === subject.name
                                    ? "bg-[#0070ad] text-white shadow-sm"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200/70"
                                    }`}
                            >
                                {subject.name}
                            </button>
                        ))}
                    </div>
                </div>

                {message && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
                        {message}
                    </div>
                )}

                {/* Tutors Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0070ad] border-t-transparent"></div>
                    </div>
                ) : tutors.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                        <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
                        <h3 className="mt-4 text-base font-bold text-slate-900">No tutors found</h3>
                        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                            There are currently no verified tutors listed for "{selectedSubject || "All Subjects"}". Try selecting a different filter.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {tutors.map((tutor) => {
                            const initial = tutor.user?.email?.[0]?.toUpperCase() || "T";
                            return (
                                <div
                                    key={tutor.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                                >
                                    <div className="space-y-4">
                                        {/* Tutor Header */}
                                        <div className="flex items-start gap-3.5">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#002b49] text-white font-extrabold text-base border border-[#0070ad]">
                                                {initial}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1.5">
                                                    <h3 className="truncate text-sm font-bold text-slate-900">
                                                        Tutor {tutor.user?.email?.split("@")[0]}
                                                    </h3>
                                                    <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                                                </div>

                                                <p className="truncate text-[11px] text-slate-500 font-medium">
                                                    {tutor.user.email}
                                                </p>

                                                <div className="mt-1 flex items-center gap-2">
                                                    <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-[#0070ad] border border-sky-100">
                                                        <Award className="h-3 w-3" />
                                                        {tutor.experienceYears ?? 0} yrs exp
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                                        Verified Tutor
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bio */}
                                        {tutor.bio && (
                                            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                "{tutor.bio}"
                                            </p>
                                        )}

                                        {/* Subjects */}
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                                Subjects Taught
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {tutor.subjects.length === 0 ? (
                                                    <span className="text-[11px] text-slate-400 italic">General Tutor</span>
                                                ) : (
                                                    tutor.subjects.map((sub) => (
                                                        <span
                                                            key={sub.id}
                                                            className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700"
                                                        >
                                                            {sub.subject.name}
                                                        </span>
                                                    ))
                                                )}
                                            </div>
                                        </div>

                                        {/* Pricing */}
                                        {tutor.pricing.length > 0 && (
                                            <div className="border-t border-slate-100 pt-3">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                                    Tutoring Rate
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {tutor.pricing.map((p) => (
                                                        <span
                                                            key={p.id}
                                                            className="inline-flex items-center gap-1 text-xs font-extrabold text-[#0070ad]"
                                                        >
                                                            <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                                                            {p.amount} {p.currency} / {p.durationMinutes} min
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <div className="mt-6 pt-4 border-t border-slate-100">
                                        <button
                                            type="button"
                                            onClick={() => openRequestModal(tutor)}
                                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#002b49] px-4 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-[#0070ad] transition"
                                        >
                                            <Send className="h-4 w-4" />
                                            Send Tutor Request
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Request Modal */}
            {selectedTutor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">
                                    Send Tutor Match Request
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Request to connect with {selectedTutor.user.email}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedTutor(null)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {modalError && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-700">
                                {modalError}
                            </div>
                        )}

                        {modalSuccess && (
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-bold text-emerald-800 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                {modalSuccess}
                            </div>
                        )}

                        <form onSubmit={submitRequest} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Personal Note / Learning Goals
                                </label>
                                <textarea
                                    rows={4}
                                    value={requestMsg}
                                    onChange={(e) => setRequestMsg(e.target.value)}
                                    placeholder="Introduce yourself and explain the subjects or topics you need help with..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#0070ad]"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedTutor(null)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#0070ad] px-5 py-2 text-xs font-extrabold text-white shadow-sm hover:bg-sky-700 disabled:opacity-50"
                                >
                                    {sending ? "Sending..." : "Submit Request"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}