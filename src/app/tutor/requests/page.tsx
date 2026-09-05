"use client";

import { useEffect, useState } from "react";
import { ClipboardList, CheckCircle2, XCircle, Clock, BookOpen, GraduationCap, School, MessageSquare } from "lucide-react";

type Student = {
    id: string;
    user: {
        email: string;
    };
    grade: string;
    schoolName?: string | null;
    bio?: string | null;
    learningNeeds?: string | null;
    subjects: {
        id: string;
        currentLevel?: string | null;
        needsHelp: boolean;
        subject: {
            name: string;
        };
    }[];
};

type TutorRequest = {
    id: string;
    message?: string | null;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    createdAt: string;
    student: Student;
};

export default function TutorRequestsPage() {
    const [requests, setRequests] = useState<TutorRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "ACCEPTED" | "REJECTED">("ALL");
    const [alertMsg, setAlertMsg] = useState("");

    async function loadRequests() {
        try {
            setLoading(true);
            const response = await fetch("/api/tutor/requests");
            const data = await response.json();
            if (response.ok && data.success) {
                setRequests(data.requests || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRequests();
    }, []);

    async function updateRequest(requestId: string, status: "ACCEPTED" | "REJECTED") {
        try {
            const response = await fetch(`/api/tutor/requests/${requestId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            const data = await response.json();
            if (response.ok) {
                setAlertMsg(`Request marked as ${status.toLowerCase()}!`);
                await loadRequests();
                setTimeout(() => setAlertMsg(""), 3000);
            } else {
                alert(data.message || "Failed to update request.");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const filtered = requests.filter((r) => {
        if (statusFilter === "ALL") return true;
        return r.status === statusFilter;
    });

    return (
        <main className="min-h-screen bg-slate-50 p-6 md:p-10 space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                        <ClipboardList className="h-8 w-8 text-emerald-600" />
                        Student Tutor Requests
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Review match requests from students and parents, evaluate learning needs, and confirm tutoring sessions.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
                    {(["ALL", "PENDING", "ACCEPTED", "REJECTED"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setStatusFilter(tab)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${statusFilter === tab
                                    ? "bg-emerald-600 text-white shadow-xs"
                                    : "text-slate-500 hover:text-slate-900"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {alertMsg && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {alertMsg}
                </div>
            )}

            {/* List */}
            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm space-y-3">
                    <ClipboardList className="mx-auto h-12 w-12 text-slate-300" />
                    <h3 className="text-base font-bold text-slate-900">No requests match this filter</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Student tutoring match requests will show up here once submitted by students or parents.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((request) => (
                        <div
                            key={request.id}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition space-y-4"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                                        Student Account
                                    </span>
                                    <h3 className="text-base font-bold text-slate-900">{request.student.user.email}</h3>
                                </div>

                                <span
                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold w-fit ${request.status === "ACCEPTED"
                                            ? "bg-emerald-100 text-emerald-800"
                                            : request.status === "PENDING"
                                                ? "bg-amber-100 text-amber-800"
                                                : "bg-rose-100 text-rose-800"
                                        }`}
                                >
                                    {request.status === "ACCEPTED" && <CheckCircle2 className="h-3 w-3" />}
                                    {request.status === "PENDING" && <Clock className="h-3 w-3" />}
                                    {request.status === "REJECTED" && <XCircle className="h-3 w-3" />}
                                    {request.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div>
                                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Grade Level</span>
                                    <span className="font-bold text-slate-900">{request.student.grade}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">School</span>
                                    <span className="font-bold text-slate-900">{request.student.schoolName || "Not specified"}</span>
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Requested Date</span>
                                    <span className="font-bold text-slate-900">{new Date(request.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {request.student.learningNeeds && (
                                <div className="text-xs space-y-1">
                                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Learning Needs</span>
                                    <p className="text-slate-700 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 italic">
                                        "{request.student.learningNeeds}"
                                    </p>
                                </div>
                            )}

                            {request.message && (
                                <div className="text-xs space-y-1">
                                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Personal Note</span>
                                    <p className="text-slate-700 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 italic">
                                        "{request.message}"
                                    </p>
                                </div>
                            )}

                            {request.student.subjects?.length > 0 && (
                                <div className="space-y-1 text-xs">
                                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Requested Subjects</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {request.student.subjects.map((sub) => (
                                            <span
                                                key={sub.id}
                                                className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 font-semibold text-slate-700"
                                            >
                                                {sub.subject.name} {sub.currentLevel ? `(${sub.currentLevel})` : ""}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {request.status === "PENDING" && (
                                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => updateRequest(request.id, "REJECTED")}
                                        className="rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 px-4 py-2 text-xs font-bold transition"
                                    >
                                        Decline Request
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => updateRequest(request.id, "ACCEPTED")}
                                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-xs font-bold transition shadow-xs"
                                    >
                                        Accept Match Request
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}