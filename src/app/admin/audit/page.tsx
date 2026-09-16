"use client";

import { useEffect, useState } from "react";
import {
    History,
    Search,
    Clock,
    User,
    Shield,
    FileText,
    AlertCircle,
    Filter,
} from "lucide-react";

interface AuditLog {
    id: string;
    action: string;
    entity: string;
    entityId?: string | null;
    metadata?: any;
    createdAt: string;
    actor?: {
        id: string;
        email: string;
        role: string;
    } | null;
}

export default function AdminAuditLogsPage() {
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [entityFilter, setEntityFilter] = useState("ALL");

    async function loadAuditLogs() {
        setLoading(true);
        try {
            const url = `/api/admin/audit-logs?entity=${entityFilter}&query=${encodeURIComponent(searchQuery)}`;
            const res = await fetch(url);
            const data = await res.json();
            if (!res.ok) {
                setMessage(data.message || "Failed to load audit logs");
                return;
            }
            setAuditLogs(data.auditLogs || []);
        } catch (error) {
            console.error(error);
            setMessage("Failed to fetch system audit logs.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAuditLogs();
    }, [entityFilter]);

    const entityTabs = [
        { id: "ALL", label: "All Entities" },
        { id: "User", label: "Users" },
        { id: "TutorProfile", label: "Tutors" },
        { id: "Subject", label: "Subjects" },
        { id: "Booking", label: "Bookings" },
        { id: "Report", label: "Reports" },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-xs font-extrabold uppercase tracking-wider">
                    <History className="h-3.5 w-3.5 text-slate-600" />
                    Platform Security & Compliance
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Live Audit Stream & System Logs
                </h1>
                <p className="text-sm text-slate-600 max-w-2xl leading-relaxed font-medium">
                    Monitor real-time administrative events, track role assignments, audit profile verifications, subject additions, and state mutations across LearnBridge.
                </p>
            </div>

            {message && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs font-bold text-blue-800 shadow-xs flex items-center justify-between">
                    <span>⚠️ {message}</span>
                    <button onClick={() => setMessage("")} className="text-blue-800 underline font-bold">Dismiss</button>
                </div>
            )}

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
                <div className="flex flex-wrap items-center gap-1.5">
                    {entityTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setEntityFilter(tab.id)}
                            className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${entityFilter === tab.id
                                ? "bg-slate-900 text-white shadow-md shadow-slate-900/30"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        loadAuditLogs();
                    }}
                    className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-2xl text-xs"
                >
                    <Search className="h-4 w-4 text-slate-400 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search action or entity..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent text-slate-800 font-medium placeholder-slate-400 outline-none w-full md:w-56"
                    />
                    <button type="submit" className="px-3 py-1 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition">
                        Filter
                    </button>
                </form>
            </div>

            {/* Audit Log Table */}
            <div className="rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
                {loading ? (
                    <div className="flex items-center justify-center p-12 text-slate-500 text-xs font-bold">
                        <Clock className="h-5 w-5 animate-spin text-slate-600 mr-2" />
                        <span>Streaming audit logs...</span>
                    </div>
                ) : auditLogs.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-xs font-medium">
                        No audit events recorded for current filters.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                                    <th className="p-4 pl-6">Timestamp</th>
                                    <th className="p-4">Action Event</th>
                                    <th className="p-4">Target Entity</th>
                                    <th className="p-4">Performed By (Actor)</th>
                                    <th className="p-4 pr-6">Metadata Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                                {auditLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/80 transition">
                                        <td className="p-4 pl-6 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>

                                        <td className="p-4">
                                            <span className="font-extrabold text-blue-700 uppercase text-[10px] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
                                                {log.action}
                                            </span>
                                        </td>

                                        <td className="p-4 font-bold text-slate-800">
                                            {log.entity} <span className="font-mono text-slate-400 text-[10px]">({log.entityId || "N/A"})</span>
                                        </td>

                                        <td className="p-4">
                                            {log.actor ? (
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-bold text-slate-800">{log.actor.email}</span>
                                                    <span className="text-[10px] font-bold text-slate-400">({log.actor.role})</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic">System / Automated</span>
                                            )}
                                        </td>

                                        <td className="p-4 pr-6">
                                            {log.metadata ? (
                                                <pre className="text-[10px] font-mono text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200/60 max-w-xs overflow-x-auto">
                                                    {JSON.stringify(log.metadata)}
                                                </pre>
                                            ) : (
                                                <span className="text-slate-400 text-[11px]">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
