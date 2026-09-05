"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock, CheckCircle2, AlertCircle, DollarSign, User, BookOpen } from "lucide-react";

type FamilyBooking = {
    id: string;
    studentId: string;
    tutorId: string;
    subjectId?: string;
    scheduledAt: string;
    durationMinutes: number;
    hourlyRate: number;
    currency: string;
    status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
    paymentStatus?: "UNPAID" | "PAID" | "REFUNDED";
    student?: {
        grade?: string;
        user: {
            email: string;
        };
    };
    tutor?: {
        user: {
            email: string;
        };
    };
    subject?: {
        name: string;
    };
};

export default function ParentBookingsPage() {
    const [bookings, setBookings] = useState<FamilyBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<"ALL" | "SCHEDULED" | "COMPLETED" | "CANCELLED">("ALL");

    useEffect(() => {
        fetchBookings();
    }, []);

    async function fetchBookings() {
        try {
            setLoading(true);
            const res = await fetch("/api/student/bookings");
            const data = await res.json();
            if (res.ok && data.success) {
                setBookings(data.bookings || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const filtered = bookings.filter((b) => {
        if (filterStatus === "ALL") return true;
        return b.status === filterStatus;
    });

    return (
        <main className="min-h-screen bg-slate-50 p-6 md:p-10 space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                        <CalendarDays className="h-8 w-8 text-indigo-600" />
                        Family Bookings & Schedule
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Monitor scheduled tutoring sessions, class durations, tutor rates, and session payment statuses.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
                    {(["ALL", "SCHEDULED", "COMPLETED", "CANCELLED"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilterStatus(tab)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${filterStatus === tab
                                    ? "bg-indigo-600 text-white shadow-xs"
                                    : "text-slate-500 hover:text-slate-900"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bookings List */}
            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm space-y-3">
                    <CalendarDays className="mx-auto h-12 w-12 text-slate-300" />
                    <h3 className="text-base font-bold text-slate-900">No session bookings found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Once tutor match requests are confirmed, scheduled tutoring sessions for your children will appear here.
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
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                                            {b.subject?.name || "General Session"}
                                        </span>
                                        <h3 className="text-base font-bold text-slate-900 mt-0.5">
                                            Tutor: {b.tutor?.user?.email || "Academic Tutor"}
                                        </h3>
                                    </div>

                                    <span
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${b.status === "COMPLETED"
                                                ? "bg-emerald-100 text-emerald-800"
                                                : b.status === "SCHEDULED"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-rose-100 text-rose-800"
                                            }`}
                                    >
                                        {b.status}
                                    </span>
                                </div>

                                {b.student?.user?.email && (
                                    <p className="text-xs text-slate-500">
                                        Child Student: <strong className="text-slate-800">{b.student.user.email}</strong>
                                    </p>
                                )}

                                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-indigo-500" />
                                        <div>
                                            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Date & Time</span>
                                            <span className="font-bold text-slate-800">
                                                {new Date(b.scheduledAt).toLocaleString([], {
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-emerald-500" />
                                        <div>
                                            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Rate</span>
                                            <span className="font-bold text-slate-800">
                                                {b.hourlyRate} {b.currency || "ETB"} / hr
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span className="text-slate-400">Duration: {b.durationMinutes || 60} mins</span>
                                <span
                                    className={`font-semibold ${b.paymentStatus === "PAID" ? "text-emerald-600" : "text-amber-600"
                                        }`}
                                >
                                    {b.paymentStatus === "PAID" ? "Payment Confirmed" : "Payment Pending"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
