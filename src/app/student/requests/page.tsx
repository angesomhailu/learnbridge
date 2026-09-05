"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, CheckCircle2, Clock, XCircle, MessageSquare, CalendarPlus, ShieldAlert } from "lucide-react";

type RequestItem = {
    id: string;
    tutorId: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    message?: string | null;
    createdAt: string;
    tutor: {
        id: string;
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

export default function StudentRequestsPage() {
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"ALL" | "PENDING" | "ACCEPTED" | "REJECTED">("ALL");
    const [errorMsg, setErrorMsg] = useState("");
    const [independentEligible, setIndependentEligible] = useState(true);

    useEffect(() => {
        fetchProfile();
        fetchRequests();
    }, []);

    async function fetchProfile() {
        try {
            const res = await fetch("/api/student/profile");
            const data = await res.json();
            if (data.success && data.profile) {
                setIndependentEligible(data.profile.independentRequestEligible);
            }
        } catch (e) {
            console.error("Error loading profile:", e);
        }
    }

    async function fetchRequests() {
        try {
            setLoading(true);
            setErrorMsg("");
            const res = await fetch("/api/student/tutor-requests");
            const data = await res.json();
            if (res.ok && data.success) {
                setRequests(data.requests || []);
            } else {
                setErrorMsg(data.message || "Failed to load tutor requests.");
            }
        } catch (e) {
            console.error(e);
            setErrorMsg("Error connecting to server.");
        } finally {
            setLoading(false);
        }
    }

    const filteredRequests = requests.filter((r) => {
        if (filter === "ALL") return true;
        return r.status === filter;
    });

    return (
        <main className="min-h-screen bg-slate-50 p-6 md:p-10">
            <div className="mx-auto max-w-6xl space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <ClipboardList className="h-8 w-8 text-blue-600" />
                            My Tutor Requests
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Track the status of tutoring requests sent to verified tutors.
                        </p>
                    </div>

                    <Link
                        href="/student/tutors"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                    >
                        + Request New Tutor
                    </Link>
                </div>

                {!independentEligible && (
                    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-sm">
                        <ShieldAlert className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs leading-relaxed">
                            <p className="font-semibold">Minor Safety Restriction Active (Under 16)</p>
                            <p className="text-amber-700 mt-0.5">
                                You can view request statuses below, but sending new tutor requests requires authorization from your parent/guardian account.
                            </p>
                        </div>
                    </div>
                )}

                {/* Filter Tabs */}
                <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
                    {(["ALL", "PENDING", "ACCEPTED", "REJECTED"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${filter === tab
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "text-slate-600 hover:bg-slate-200/60"
                                }`}
                        >
                            {tab === "ALL" ? `All Requests (${requests.length})` : `${tab} (${requests.filter(r => r.status === tab).length})`}
                        </button>
                    ))}
                </div>

                {errorMsg && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
                        {errorMsg}
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                        <ClipboardList className="mx-auto h-12 w-12 text-slate-300" />
                        <h3 className="mt-4 text-base font-semibold text-slate-900">No requests found</h3>
                        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                            {filter === "ALL"
                                ? "You haven't submitted any tutor requests yet. Search verified tutors to request matches!"
                                : `No requests found matching the "${filter}" status.`}
                        </p>
                        {filter === "ALL" && (
                            <Link
                                href="/student/tutors"
                                className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                            >
                                Browse Tutors
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {filteredRequests.map((req) => (
                            <div
                                key={req.id}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-xs font-semibold text-slate-500">Tutor Contact</span>
                                            <h3 className="text-sm font-bold text-slate-900">{req.tutor?.user?.email}</h3>
                                        </div>

                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${req.status === "ACCEPTED"
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : req.status === "PENDING"
                                                        ? "bg-amber-100 text-amber-800"
                                                        : "bg-rose-100 text-rose-800"
                                                }`}
                                        >
                                            {req.status === "ACCEPTED" && <CheckCircle2 className="h-3.5 w-3.5" />}
                                            {req.status === "PENDING" && <Clock className="h-3.5 w-3.5" />}
                                            {req.status === "REJECTED" && <XCircle className="h-3.5 w-3.5" />}
                                            {req.status}
                                        </span>
                                    </div>

                                    {req.message && (
                                        <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-700 border border-slate-100 italic">
                                            "{req.message}"
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Subjects Offered</p>
                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                            {req.tutor?.subjects?.map((s) => (
                                                <span key={s.id} className="rounded-md bg-blue-50 border border-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                                                    {s.subject.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-[11px] text-slate-400">
                                        Submitted {new Date(req.createdAt).toLocaleDateString()}
                                    </span>

                                    {req.status === "ACCEPTED" && (
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href="/student/messages"
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                                            >
                                                <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
                                                Chat
                                            </Link>
                                            <Link
                                                href="/student/bookings"
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
                                            >
                                                <CalendarPlus className="h-3.5 w-3.5" />
                                                Book Session
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
