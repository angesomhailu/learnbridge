"use client";

import { useEffect, useState } from "react";
import {
    ShieldAlert,
    AlertTriangle,
    CheckCircle2,
    Clock,
    X,
    MessageSquare,
    User,
    Check,
} from "lucide-react";

interface Report {
    id: string;
    reason: string;
    details?: string | null;
    status: "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "DISMISSED";
    createdAt: string;
    reporter: {
        id: string;
        email: string;
    };
    reportedUser?: {
        id: string;
        email: string;
        role: string;
    } | null;
}

export default function AdminReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [statusFilter, setStatusFilter] = useState("OPEN");
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [adminNote, setAdminNote] = useState("");

    async function loadReports() {
        setLoading(true);
        try {
            const url = `/api/admin/reports?status=${statusFilter}`;
            const res = await fetch(url);
            const data = await res.json();
            if (!res.ok) {
                setMessage(data.message || "Failed to load reports");
                return;
            }
            setReports(data.reports || []);
        } catch (error) {
            console.error(error);
            setMessage("Failed to fetch safety tickets.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadReports();
    }, [statusFilter]);

    const handleUpdateReport = async (reportId: string, status: string) => {
        try {
            const res = await fetch(`/api/admin/reports/${reportId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, adminNote }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMessage(data.message || "Failed to update report ticket.");
                return;
            }
            setMessage(data.message);
            setSelectedReport(null);
            setAdminNote("");
            await loadReports();
        } catch (error) {
            console.error(error);
            setMessage("Error resolving safety ticket.");
        }
    };

    const statusTabs = [
        { id: "OPEN", label: "Open Safety Tickets" },
        { id: "UNDER_REVIEW", label: "Under Review" },
        { id: "RESOLVED", label: "Resolved Tickets" },
        { id: "DISMISSED", label: "Dismissed" },
        { id: "ALL", label: "All Tickets" },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold uppercase tracking-wider">
                    <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
                    Platform Trust & Safety
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    User Reports & Incident Tickets
                </h1>
                <p className="text-sm text-slate-600 max-w-2xl leading-relaxed font-medium">
                    Inspect community policy violations, review user incident reports, communicate resolution notes, and enforce safety standard across LearnBridge.
                </p>
            </div>

            {message && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs font-bold text-blue-800 shadow-xs flex items-center justify-between">
                    <span>⚠️ {message}</span>
                    <button onClick={() => setMessage("")} className="text-blue-800 underline font-bold">Dismiss</button>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center gap-1.5">
                {statusTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setStatusFilter(tab.id)}
                        className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${statusFilter === tab.id
                            ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                            : "text-slate-600 hover:bg-slate-100 hover:text-rose-600"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Report Grid */}
            {loading ? (
                <div className="flex items-center justify-center p-12 text-slate-500 text-xs font-bold">
                    <Clock className="h-5 w-5 animate-spin text-rose-600 mr-2" />
                    <span>Loading safety ticket queue...</span>
                </div>
            ) : reports.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500 text-xs font-medium shadow-2xs">
                    No safety tickets found for current status filter.
                </div>
            ) : (
                <div className="space-y-4">
                    {reports.map((r) => (
                        <div
                            key={r.id}
                            className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-4 hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-6"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase bg-rose-50 text-rose-700 border-rose-200">
                                        {r.status}
                                    </span>
                                    <span className="text-xs text-slate-400 font-mono">
                                        Ticket ID: {r.id.slice(0, 10)}...
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        • Reported: {new Date(r.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 className="font-extrabold text-base text-slate-900">
                                    Reason: {r.reason}
                                </h3>

                                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
                                    <div>
                                        <span className="text-slate-400">Reporter:</span>{" "}
                                        <span className="font-bold text-slate-800">{r.reporter.email}</span>
                                    </div>
                                    {r.reportedUser && (
                                        <div>
                                            <span className="text-slate-400">Reported Target:</span>{" "}
                                            <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                                                {r.reportedUser.email} ({r.reportedUser.role})
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {r.details && (
                                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-200/60 font-medium">
                                        "{r.details}"
                                    </p>
                                )}
                            </div>

                            <div className="shrink-0 flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setSelectedReport(r);
                                        setAdminNote("");
                                    }}
                                    className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition"
                                >
                                    Resolve Ticket
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Resolve Modal */}
            {selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-5 border border-slate-200">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h2 className="text-base font-extrabold text-slate-900">Resolve Safety Ticket</h2>
                            <button onClick={() => setSelectedReport(null)} className="p-1 text-slate-400 hover:text-slate-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4 text-xs font-medium">
                            <p className="text-slate-700">
                                Update the status and attach an administrative resolution note for ticket{" "}
                                <span className="font-mono font-bold text-slate-900">{selectedReport.id.slice(0, 10)}...</span>
                            </p>

                            <div className="space-y-1">
                                <label className="font-bold text-slate-700">Resolution Note / Findings</label>
                                <textarea
                                    rows={3}
                                    placeholder="Enter administrative review summary or action taken..."
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-rose-500"
                                />
                            </div>

                            <div className="flex flex-col gap-2 pt-2">
                                <button
                                    onClick={() => handleUpdateReport(selectedReport.id, "RESOLVED")}
                                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                                >
                                    Mark Ticket RESOLVED
                                </button>
                                <button
                                    onClick={() => handleUpdateReport(selectedReport.id, "UNDER_REVIEW")}
                                    className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition"
                                >
                                    Mark UNDER REVIEW
                                </button>
                                <button
                                    onClick={() => handleUpdateReport(selectedReport.id, "DISMISSED")}
                                    className="w-full py-3 rounded-2xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                                >
                                    Dismiss Ticket
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
