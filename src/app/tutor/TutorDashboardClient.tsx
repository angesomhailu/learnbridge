"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    ClipboardList,
    CalendarDays,
    Clock,
    DollarSign,
    BookOpen,
    GraduationCap,
    FileCheck,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    AlertCircle,
    UserCheck,
    MessageSquare,
    ChevronRight,
} from "lucide-react";

type TutorProfile = {
    id?: string;
    bio?: string | null;
    experienceYears?: number | null;
    isVerified?: boolean;
    languages?: string[];
};

type TutorRequest = {
    id: string;
    message?: string | null;
    status: string;
    createdAt: string;
    student: {
        id: string;
        grade: string;
        schoolName?: string | null;
        learningNeeds?: string | null;
        user: {
            email: string;
        };
        subjects: {
            id: string;
            subject: {
                name: string;
            };
        }[];
    };
};

type BookingSession = {
    id: string;
    scheduledAt: string;
    durationMinutes: number;
    hourlyRate: number;
    currency: string;
    status: string;
    student?: {
        user: {
            email: string;
        };
    };
    subject?: {
        name: string;
    };
};

export default function TutorDashboardClient({ session }: { session: any }) {
    const [profile, setProfile] = useState<TutorProfile | null>(null);
    const [requests, setRequests] = useState<TutorRequest[]>([]);
    const [bookings, setBookings] = useState<BookingSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        loadDashboardData();
    }, []);

    async function loadDashboardData() {
        try {
            setLoading(true);
            // Profile
            const profRes = await fetch("/api/tutor/profile");
            const profData = await profRes.json();
            if (profData.success) {
                setProfile(profData.profile || null);
            }

            // Requests
            const reqRes = await fetch("/api/tutor/requests");
            const reqData = await reqRes.json();
            if (reqData.success) {
                setRequests(reqData.requests || []);
            }

            // Bookings
            const bookRes = await fetch("/api/tutor/bookings");
            const bookData = await bookRes.json();
            if (bookData.success) {
                setBookings(bookData.bookings || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateRequest(requestId: string, status: "ACCEPTED" | "REJECTED") {
        try {
            const res = await fetch(`/api/tutor/requests/${requestId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            const data = await res.json();
            if (res.ok) {
                setMsg(`Request ${status.toLowerCase()} successfully.`);
                loadDashboardData();
                setTimeout(() => setMsg(""), 3000);
            } else {
                alert(data.message || "Failed to update request.");
            }
        } catch (e) {
            console.error(e);
        }
    }

    const pendingRequests = requests.filter((r) => r.status === "PENDING");
    const upcomingBookings = bookings.filter((b) => b.status === "SCHEDULED" || b.status === "CONFIRMED");

    return (
        <main className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
            {/* Header Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 md:p-8 shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2 relative z-10 max-w-xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                        Verified Educator Account
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                        Welcome back, {session?.user?.email?.split("@")[0]}!
                    </h1>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                        Manage your teaching schedule, accept student tutoring requests, and monitor student academic performance.
                    </p>
                </div>

                <div className="flex items-center gap-3 relative z-10 shrink-0">
                    <Link
                        href="/tutor/availability"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition"
                    >
                        <Clock className="h-4 w-4" />
                        Set Availability Slots
                    </Link>
                </div>
            </div>

            {msg && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {msg}
                </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Requests</span>
                        <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <ClipboardList className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900">{pendingRequests.length}</div>
                    <span className="text-[11px] text-slate-500 block">Awaiting your response</span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Sessions</span>
                        <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <CalendarDays className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900">{upcomingBookings.length}</div>
                    <span className="text-[11px] text-slate-500 block">Scheduled tutoring classes</span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Teaching Rate</span>
                        <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <DollarSign className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900">Active Rate</div>
                    <span className="text-[11px] text-emerald-600 font-semibold block">Configured in Pricing</span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profile Score</span>
                        <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Sparkles className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900">100%</div>
                    <span className="text-[11px] text-emerald-600 font-semibold block">Verified Educator</span>
                </div>
            </div>

            {/* Pending Requests Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <ClipboardList className="h-5 w-5 text-indigo-600" />
                            Pending Student Requests
                        </h2>
                        <p className="text-xs text-slate-500">Students seeking academic tutoring with you.</p>
                    </div>

                    <Link
                        href="/tutor/requests"
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                        View All ({requests.length}) <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="py-8 text-center text-xs text-slate-400">Loading student requests...</div>
                ) : pendingRequests.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-2">
                        <UserCheck className="h-10 w-10 text-slate-300 mx-auto" />
                        <h3 className="text-sm font-bold text-slate-900">No pending student requests</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            When students match with your subject competencies and request tutoring, they will show up here.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {pendingRequests.map((r) => (
                            <div
                                key={r.id}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
                            >
                                <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase text-indigo-600 tracking-wider">
                                                Student Account
                                            </span>
                                            <h3 className="font-bold text-sm text-slate-900">{r.student.user.email}</h3>
                                        </div>
                                        <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                                            PENDING
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <div>
                                            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Grade</span>
                                            <span className="font-bold text-slate-800">{r.student.grade}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-slate-400 block uppercase font-semibold">School</span>
                                            <span className="font-bold text-slate-800">{r.student.schoolName || "N/A"}</span>
                                        </div>
                                    </div>

                                    {r.message && (
                                        <p className="text-xs text-slate-600 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100 italic">
                                            "{r.message}"
                                        </p>
                                    )}
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => handleUpdateRequest(r.id, "REJECTED")}
                                        className="rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 px-3 py-1.5 text-xs font-bold transition"
                                    >
                                        Decline
                                    </button>
                                    <button
                                        onClick={() => handleUpdateRequest(r.id, "ACCEPTED")}
                                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 text-xs font-bold transition"
                                    >
                                        Accept Match
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Management Actions Grid */}
            <div className="space-y-4 pt-2">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    Tutor Profile & Teaching Controls
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href="/tutor/availability"
                        className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-300 hover:shadow-md transition space-y-2 group"
                    >
                        <Clock className="h-6 w-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold text-xs text-slate-900">Availability Slots</h3>
                        <p className="text-[11px] text-slate-500">Configure weekly open hours for student booking.</p>
                    </Link>

                    <Link
                        href="/tutor/pricing"
                        className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-emerald-300 hover:shadow-md transition space-y-2 group"
                    >
                        <DollarSign className="h-6 w-6 text-emerald-600 group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold text-xs text-slate-900">Pricing & Rates</h3>
                        <p className="text-[11px] text-slate-500">Set hourly rates, currencies, and discount options.</p>
                    </Link>

                    <Link
                        href="/tutor/subjects"
                        className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-300 hover:shadow-md transition space-y-2 group"
                    >
                        <BookOpen className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold text-xs text-slate-900">Subject Competencies</h3>
                        <p className="text-[11px] text-slate-500">Select subjects, grade levels, and expertise.</p>
                    </Link>

                    <Link
                        href="/tutor/education"
                        className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-purple-300 hover:shadow-md transition space-y-2 group"
                    >
                        <GraduationCap className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold text-xs text-slate-900">Degrees & Credentials</h3>
                        <p className="text-[11px] text-slate-500">Manage academic background and certifications.</p>
                    </Link>
                </div>
            </div>
        </main>
    );
}
