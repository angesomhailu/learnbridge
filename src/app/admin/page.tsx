"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Users,
    UserCheck,
    CalendarDays,
    BookOpen,
    Clock,
    ArrowRight,
    RefreshCw,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    UserPlus,
} from "lucide-react";

interface AdminStats {
    totalUsers: number;
    roles: {
        STUDENT: number;
        PARENT: number;
        TUTOR: number;
        ADMIN: number;
    };
    tutors: {
        total: number;
        pending: number;
        verified: number;
        rejected: number;
        resubmit: number;
    };
    totalBookings: number;
    totalSubjects: number;
}

interface RecentUser {
    id: string;
    email: string;
    role: "STUDENT" | "PARENT" | "TUTOR" | "ADMIN";
    status: string;
    createdAt: string;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchStats = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/admin/stats");
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Failed to load admin metrics");
                return;
            }
            setStats(data.stats);
            setRecentUsers(data.recentUsers || []);
        } catch (err) {
            console.error(err);
            setError("Error connecting to server for admin stats");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            {/* Header Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-amber-950/40 p-6 sm:p-8 border border-rose-900/40 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 h-48 w-48 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
                            <ShieldAlert className="h-3.5 w-3.5" />
                            Platform Command Center
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            LearnBridge Admin Console
                        </h1>
                        <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                            Monitor system metrics, review educator credentials, manage platform users, and audit platform activity in real-time.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchStats}
                            disabled={loading}
                            className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-3 transition border border-slate-700 disabled:opacity-50"
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                            Refresh Data
                        </button>
                        <Link
                            href="/admin/tutors"
                            className="flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-3 shadow-lg shadow-rose-600/30 transition"
                        >
                            <span>Verify Tutors</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {error && (
                <div className="rounded-2xl border border-rose-800/80 bg-rose-950/60 p-4 text-xs text-rose-300 font-semibold">
                    ⚠️ {error}
                </div>
            )}

            {/* Platform KPI Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Users */}
                <div className="rounded-2xl bg-slate-950 p-6 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Total Users
                        </span>
                        <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-white">
                        {loading ? "..." : stats?.totalUsers || 0}
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-800">
                            Students: {stats?.roles.STUDENT || 0}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800">
                            Parents: {stats?.roles.PARENT || 0}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
                            Tutors: {stats?.roles.TUTOR || 0}
                        </span>
                    </div>
                </div>

                {/* Pending Verification */}
                <div className="rounded-2xl bg-slate-950 p-6 border border-rose-900/40 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                            Pending Verification
                        </span>
                        <div className="h-9 w-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                            <Clock className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-white">
                        {loading ? "..." : stats?.tutors.pending || 0}
                    </div>
                    <p className="text-xs text-slate-400">
                        Educator profiles awaiting credential review
                    </p>
                </div>

                {/* Verified Tutors */}
                <div className="rounded-2xl bg-slate-950 p-6 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                            Verified Educators
                        </span>
                        <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                            <UserCheck className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-white">
                        {loading ? "..." : stats?.tutors.verified || 0}
                    </div>
                    <p className="text-xs text-slate-400">
                        Active certified tutors on LearnBridge
                    </p>
                </div>

                {/* Platform Bookings */}
                <div className="rounded-2xl bg-slate-950 p-6 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                            Total Bookings
                        </span>
                        <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                            <CalendarDays className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-white">
                        {loading ? "..." : stats?.totalBookings || 0}
                    </div>
                    <p className="text-xs text-slate-400">
                        Sessions across {stats?.totalSubjects || 0} subjects catalog
                    </p>
                </div>
            </div>

            {/* Two Column Layout: Tutor Review Alert & Recent Activity */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Pending Tutors Review Card */}
                <div className="lg:col-span-1 rounded-3xl bg-slate-950 p-6 border border-slate-800 space-y-5 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
                                🎓
                            </div>
                            <div>
                                <h3 className="font-extrabold text-white text-base">
                                    Tutor Approvals
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Verification queue actions
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-slate-900/80 p-4 border border-slate-800 space-y-2.5">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 text-amber-400" /> Pending Review:
                                </span>
                                <span className="font-bold text-amber-300">
                                    {stats?.tutors.pending || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 flex items-center gap-1.5">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Verified Active:
                                </span>
                                <span className="font-bold text-emerald-400">
                                    {stats?.tutors.verified || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 flex items-center gap-1.5">
                                    <XCircle className="h-3.5 w-3.5 text-rose-400" /> Rejected / Resubmission:
                                </span>
                                <span className="font-bold text-rose-400">
                                    {(stats?.tutors.rejected || 0) + (stats?.tutors.resubmit || 0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/admin/tutors"
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-3.5 shadow-md shadow-rose-600/30 transition"
                    >
                        <span>Open Verification Console</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {/* Recent Registrations Log */}
                <div className="lg:col-span-2 rounded-3xl bg-slate-950 p-6 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                                <UserPlus className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-white text-base">
                                    Recent Registrations Stream
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Latest accounts created across LearnBridge
                                </p>
                            </div>
                        </div>

                        <span className="text-xs text-slate-400 font-mono">
                            Live Database Log
                        </span>
                    </div>

                    {recentUsers.length === 0 ? (
                        <p className="text-slate-500 text-xs py-6 text-center">
                            No user registrations recorded yet.
                        </p>
                    ) : (
                        <div className="divide-y divide-slate-800/60">
                            {recentUsers.map((u) => {
                                const roleBadgeClass =
                                    u.role === "TUTOR"
                                        ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                                        : u.role === "PARENT"
                                            ? "bg-indigo-950 text-indigo-300 border-indigo-800"
                                            : u.role === "ADMIN"
                                                ? "bg-rose-950 text-rose-300 border-rose-800"
                                                : "bg-blue-950 text-blue-300 border-blue-800";

                                return (
                                    <div
                                        key={u.id}
                                        className="py-3 flex items-center justify-between text-xs hover:bg-slate-900/40 px-2 rounded-xl transition"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-slate-300 text-xs">
                                                {u.email[0]?.toUpperCase() || "U"}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-200">
                                                    {u.email}
                                                </p>
                                                <p className="text-[10px] text-slate-500">
                                                    Registered: {new Date(u.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleBadgeClass}`}
                                            >
                                                {u.role}
                                            </span>
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase">
                                                {u.status}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}