"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    CalendarDays,
    Clock,
    UserCheck,
    CheckCircle2,
    AlertCircle,
    Calendar as CalendarIcon,
    ArrowRight,
    Search,
    ShieldCheck,
} from "lucide-react";

type TutorRequest = {
    id: string;
    status: string;
    message?: string | null;
    tutor: {
        id: string;
        user: {
            email: string;
        };
    };
};

type Booking = {
    id: string;
    startTime: string;
    endTime: string;
    status: string;
    tutor: {
        user: {
            email: string;
        };
    };
    session?: {
        status: string;
    } | null;
};

export default function StudentBookingsPage() {
    const [requests, setRequests] = useState<TutorRequest[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedRequest, setSelectedRequest] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    async function loadData() {
        try {
            setLoading(true);

            const [requestsResponse, bookingsResponse] = await Promise.all([
                fetch("/api/student/tutor-requests"),
                fetch("/api/student/bookings"),
            ]);

            const requestsData = await requestsResponse.json();
            const bookingsData = await bookingsResponse.json();

            if (requestsResponse.ok) {
                setRequests(
                    (requestsData.requests || []).filter(
                        (request: TutorRequest) => request.status === "ACCEPTED"
                    )
                );
            }

            if (bookingsResponse.ok) {
                setBookings(bookingsData.bookings || []);
            }
        } catch (error) {
            console.error(error);
            setMessage("Failed to load booking information.");
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    async function createBooking(e: React.FormEvent) {
        e.preventDefault();
        setMessage("");
        setIsSuccess(false);

        if (!selectedRequest) {
            setMessage("Please select an accepted tutor.");
            return;
        }

        if (!date || !startTime || !endTime) {
            setMessage("Please select the date and time for the session.");
            return;
        }

        const start = `${date}T${startTime}`;
        const end = `${date}T${endTime}`;

        try {
            setBooking(true);

            const response = await fetch("/api/student/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    requestId: selectedRequest,
                    startTime: start,
                    endTime: end,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to create booking.");
                setIsSuccess(false);
                return;
            }

            setMessage("Tutoring session booked successfully!");
            setIsSuccess(true);

            setSelectedRequest("");
            setDate("");
            setStartTime("");
            setEndTime("");

            await loadData();
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong while creating the booking.");
            setIsSuccess(false);
        } finally {
            setBooking(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 p-6 md:p-10">
            <div className="mx-auto max-w-7xl space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <CalendarDays className="h-8 w-8 text-[#0070ad]" />
                            Session Scheduling & Bookings
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Book live learning sessions with your accepted tutors and manage scheduled classes.
                        </p>
                    </div>

                    <Link
                        href="/student/tutors"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#0070ad] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-sky-700 transition"
                    >
                        <Search className="h-4 w-4" />
                        Find More Tutors
                    </Link>
                </div>

                {message && (
                    <div
                        className={`rounded-xl border p-4 text-xs font-bold flex items-center gap-2.5 ${isSuccess
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                            : "border-red-200 bg-red-50 text-red-700"
                            }`}
                    >
                        {isSuccess ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        ) : (
                            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                        )}
                        {message}
                    </div>
                )}

                <div className="grid gap-8 lg:grid-cols-12">
                    {/* Create Booking Form */}
                    <section className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5 h-fit">
                        <div className="border-b border-slate-100 pb-4">
                            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <CalendarIcon className="h-5 w-5 text-[#0070ad]" />
                                Schedule a New Session
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Select a tutor from your accepted connections
                            </p>
                        </div>

                        {loading ? (
                            <div className="py-10 text-center">
                                <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-[#0070ad] border-t-transparent" />
                            </div>
                        ) : requests.length === 0 ? (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center space-y-3">
                                <UserCheck className="mx-auto h-8 w-8 text-slate-400" />
                                <div>
                                    <p className="text-xs font-bold text-slate-800">
                                        No accepted tutor requests
                                    </p>
                                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                                        You need an accepted tutor request before scheduling a session. Send a request to a tutor first.
                                    </p>
                                </div>
                                <Link
                                    href="/student/tutors"
                                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0070ad] hover:underline"
                                >
                                    Browse Available Tutors
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={createBooking} className="space-y-4">
                                <div>
                                    <label htmlFor="tutor" className="block text-xs font-bold text-slate-700 mb-1">
                                        Accepted Tutor
                                    </label>
                                    <select
                                        id="tutor"
                                        value={selectedRequest}
                                        onChange={(e) => setSelectedRequest(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-[#0070ad]"
                                    >
                                        <option value="">-- Choose Tutor --</option>
                                        {requests.map((r) => (
                                            <option key={r.id} value={r.id}>
                                                {r.tutor.user.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="date" className="block text-xs font-bold text-slate-700 mb-1">
                                        Session Date
                                    </label>
                                    <input
                                        id="date"
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        min={new Date().toISOString().split("T")[0]}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#0070ad]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor="startTime" className="block text-xs font-bold text-slate-700 mb-1">
                                            Start Time
                                        </label>
                                        <input
                                            id="startTime"
                                            type="time"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#0070ad]"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="endTime" className="block text-xs font-bold text-slate-700 mb-1">
                                            End Time
                                        </label>
                                        <input
                                            id="endTime"
                                            type="time"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#0070ad]"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={booking}
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#002b49] px-4 py-3 text-xs font-extrabold text-white shadow-sm hover:bg-[#0070ad] transition disabled:opacity-50"
                                >
                                    <Clock className="h-4 w-4" />
                                    {booking ? "Scheduling..." : "Confirm & Book Session"}
                                </button>
                            </form>
                        )}
                    </section>

                    {/* Booked Sessions List */}
                    <section className="lg:col-span-7 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-slate-900">
                                Scheduled Sessions ({bookings.length})
                            </h2>
                            <span className="text-xs font-medium text-slate-500">
                                Sorted by date
                            </span>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0070ad] border-t-transparent" />
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                                <CalendarDays className="mx-auto h-10 w-10 text-slate-300" />
                                <h3 className="mt-3 text-sm font-bold text-slate-800">No sessions scheduled yet</h3>
                                <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                                    Use the booking panel to pick a date and start live tutoring sessions.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3.5">
                                {bookings.map((item) => {
                                    const startDate = new Date(item.startTime);
                                    const endDate = new Date(item.endTime);
                                    const formattedDate = startDate.toLocaleDateString("en-US", {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    });
                                    const formattedStart = startDate.toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    });
                                    const formattedEnd = endDate.toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    });

                                    return (
                                        <div
                                            key={item.id}
                                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-[#0070ad] font-bold border border-sky-100">
                                                    <CalendarIcon className="h-6 w-6" />
                                                </div>

                                                <div className="space-y-1">
                                                    <h3 className="text-sm font-bold text-slate-900">
                                                        Tutoring with {item.tutor?.user?.email}
                                                    </h3>
                                                    <p className="text-xs text-slate-600 font-medium">
                                                        {formattedDate}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
                                                        <Clock className="h-3.5 w-3.5 text-[#0070ad]" />
                                                        {formattedStart} – {formattedEnd}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t border-slate-100 pt-3 md:border-0 md:pt-0 gap-2">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-extrabold ${item.status === "CONFIRMED"
                                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                        : item.status === "CANCELLED"
                                                            ? "bg-red-50 text-red-700 border border-red-200"
                                                            : "bg-amber-50 text-amber-700 border border-amber-200"
                                                        }`}
                                                >
                                                    <ShieldCheck className="h-3 w-3" />
                                                    {item.status}
                                                </span>

                                                {item.session && (
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                        Session Status: {item.session.status}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}