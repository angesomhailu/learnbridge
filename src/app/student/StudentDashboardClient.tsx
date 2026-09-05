"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Search,
    Calendar,
    MessageSquare,
    Target,
    BookOpen,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    Star,
    ArrowRight,
    TrendingUp,
    DollarSign,
    CheckCircle2,
    X,
    Filter,
} from "lucide-react";

type Subject = {
    id: string;
    name: string;
};

type TutorPricing = {
    id: string;
    amount: string;
    currency: string;
    durationMinutes: number;
};

type TutorListItem = {
    id: string;
    bio?: string;
    experienceYears?: number;
    user: {
        email: string;
    };
    subjects: {
        id: string;
        subject: {
            name: string;
        };
    }[];
    pricing: TutorPricing[];
    score?: number;
    explanation?: string;
};

type Booking = {
    id: string;
    tutorId: string;
    startTime: string;
    endTime: string;
    status: string;
    tutor: {
        user: {
            email: string;
        };
    };
};

type TutorRequest = {
    id: string;
    tutorId: string;
    status: string;
    createdAt: string;
    tutor: {
        user: {
            email: string;
        };
    };
};

type Conversation = {
    id: string;
    status: string;
    createdAt: string;
    participants: {
        id: string;
        email: string;
        role: string;
    }[];
    latestMessage?: {
        content: string;
        createdAt: string;
    } | null;
};

export default function StudentDashboardClient({ session }: { session: any }) {
    const router = useRouter();

    // Data States
    const [independentEligible, setIndependentEligible] = useState(true);
    const [tutors, setTutors] = useState<TutorListItem[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [loadingTutors, setLoadingTutors] = useState(true);
    const [explainTutor, setExplainTutor] = useState<TutorListItem | null>(null);

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [requests, setRequests] = useState<TutorRequest[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [goalsCount, setGoalsCount] = useState(0);

    useEffect(() => {
        fetchProfile();
        loadSubjects();
        loadTutors("");
        fetchDashboardOverviewData();
    }, []);

    async function fetchProfile() {
        try {
            const res = await fetch("/api/student/profile");
            const data = await res.json();
            if (data.success && data.profile) {
                setIndependentEligible(data.profile.independentRequestEligible);
            }
        } catch (e) {
            console.error("Error fetching profile:", e);
        }
    }

    async function loadSubjects() {
        try {
            const res = await fetch("/api/subjects");
            const data = await res.json();
            if (res.ok) {
                setSubjects(data.subjects || []);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function loadTutors(subject = "") {
        try {
            setLoadingTutors(true);
            const url = subject ? `/api/tutors?subject=${encodeURIComponent(subject)}` : "/api/tutors";
            const res = await fetch(url);
            const data = await res.json();
            if (res.ok) {
                setTutors(data.tutors || []);
            }
        } catch (e) {
            console.error("Error fetching tutors:", e);
        } finally {
            setLoadingTutors(false);
        }
    }

    async function fetchDashboardOverviewData() {
        try {
            const [bRes, rRes, cRes, gRes] = await Promise.all([
                fetch("/api/student/bookings"),
                fetch("/api/student/tutor-requests"),
                fetch("/api/conversations"),
                fetch("/api/student/goals"),
            ]);

            const bData = await bRes.json();
            const rData = await rRes.json();
            const cData = await cRes.json();
            const gData = await gRes.json();

            if (bRes.ok && bData.success) setBookings(bData.bookings || []);
            if (rRes.ok && rData.success) setRequests(rData.requests || []);
            if (cRes.ok && cData.success) setConversations(cData.conversations || []);
            if (gRes.ok && gData.success) setGoalsCount((gData.goals || []).length);
        } catch (e) {
            console.error("Error fetching overview datasets:", e);
        }
    }

    async function sendRequest(tutorId: string) {
        if (!independentEligible) {
            alert(
                "Security Restriction: You are under 16. Your parent/guardian must submit tutor requests on your behalf."
            );
            return;
        }

        const msg = window.prompt("Write a short message to this tutor (e.g. subjects needing help, timing preference):");
        if (msg === null) return;

        try {
            const res = await fetch("/api/student/tutor-requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tutorId, message: msg }),
            });
            const data = await res.json();
            if (res.ok) {
                alert("Tutor request sent successfully! Once accepted, messaging and scheduling unlock.");
                fetchDashboardOverviewData();
            } else {
                alert(data.message || "Failed to send request.");
            }
        } catch (e) {
            console.error(e);
            alert("Something went wrong while sending request.");
        }
    }

    const pendingRequests = requests.filter((r) => r.status === "PENDING");
    const acceptedRequests = requests.filter((r) => r.status === "ACCEPTED");
    const upcomingBookings = bookings.filter((b) => b.status === "CONFIRMED" || b.status === "PENDING");

    return (
        <main className="min-h-screen bg-slate-50 p-6 md:p-10 space-y-8">
            {/* Top Welcome Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-2 max-w-xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-blue-100">
                            <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                            LearnBridge Student Portal
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                            Welcome back, {session?.user?.email?.split("@")[0] || "Student"}! 👋
                        </h1>
                        <p className="text-xs md:text-sm text-blue-100/90 leading-relaxed">
                            Discover top AI-matched tutors, track your active class requests, and reach your learning milestones.
                        </p>
                    </div>

                    {/* Mode Eligibility Status Badge */}
                    <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/20 flex items-start gap-3 min-w-[240px]">
                        {independentEligible ? (
                            <>
                                <ShieldCheck className="h-6 w-6 text-emerald-300 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="text-xs font-bold text-white block">Independent Mode Active</span>
                                    <span className="text-[11px] text-blue-100">Age 16+ • Direct match enabled</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <ShieldAlert className="h-6 w-6 text-amber-300 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="text-xs font-bold text-white block">Minor Guard Active</span>
                                    <span className="text-[11px] text-blue-100">Under 16 • Parent request mode</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                    href="/student/requests"
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition flex items-center justify-between"
                >
                    <div>
                        <p className="text-xs font-semibold text-slate-500">Tutor Requests</p>
                        <p className="text-2xl font-extrabold text-slate-900 mt-1">{requests.length}</p>
                        <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">
                            {acceptedRequests.length} Accepted • {pendingRequests.length} Pending
                        </span>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                        <Search className="h-6 w-6" />
                    </div>
                </Link>

                <Link
                    href="/student/bookings"
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition flex items-center justify-between"
                >
                    <div>
                        <p className="text-xs font-semibold text-slate-500">Booked Sessions</p>
                        <p className="text-2xl font-extrabold text-slate-900 mt-1">{bookings.length}</p>
                        <span className="text-[10px] text-blue-600 font-bold mt-1 inline-block">
                            {upcomingBookings.length} Upcoming Classes
                        </span>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
                        <Calendar className="h-6 w-6" />
                    </div>
                </Link>

                <Link
                    href="/student/messages"
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition flex items-center justify-between"
                >
                    <div>
                        <p className="text-xs font-semibold text-slate-500">Active Conversations</p>
                        <p className="text-2xl font-extrabold text-slate-900 mt-1">{conversations.length}</p>
                        <span className="text-[10px] text-indigo-600 font-bold mt-1 inline-block">
                            Direct Tutor Messaging
                        </span>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition">
                        <MessageSquare className="h-6 w-6" />
                    </div>
                </Link>

                <Link
                    href="/student/goals"
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition flex items-center justify-between"
                >
                    <div>
                        <p className="text-xs font-semibold text-slate-500">Learning Goals</p>
                        <p className="text-2xl font-extrabold text-slate-900 mt-1">{goalsCount}</p>
                        <span className="text-[10px] text-purple-600 font-bold mt-1 inline-block">
                            Milestone Tracker
                        </span>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition">
                        <Target className="h-6 w-6" />
                    </div>
                </Link>
            </div>

            {/* AI Tutor Recommendations Grid */}
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-blue-600" />
                            AI-Assisted Tutor Matches
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Weighted compatibility scoring algorithm calculates matching accuracy.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
                        <Filter className="h-4 w-4 text-slate-400" />
                        <select
                            value={selectedSubject}
                            onChange={(e) => {
                                setSelectedSubject(e.target.value);
                                loadTutors(e.target.value);
                            }}
                            className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none"
                        >
                            <option value="">All Subjects</option>
                            {subjects.map((sub) => (
                                <option key={sub.id} value={sub.name}>
                                    {sub.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {loadingTutors ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    </div>
                ) : tutors.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                        <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
                        <p className="mt-3 text-xs font-semibold text-slate-700">No tutors found for selected subject.</p>
                        <p className="text-xs text-slate-400 mt-1">Try switching subject filter or clear selection.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {tutors.map((tutor) => (
                            <div
                                key={tutor.id}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                            >
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Verified Tutor</span>
                                            <h3 className="text-sm font-bold text-slate-900 mt-0.5">{tutor.user?.email}</h3>
                                        </div>

                                        {tutor.score !== undefined && (
                                            <button
                                                onClick={() => setExplainTutor(tutor)}
                                                className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
                                                title="Click to view transparent match score calculation"
                                            >
                                                <Star className="h-3.5 w-3.5 fill-blue-600 text-blue-600" />
                                                {tutor.score}% Match
                                            </button>
                                        )}
                                    </div>

                                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                                        {tutor.bio || "Experienced tutor ready to assist with custom learning goals."}
                                    </p>

                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {tutor.subjects.map((sub) => (
                                            <span
                                                key={sub.id}
                                                className="rounded-md bg-slate-100 border border-slate-200/60 px-2 py-0.5 text-[10px] font-semibold text-slate-700"
                                            >
                                                {sub.subject.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <div>
                                        <span className="block text-[10px] uppercase font-semibold text-slate-400">Rate</span>
                                        <span className="text-xs font-bold text-slate-900">
                                            {tutor.pricing?.[0]
                                                ? `${tutor.pricing[0].amount} ${tutor.pricing[0].currency} / hr`
                                                : "Standard Rate"}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => sendRequest(tutor.id)}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-600 transition"
                                    >
                                        Request Match
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Score Explanation Modal */}
            {explainTutor && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-6 z-50 animate-fadeIn">
                    <div className="bg-white border border-slate-200 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-blue-600" />
                                Match Score Explanation
                            </h3>
                            <button
                                onClick={() => setExplainTutor(null)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <p className="text-xs text-slate-600">
                            Calculation breakdown for <strong>{explainTutor.user?.email}</strong> ({explainTutor.score}% Match Score):
                        </p>

                        <div className="space-y-2 max-h-60 overflow-y-auto text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200 font-mono text-slate-700 leading-relaxed">
                            {explainTutor.explanation?.split("\n").map((line, idx) => (
                                <p key={idx}>{line}</p>
                            ))}
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={() => setExplainTutor(null)}
                                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
                            >
                                Close Breakdown
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
