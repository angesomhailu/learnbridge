"use client";

import { useEffect, useState } from "react";
import {
    CalendarDays,
    Search,
    Clock,
    AlertCircle,
    CheckCircle2,
    XCircle,
    User,
    DollarSign,
    X,
    ChevronRight,
} from "lucide-react";

interface Booking {
    id: string;
    startTime: string;
    endTime: string;
    amount: number;
    status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED" | "NO_SHOW";
    createdAt: string;
    student: {
        id: string;
        user: { email: string };
    };
    tutor: {
        id: string;
        user: { email: string };
    };
    request?: { message?: string | null };
    payment?: { status: string; amount: number; provider?: string | null } | null;
    session?: { status: string; startedAt?: string | null } | null;
}

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    async function loadBookings() {
        setLoading(true);
        try {
            const url = `/api/admin/bookings?status=${statusFilter}&query=${encodeURIComponent(searchQuery)}`;
            const res = await fetch(url);
            const data = await res.json();
            if (!res.ok) {
                setMessage(data.message || "Failed to load bookings");
                return;
            }
            setBookings(data.bookings || []);
        } catch (error) {
            console.error(error);
            setMessage("Failed to fetch bookings audit.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBookings();
    }, [statusFilter]);

    const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/admin/bookings/${bookingId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMessage(data.message || "Failed to update booking status.");
                return;
            }
            setMessage(data.message);
            await loadBookings();
            if (selectedBooking?.id === bookingId) {
                setSelectedBooking((prev) => prev ? { ...prev, status: newStatus as any } : null);
            }
        } catch (error) {
            console.error(error);
            setMessage("Error updating booking status.");
        }
    };

    const tabs = [
        { id: "ALL", label: "All Bookings" },
        { id: "PENDING", label: "PENDING" },
        { id: "CONFIRMED", label: "CONFIRMED" },
        { id: "COMPLETED", label: "COMPLETED" },
        { id: "CANCELLED", label: "CANCELLED" },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-extrabold uppercase tracking-wider">
                    <CalendarDays className="h-3.5 w-3.5 text-amber-600" />
                    Session & Transaction Audit
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Bookings & Sessions Audit Console
                </h1>
                <p className="text-sm text-slate-600 max-w-2xl leading-relaxed font-medium">
                    Audit platform tutoring sessions, inspect student-tutor booking records, review payment statuses, and override session statuses when needed.
                </p>
            </div>

            {message && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs font-bold text-blue-800 shadow-xs flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        {message}
                    </span>
                    <button onClick={() => setMessage("")} className="text-blue-800 underline font-bold">Dismiss</button>
                </div>
            )}

            {/* Controls */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
                <div className="flex flex-wrap items-center gap-1.5">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setStatusFilter(tab.id)}
                            className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${statusFilter === tab.id
                                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                                : "text-slate-600 hover:bg-slate-100 hover:text-amber-600"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        loadBookings();
                    }}
                    className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-2xl text-xs"
                >
                    <Search className="h-4 w-4 text-slate-400 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search student or tutor email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent text-slate-800 font-medium placeholder-slate-400 outline-none w-full md:w-56"
                    />
                    <button type="submit" className="px-3 py-1 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition">
                        Filter
                    </button>
                </form>
            </div>

            {/* Bookings Table */}
            <div className="rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
                {loading ? (
                    <div className="flex items-center justify-center p-12 text-slate-500 text-xs font-bold">
                        <Clock className="h-5 w-5 animate-spin text-amber-600 mr-2" />
                        <span>Loading bookings stream...</span>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-xs font-medium">
                        No bookings found matching filter criteria.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                                    <th className="p-4 pl-6">Booking ID</th>
                                    <th className="p-4">Student</th>
                                    <th className="p-4">Tutor</th>
                                    <th className="p-4">Schedule Date</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 pr-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                                {bookings.map((b) => {
                                    const statusBadge =
                                        b.status === "COMPLETED"
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                            : b.status === "CONFIRMED"
                                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                                : b.status === "CANCELLED"
                                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                                    : "bg-amber-50 text-amber-700 border-amber-200";

                                    return (
                                        <tr key={b.id} className="hover:bg-slate-50/80 transition">
                                            <td className="p-4 pl-6 font-mono text-slate-500 text-[11px]">
                                                {b.id.slice(0, 12)}...
                                            </td>

                                            <td className="p-4 font-bold text-slate-800">
                                                {b.student.user.email}
                                            </td>

                                            <td className="p-4 font-bold text-slate-800">
                                                {b.tutor.user.email}
                                            </td>

                                            <td className="p-4 text-slate-600">
                                                {new Date(b.startTime).toLocaleDateString()} {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>

                                            <td className="p-4 font-extrabold text-slate-900">
                                                {b.amount} ETB
                                            </td>

                                            <td className="p-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase ${statusBadge}`}>
                                                    {b.status}
                                                </span>
                                            </td>

                                            <td className="p-4 pr-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedBooking(b)}
                                                        className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold transition text-[11px]"
                                                    >
                                                        Details
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Inspect Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                    <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-5 border border-slate-200">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h2 className="text-base font-extrabold text-slate-900">Booking Session Details</h2>
                            <button onClick={() => setSelectedBooking(null)} className="p-1 text-slate-400 hover:text-slate-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4 text-xs font-medium">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-bold">Booking ID:</span>
                                    <span className="font-mono text-slate-800">{selectedBooking.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-bold">Student Email:</span>
                                    <span className="font-bold text-blue-700">{selectedBooking.student.user.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-bold">Tutor Email:</span>
                                    <span className="font-bold text-emerald-700">{selectedBooking.tutor.user.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-bold">Total Amount:</span>
                                    <span className="font-black text-slate-900">{selectedBooking.amount} ETB</span>
                                </div>
                            </div>

                            {selectedBooking.request?.message && (
                                <div className="space-y-1">
                                    <span className="text-slate-400 font-bold uppercase text-[10px]">Student Request Message</span>
                                    <p className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700">{selectedBooking.request.message}</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <span className="text-slate-400 font-bold uppercase text-[10px]">Admin Status Override</span>
                                <div className="flex flex-wrap gap-2">
                                    {["CONFIRMED", "COMPLETED", "CANCELLED"].map((st) => (
                                        <button
                                            key={st}
                                            onClick={() => handleUpdateBookingStatus(selectedBooking.id, st)}
                                            className={`px-3 py-2 rounded-xl text-xs font-bold transition border ${selectedBooking.status === st
                                                ? "bg-slate-900 text-white"
                                                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                                                }`}
                                        >
                                            Mark {st}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
