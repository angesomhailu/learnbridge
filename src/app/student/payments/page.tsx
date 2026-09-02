
"use client";

import { useEffect, useState } from "react";

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
    const [processingId, setProcessingId] =
        useState<string | null>(null);

    const [message, setMessage] = useState("");

    async function loadData() {
        try {
            setLoading(true);

            const [
                paymentsResponse,
                bookingsResponse,
            ] = await Promise.all([
                fetch("/api/student/payments"),
                fetch("/api/student/bookings"),
            ]);

            const paymentsData =
                await paymentsResponse.json();

            const bookingsData =
                await bookingsResponse.json();

            if (paymentsResponse.ok) {
                setPayments(
                    paymentsData.payments || []
                );
            }

            if (bookingsResponse.ok) {
                setBookings(
                    bookingsData.bookings || []
                );
            }

            if (
                !paymentsResponse.ok ||
                !bookingsResponse.ok
            ) {
                setMessage(
                    "Failed to load payment information."
                );
            }
        } catch (error) {
            console.error(error);

            setMessage(
                "Failed to load payment information."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    async function createPayment(
        bookingId: string
    ) {
        try {
            setProcessingId(bookingId);
            setMessage("");

            const response = await fetch(
                "/api/student/payments",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        bookingId,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Failed to create payment."
                );
                return;
            }

            setMessage(
                "Payment created successfully."
            );

            await loadData();
        } catch (error) {
            console.error(error);

            setMessage(
                "Something went wrong while creating payment."
            );
        } finally {
            setProcessingId(null);
        }
    }

    async function verifyPayment(
        paymentId: string
    ) {
        try {
            setProcessingId(paymentId);
            setMessage("");

            const response = await fetch(
                `/api/student/payments/${paymentId}/verify`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        provider: "TEST",
                        transactionId:
                            `TEST-${Date.now()}`,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Failed to verify payment."
                );
                return;
            }

            setMessage(
                "Payment completed successfully!"
            );

            await loadData();
        } catch (error) {
            console.error(error);

            setMessage(
                "Something went wrong while verifying payment."
            );
        } finally {
            setProcessingId(null);
        }
    }

    function formatAmount(
        amount: number | string
    ) {
        return Number(amount).toLocaleString(
            undefined,
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );
    }

    const confirmedBookings =
        bookings.filter(
            (booking) =>
                booking.status === "CONFIRMED" &&
                !booking.payment
        );

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto max-w-5xl">
                    Loading payments...
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-5xl">

                <h1 className="text-3xl font-bold">
                    Payments
                </h1>

                <p className="mt-2 text-gray-600">
                    Manage payments for your tutoring sessions.
                </p>

                {message && (
                    <div className="mt-6 rounded-lg border bg-white p-4">
                        {message}
                    </div>
                )}

                {/* Payments waiting to be created */}

                <section className="mt-8">

                    <h2 className="text-xl font-semibold">
                        Ready for Payment
                    </h2>

                    {confirmedBookings.length === 0 ? (
                        <div className="mt-4 rounded-xl border bg-white p-6">
                            <p className="text-gray-600">
                                No confirmed bookings are waiting for payment.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-4 space-y-4">

                            {confirmedBookings.map(
                                (booking) => (
                                    <div
                                        key={booking.id}
                                        className="rounded-xl border bg-white p-6"
                                    >
                                        <div className="flex flex-col justify-between gap-4 md:flex-row">

                                            <div>
                                                <h3 className="font-semibold">
                                                    {
                                                        booking
                                                            .tutor
                                                            .user
                                                            .email
                                                    }
                                                </h3>

                                                <p className="mt-2 text-sm text-gray-600">
                                                    {new Date(
                                                        booking.startTime
                                                    ).toLocaleString()}
                                                </p>

                                                <p className="mt-3 text-xl font-bold">
                                                    {formatAmount(
                                                        booking.amount
                                                    )}{" "}
                                                    ETB
                                                </p>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    createPayment(
                                                        booking.id
                                                    )
                                                }
                                                disabled={
                                                    processingId ===
                                                    booking.id
                                                }
                                                className="h-fit rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
                                            >
                                                {processingId ===
                                                    booking.id
                                                    ? "Processing..."
                                                    : "Create Payment"}
                                            </button>

                                        </div>
                                    </div>
                                )
                            )}

                        </div>
                    )}

                </section>

                {/* Existing payments */}

                <section className="mt-10">

                    <h2 className="text-xl font-semibold">
                        Payment History
                    </h2>

                    {payments.length === 0 ? (
                        <div className="mt-4 rounded-xl border bg-white p-6">
                            <p className="text-gray-600">
                                You don't have any payments yet.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-4 space-y-4">

                            {payments.map(
                                (payment) => (
                                    <div
                                        key={payment.id}
                                        className="rounded-xl border bg-white p-6"
                                    >
                                        <div className="flex flex-col justify-between gap-4 md:flex-row">

                                            <div>
                                                <h3 className="font-semibold">
                                                    {
                                                        payment
                                                            .booking
                                                            .tutor
                                                            .user
                                                            .email
                                                    }
                                                </h3>

                                                <p className="mt-2 text-sm text-gray-600">
                                                    Session:
                                                    {" "}
                                                    {new Date(
                                                        payment
                                                            .booking
                                                            .startTime
                                                    ).toLocaleString()}
                                                </p>

                                                <p className="mt-3 text-xl font-bold">
                                                    {formatAmount(
                                                        payment.amount
                                                    )}{" "}
                                                    {
                                                        payment.currency
                                                    }
                                                </p>

                                                {payment.transactionId && (
                                                    <p className="mt-2 text-sm text-gray-500">
                                                        Transaction:
                                                        {" "}
                                                        {
                                                            payment.transactionId
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-col items-end gap-3">

                                                <span className="rounded-full border px-3 py-1 text-sm">
                                                    {payment.status}
                                                </span>

                                                {payment.status ===
                                                    "PENDING" && (
                                                        <button
                                                            onClick={() =>
                                                                verifyPayment(
                                                                    payment.id
                                                                )
                                                            }
                                                            disabled={
                                                                processingId ===
                                                                payment.id
                                                            }
                                                            className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
                                                        >
                                                            {processingId ===
                                                                payment.id
                                                                ? "Processing..."
                                                                : "Pay Now"}
                                                        </button>
                                                    )}

                                            </div>

                                        </div>
                                    </div>
                                )
                            )}

                        </div>
                    )}

                </section>

            </div>
        </main>
    );
}
