"use client";

import { useEffect, useState } from "react";
import { ClipboardList, ShieldCheck, CheckCircle2, XCircle, Clock, AlertTriangle, UserCheck, Search } from "lucide-react";

type TutorRequest = {
    id: string;
    studentId: string;
    tutorId: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
    createdAt: string;
    student?: {
        grade?: string;
        user: {
            email: string;
        };
    };
    tutor?: {
        id: string;
        bio?: string;
        user: {
            email: string;
        };
    };
};

export default function ParentRequestsPage() {
    const [requests, setRequests] = useState<TutorRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "ACCEPTED" | "REJECTED">("ALL");

    useEffect(() => {
        fetchRequests();
    }, []);

    async function fetchRequests() {
        try {
            setLoading(true);
            const res = await fetch("/api/tutor/requests");
            const data = await res.json();
            if (res.ok && data.success) {
                setRequests(data.requests || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const filteredRequests = requests.filter((r) => {
        if (statusFilter === "ALL") return true;
        return r.status === statusFilter;
    });

    return (
        <main className="min-h-screen bg-slate-50 p-6 md:p-10 space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                        <ClipboardList className="h-8 w-8 text-indigo-600" />
                        Tutor Requests Oversight
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Review, authorize, and track status for tutor match requests across all linked dependent children.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
                    {(["ALL", "PENDING", "ACCEPTED", "REJECTED"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setStatusFilter(tab)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${statusFilter === tab
                                    ? "bg-indigo-600 text-white shadow-xs"
                                    : "text-slate-500 hover:text-slate-900"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Safety Banner */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 flex items-start gap-4 text-xs text-indigo-900">
                <ShieldCheck className="h-6 w-6 text-indigo-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <span className="font-bold text-slate-900 text-sm block">Parental Authorization & Oversight</span>
                    <p className="leading-relaxed text-slate-600">
                        For students under age 16, LearnBridge requires parental authorization for direct tutor contacts. Once a request is accepted by a verified tutor, a secure message thread will open in your inbox.
                    </p>
                </div>
            </div>

            {/* Requests List */}
            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                </div>
            ) : filteredRequests.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm space-y-3">
                    <ClipboardList className="mx-auto h-12 w-12 text-slate-300" />
                    <h3 className="text-base font-bold text-slate-900">No tutor requests match this criteria</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Tutor requests initiated by your children or submitted via recommended tutor profiles will appear here for tracking.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredRequests.map((r) => (
                        <div
                            key={r.id}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-900">
                                        Tutor: {r.tutor?.user?.email || "Academic Tutor"}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                        • Requested {new Date(r.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                {r.student?.user?.email && (
                                    <p className="text-xs text-slate-500">
                                        For Child Student: <strong className="text-indigo-600">{r.student.user.email}</strong>
                                    </p>
                                )}

                                {r.tutor?.bio && (
                                    <p className="text-xs text-slate-600 line-clamp-1 italic">
                                        "{r.tutor.bio}"
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${r.status === "ACCEPTED"
                                            ? "bg-emerald-100 text-emerald-800"
                                            : r.status === "PENDING"
                                                ? "bg-amber-100 text-amber-800"
                                                : "bg-rose-100 text-rose-800"
                                        }`}
                                >
                                    {r.status === "ACCEPTED" && <CheckCircle2 className="h-3.5 w-3.5" />}
                                    {r.status === "PENDING" && <Clock className="h-3.5 w-3.5" />}
                                    {r.status === "REJECTED" && <XCircle className="h-3.5 w-3.5" />}
                                    {r.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
