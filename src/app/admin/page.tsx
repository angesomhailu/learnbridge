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
    DollarSign,
    AlertTriangle,
    History,
    ChevronRight,
    TrendingUp,
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
    bookings: {
        total: number;
        pending: number;
        confirmed: number;
        completed: number;
        cancelled: number;
    };
    totalSubjects: number;
    openReportsCount: number;
    totalRevenue: number;
}

interface RecentUser {
    id: string;
    email: string;
    role: "STUDENT" | "PARENT" | "TUTOR" | "ADMIN";
    status: string;
    createdAt: string;
}

interface AuditLog {
    id: string;
    action: string;
    entity: string;
    createdAt: string;
    actor?: {
        email: string;
        role: string;
    };
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [recentAuditLogs, setRecentAuditLogs] = useState<AuditLog[]>([]);
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
            setRecentAuditLogs(data.recentAuditLogs || []);
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
            <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-rose-700 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 h-56 w-56 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-extrabold uppercase tracking-wider">
                            <ShieldAlert className="h-3.5 w-3.5" />
                            Platform Command Center
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            LearnBridge Administration Console
                        </h1>
                        <p className="text-sm text-blue-100 max-w-xl leading-relaxed font-medium">
                            Monitor system activity, audit educator credentials, manage platform users, inspect bookings, and resolve safety tickets in real-time.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={fetchStats}
                            disabled={loading}
                            className="flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-3 transition border border-white/20 backdrop-blur-md disabled:opacity-50"
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                            Refresh Console
                        </button>
                        <Link
                            href="/admin/tutors"
                            className="flex items-center gap-2 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold px-4 py-3 shadow-md transition"
                        >
                            <span>Verify Tutors ({stats?.tutors.pending || 0})</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700 shadow-xs flex items-center justify-between">
                    <span>⚠️ {error}</span>
                    <button onClick={() => setError("")} className="text-rose-800 underline">Dismiss</button>
                </div>
            )}

            {/* Platform KPI Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Users */}
                <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-2xs space-y-3 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Total Registered Users
                        </span>
                        <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900">
                        {loading ? "..." : stats?.totalUsers || 0}
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                            Students: {stats?.roles.STUDENT || 0}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                            Parents: {stats?.roles.PARENT || 0}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Tutors: {stats?.roles.TUTOR || 0}
                        </span>
                    </div>
                </div>

                {/* Verification Queue */}
                <div className="rounded-3xl bg-white p-6 border border-rose-200/80 shadow-2xs space-y-3 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                            Pending Verifications
                        </span>
                        <div className="h-10 w-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                            <Clock className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900">
                        {loading ? "..." : stats?.tutors.pending || 0}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                        Educator profiles awaiting degree & doc audits
                    </p>
                </div>

                {/* Verified Educators */}
                <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-2xs space-y-3 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                            Verified Educators
                        </span>
                        <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                            <UserCheck className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900">
                        {loading ? "..." : stats?.tutors.verified || 0}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                        Active certified tutors on LearnBridge
                    </p>
                </div>

                {/* Platform Revenue & Bookings */}
                <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-2xs space-y-3 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                            Platform Revenue
                        </span>
                        <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                            <DollarSign className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900">
                        {loading ? "..." : `${stats?.totalRevenue || 0} ETB`}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                        Across {stats?.bookings.total || 0} total bookings
                    </p>
                </div>
            </div>

            {/* Quick Actions Console */}
            <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        Administrative Quick Actions
                    </h2>
                    <span className="text-xs text-slate-400 font-medium">Instant Shortcuts</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href="/admin/tutors"
                        className="p-4 rounded-2xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/60 transition group space-y-1"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-rose-900">Tutor Verification Queue</span>
                            <ArrowRight className="h-4 w-4 text-rose-600 group-hover:translate-x-1 transition" />
                        </div>
                        <p className="text-[11px] text-rose-700">Review degree docs & issue verified badge.</p>
                    </Link>

                    <Link
                        href="/admin/users"
                        className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 transition group space-y-1"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-blue-900">Manage User Directory</span>
                            <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition" />
                        </div>
                        <p className="text-[11px] text-blue-700">Search users, update status or assign roles.</p>
                    </Link>

                    <Link
                        href="/admin/subjects"
                        className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60 transition group space-y-1"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-emerald-900">Subject Catalog</span>
                            <ArrowRight className="h-4 w-4 text-emerald-600 group-hover:translate-x-1 transition" />
                        </div>
                        <p className="text-[11px] text-emerald-700">Add or update subjects in system catalog.</p>
                    </Link>

                    <Link
                        href="/admin/reports"
                        className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 transition group space-y-1"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-amber-900">Safety & Incident Tickets</span>
                            <ArrowRight className="h-4 w-4 text-amber-600 group-hover:translate-x-1 transition" />
                        </div>
                        <p className="text-[11px] text-amber-700">Resolve reported tickets & user safety logs.</p>
                    </Link>
                </div>
            </div>

            {/* Two Column Layout: Tutor Review Alert & Recent Activity */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Pending Tutors Review Card */}
                <div className="lg:col-span-1 rounded-3xl bg-white p-6 border border-slate-200/80 shadow-2xs space-y-5 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                                🎓
                            </div>
                            <div>
                                <h3 className="font-extrabold text-slate-900 text-base">
                                    Tutor Approvals Breakdown
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Verification queue summary
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-[#f8fafc] p-4 border border-slate-200/80 space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                                    <Clock className="h-3.5 w-3.5 text-amber-600" /> Pending Review:
                                </span>
                                <span className="font-bold text-amber-700 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200">
                                    {stats?.tutors.pending || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Verified Active:
                                </span>
                                <span className="font-bold text-emerald-700 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">
                                    {stats?.tutors.verified || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                                    <XCircle className="h-3.5 w-3.5 text-rose-600" /> Rejected / Resubmission:
                                </span>
                                <span className="font-bold text-rose-700 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200">
                                    {(stats?.tutors.rejected || 0) + (stats?.tutors.resubmit || 0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/admin/tutors"
                        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 shadow-md transition"
                    >
                        <span>Open Verification Queue</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {/* Recent Registrations Log */}
                <div className="lg:col-span-2 rounded-3xl bg-white p-6 border border-slate-200/80 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <UserPlus className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-slate-900 text-base">
                                    Recent Account Registrations
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Latest profiles created on LearnBridge
                                </p>
                            </div>
                        </div>

                        <Link href="/admin/users" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                            <span>View All Users</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    {recentUsers.length === 0 ? (
                        <p className="text-slate-500 text-xs py-6 text-center">
                            No user registrations recorded yet.
                        </p>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {recentUsers.map((u) => {
                                const roleBadgeClass =
                                    u.role === "TUTOR"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : u.role === "PARENT"
                                            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                            : u.role === "ADMIN"
                                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                                : "bg-blue-50 text-blue-700 border-blue-200";

                                return (
                                    <div
                                        key={u.id}
                                        className="py-3 flex items-center justify-between text-xs hover:bg-slate-50 px-2 rounded-xl transition"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                                                {u.email[0]?.toUpperCase() || "U"}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">
                                                    {u.email}
                                                </p>
                                                <p className="text-[10px] text-slate-500">
                                                    Registered: {new Date(u.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${roleBadgeClass}`}
                                            >
                                                {u.role}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase">
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

            {/* Audit Logs Stream */}
            <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                            <History className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-slate-900 text-base">
                                Live Platform Audit Stream
                            </h3>
                            <p className="text-xs text-slate-500">
                                Recent administrative actions and entity modifications
                            </p>
                        </div>
                    </div>

                    <Link href="/admin/audit" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        <span>View Full Log</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                {recentAuditLogs.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">No system audit logs recorded yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {recentAuditLogs.map((log) => (
                            <div key={log.id} className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-1 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="font-extrabold text-blue-700 uppercase text-[10px] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                                        {log.action}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="font-bold text-slate-800 truncate">Entity: {log.entity}</p>
                                <p className="text-[11px] text-slate-500 truncate">By: {log.actor?.email || "System/Admin"}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}