"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    CreditCard,
    DollarSign,
    CheckCircle2,
    Clock,
    ShieldCheck,
    Receipt,
    ArrowRight,
    Sparkles,
    AlertCircle,
} from "lucide-react";

type Payment = {
    id: string;
    amount: number | string;
    currency: string;
    status: string;
    provider: string | null;
    transactionId: string | null;
    paidAt: string | null;
    createdAt: string;
    booking: {
        id: string;
        startTime: string;
        endTime: string;
        status: string;
        tutor: {
            user: {
                email: string;
            };
        };
    };
};

type Booking = {
    id: string;
    amount: number | string;
    status: string;
    startTime: string;
    endTime: string;
    tutor: {
        user: {
            email: string;
        };
    };
    payment?: Payment | null;
};

export default function StudentPaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    async function loadData() {
        try {
            setLoading(true);

            const [paymentsResponse, bookingsResponse] = await Promise.all([
                fetch("/api/student/payments"),
                fetch("/api/student/bookings"),
            ]);

            const paymentsData = await paymentsResponse.json();
            const bookingsData = await bookingsResponse.json();

            if (paymentsResponse.ok) {
                setPayments(paymentsData.payments || []);
            }

            if (bookingsResponse.ok) {
                setBookings(bookingsData.bookings || []);
            }

            if (!paymentsResponse.ok || !bookingsResponse.ok) {
                setMessage("Failed to load payment information.");
                setIsSuccess(false);
            }
        } catch (error) {
            console.error(error);
            setMessage("Failed to load payment information.");
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    async function createPayment(bookingId: string) {
        try {
            setProcessingId(bookingId);
            setMessage("");
            setIsSuccess(false);

            const response = await fetch("/api/student/payments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ bookingId }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to create payment.");
                setIsSuccess(false);
                return;
            }

            setMessage("Payment invoice created successfully.");
            setIsSuccess(true);
            await loadData();
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong while creating payment.");
            setIsSuccess(false);
        } finally {
            setProcessingId(null);
        }
    }

    async function verifyPayment(paymentId: string) {
        try {
            setProcessingId(paymentId);
            setMessage("");
            setIsSuccess(false);

            const response = await fetch(`/api/student/payments/${paymentId}/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    provider: "TEST",
                    transactionId: `TEST-${Date.now()}`,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to verify payment.");
                setIsSuccess(false);
                return;
            }

            setMessage("Payment verified and completed successfully!");
            setIsSuccess(true);
            await loadData();
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong while verifying payment.");
            setIsSuccess(false);
        } finally {
            setProcessingId(null);
        }
    }

    function formatAmount(amount: number | string) {
        return Number(amount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    const confirmedBookings = bookings.filter(
        (b) => b.status === "CONFIRMED" && !b.payment
    );

    const completedPayments = payments.filter((p) => p.status === "COMPLETED");
    const totalSpent = completedPayments.reduce(
        (sum, p) => sum + Number(p.amount),
        0
    );

    return (
        <main className="min-h-screen bg-slate-50 p-6 md:p-10">
            <div className="mx-auto max-w-7xl space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <CreditCard className="h-8 w-8 text-[#0070ad]" />
                            Student Payments & Billing
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Track tutoring transactions, manage session invoices, and process secure payments.
                        </p>
                    </div>

                    <Link
                        href="/student/bookings"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#0070ad] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-sky-700 transition"
                    >
                        <Receipt className="h-4 w-4" />
                        My Bookings
                    </Link>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-5 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Total Paid
                            </span>
                            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
                                <DollarSign className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="text-2xl font-black text-slate-900">
                            {formatAmount(totalSpent)} <span className="text-sm font-semibold text-slate-500">ETB</span>
                        </p>
                        <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {completedPayments.length} completed transactions
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Ready for Payment
                            </span>
                            <div className="rounded-xl bg-sky-50 p-2 text-[#0070ad]">
                                <Clock className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="text-2xl font-black text-slate-900">
                            {confirmedBookings.length} <span className="text-sm font-semibold text-slate-500">Bookings</span>
                        </p>
                        <p className="text-[11px] text-[#0070ad] font-bold">
                            Confirmed sessions awaiting invoice
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Security Shield
                            </span>
                            <div className="rounded-xl bg-blue-50 p-2 text-[#002b49]">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="text-sm font-bold text-slate-800">
                            Protected Transactions
                        </p>
                        <p className="text-[11px] text-slate-500 leading-tight">
                            All payments are safely logged with audit verification and encrypted transactions.
                        </p>
                    </div>
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

                {/* Ready for Payment Section */}
                <section className="space-y-4">
                    <h2 className="text-base font-bold text-slate-900">
                        Confirmed Sessions Ready for Payment ({confirmedBookings.length})
                    </h2>

                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0070ad] border-t-transparent" />
                        </div>
                    ) : confirmedBookings.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
                            <p className="mt-2 text-xs font-bold text-slate-800">No pending payments required</p>
                            <p className="mt-0.5 text-[11px] text-slate-500">
                                All your confirmed bookings are paid or up to date.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {confirmedBookings.map((b) => (
                                <div
                                    key={b.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                                                Confirmed Session
                                            </span>
                                            <span className="text-base font-black text-slate-900">
                                                {formatAmount(b.amount)} ETB
                                            </span>
                                        </div>

                                        <h3 className="text-sm font-bold text-slate-900">
                                            Tutor: {b.tutor.user.email}
                                        </h3>

                                        <p className="text-xs text-slate-500 font-medium">
                                            {new Date(b.startTime).toLocaleString()}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => createPayment(b.id)}
                                        disabled={processingId === b.id}
                                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#002b49] px-4 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-[#0070ad] transition disabled:opacity-50"
                                    >
                                        <Receipt className="h-4 w-4" />
                                        {processingId === b.id ? "Processing..." : "Generate Invoice & Pay"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Payment History Section */}
                <section className="space-y-4 pt-4">
                    <h2 className="text-base font-bold text-slate-900">
                        Payment & Invoice History ({payments.length})
                    </h2>

                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0070ad] border-t-transparent" />
                        </div>
                    ) : payments.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                            <CreditCard className="mx-auto h-10 w-10 text-slate-300" />
                            <h3 className="mt-3 text-sm font-bold text-slate-800">No transaction records yet</h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Invoices and completed receipts will appear here automatically.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3.5">
                            {payments.map((p) => (
                                <div
                                    key={p.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-[#0070ad] font-bold border border-slate-200">
                                            <Receipt className="h-6 w-6" />
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="text-sm font-bold text-slate-900">
                                                Session with {p.booking?.tutor?.user?.email || "Tutor"}
                                            </h3>
                                            <p className="text-xs text-slate-600 font-medium">
                                                Date: {new Date(p.booking?.startTime).toLocaleString()}
                                            </p>
                                            {p.transactionId && (
                                                <p className="text-[11px] font-mono text-slate-400">
                                                    Tx ID: {p.transactionId}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t border-slate-100 pt-3 md:border-0 md:pt-0 gap-2">
                                        <div className="text-right">
                                            <span className="text-base font-black text-slate-900">
                                                {formatAmount(p.amount)} {p.currency}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-extrabold ${p.status === "COMPLETED"
                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                    : p.status === "FAILED"
                                                        ? "bg-red-50 text-red-700 border border-red-200"
                                                        : "bg-amber-50 text-amber-700 border border-amber-200"
                                                    }`}
                                            >
                                                <ShieldCheck className="h-3 w-3" />
                                                {p.status}
                                            </span>

                                            {p.status === "PENDING" && (
                                                <button
                                                    type="button"
                                                    onClick={() => verifyPayment(p.id)}
                                                    disabled={processingId === p.id}
                                                    className="rounded-xl bg-[#0070ad] px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-sky-700 disabled:opacity-50"
                                                >
                                                    {processingId === p.id ? "Processing..." : "Complete Payment"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
