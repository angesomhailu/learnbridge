"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock, CheckCircle2, XCircle, User, AlertCircle, MessageSquare } from "lucide-react";

type Booking = {
    id: string;
    startTime: string;
    endTime: string;
    status: string;
    student: {
        user: {
            email: string;
        };
    };
    request: {
        id: string;
        message?: string | null;
        status: string;
    };
    session?: {
        status: string;
    } | null;
};

export default function TutorBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<"ALL" | "CONFIRMED" | "PENDING" | "CANCELLED">("ALL");
    const [msg, setMsg] = useState("");

    async function loadBookings() {
        try {
            setLoading(true);
            const response = await fetch("/api/tutor/bookings");
            const data = await response.json();
            if (response.ok && data.success) {
                setBookings(data.bookings || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBookings();
    }, []);

    async function updateBooking(id: string, status: "CONFIRMED" | "CANCELLED") {
        try {
            setUpdating(id);
            setMsg("");
            const response = await fetch(`/api/tutor/bookings/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            const data = await response.json();
            if (response.ok) {
                setMsg(data.message || `Booking ${status.toLowerCase()}!`);
                await loadBookings();
                setTimeout(() => setMsg(""), 3000);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUpdating(null);
        }
    }

    const filtered = bookings.filter((b) => {
        if (statusFilter === "ALL") return true;
        return b.status === statusFilter;
    });

    return (
        <main className="min-h-screen bg-slate-50 p-6 md:p-10 space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                        <CalendarDays className="h-8 w-8 text-emerald-600" />
                        Sessions & Class Bookings
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Track upcoming tutoring sessions, confirm requested class times, and manage student schedules.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
                    {(["ALL", "CONFIRMED", "PENDING", "CANCELLED"] as const).map((tab) => (
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

            {msg && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {msg}
                </div>
            )}

            {/* List */}
            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm space-y-3">
                    <CalendarDays className="mx-auto h-12 w-12 text-slate-300" />
                    <h3 className="text-base font-bold text-slate-900">No session bookings match this criteria</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Once students select an open availability slot, class bookings will be displayed here.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {filtered.map((b) => (
                        <div
                            key={b.id}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
                        >
                            <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                                            Student Booking
                                        </span>
                                        <h3 className="text-base font-bold text-slate-900 mt-0.5">{b.student.user.email}</h3>
                                    </div>

                                    <span
                                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold ${b.status === "CONFIRMED"
                                            ? "bg-emerald-100 text-emerald-800"
                                            : b.status === "PENDING"
                                                ? "bg-amber-100 text-amber-800"
                                                : "bg-rose-100 text-rose-800"
                                            }`}
                                    >
                                        {b.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <div>
                                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">Start Time</span>
                                        <span className="font-bold text-slate-800">
                                            {new Date(b.startTime).toLocaleString([], {
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">End Time</span>
                                        <span className="font-bold text-slate-800">
                                            {new Date(b.endTime).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {b.request.message && (
                                    <p className="text-xs text-slate-600 bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100 italic">
                                        "{b.request.message}"
                                    </p>
                                )}
                            </div>

                            {b.status === "PENDING" && (
                                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        disabled={updating === b.id}
                                        onClick={() => updateBooking(b.id, "CANCELLED")}
                                        className="rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 px-3 py-1.5 text-xs font-bold transition disabled:opacity-50"
                                    >
                                        Decline
                                    </button>
                                    <button
                                        type="button"
                                        disabled={updating === b.id}
                                        onClick={() => updateBooking(b.id, "CONFIRMED")}
                                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 text-xs font-bold transition shadow-xs disabled:opacity-50"
                                    >
                                        {updating === b.id ? "Confirming..." : "Confirm Booking"}
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