"use client";

import { useEffect, useState } from "react";

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
    const [bookings, setBookings] =
        useState<Booking[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [updating, setUpdating] =
        useState<string | null>(null);

    const [message, setMessage] =
        useState("");

    async function loadBookings() {
        try {
            setLoading(true);

            const response = await fetch(
                "/api/tutor/bookings"
            );

            const data =
                await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Failed to load bookings."
                );
                return;
            }

            setBookings(
                data.bookings || []
            );
        } catch (error) {
            console.error(error);

            setMessage(
                "Failed to load bookings."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBookings();
    }, []);

    async function updateBooking(
        id: string,
        status: "CONFIRMED" | "CANCELLED"
    ) {
        try {
            setUpdating(id);
            setMessage("");

            const response = await fetch(
                `/api/tutor/bookings/${id}`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        status,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Failed to update booking."
                );
                return;
            }

            setMessage(
                data.message
            );

            await loadBookings();
        } catch (error) {
            console.error(error);

            setMessage(
                "Failed to update booking."
            );
        } finally {
            setUpdating(null);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen p-6">
                Loading bookings...
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 p-6">

            <div className="mx-auto max-w-5xl">

                <h1 className="text-3xl font-bold">
                    Tutor Bookings
                </h1>

                <p className="mt-2 text-gray-600">
                    Manage your students' tutoring
                    sessions.
                </p>

                {message && (
                    <div className="mt-6 rounded-lg border bg-white p-4">
                        {message}
                    </div>
                )}

                {bookings.length === 0 ? (
                    <div className="mt-8 rounded-xl border bg-white p-8 text-center">
                        <p className="text-gray-600">
                            You don't have any bookings
                            yet.
                        </p>
                    </div>
                ) : (
                    <div className="mt-8 space-y-5">

                        {bookings.map(
                            (booking) => (
                                <div
                                    key={
                                        booking.id
                                    }
                                    className="rounded-xl border bg-white p-6"
                                >

                                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                                        <div>

                                            <h2 className="text-lg font-semibold">
                                                {
                                                    booking
                                                        .student
                                                        .user
                                                        .email
                                                }
                                            </h2>

                                            <p className="mt-2 text-gray-600">
                                                {new Date(
                                                    booking.startTime
                                                ).toLocaleString()}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                Until{" "}
                                                {new Date(
                                                    booking.endTime
                                                ).toLocaleTimeString()}
                                            </p>

                                            {booking.request
                                                .message && (
                                                    <p className="mt-3 text-sm text-gray-600">
                                                        Message:{" "}
                                                        {
                                                            booking
                                                                .request
                                                                .message
                                                        }
                                                    </p>
                                                )}

                                        </div>

                                        <div className="flex flex-col items-start gap-3 md:items-end">

                                            <span className="rounded-full border px-3 py-1 text-sm">
                                                {
                                                    booking.status
                                                }
                                            </span>

                                            {booking.status ===
                                                "PENDING" && (
                                                    <div className="flex gap-2">

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                updating ===
                                                                booking.id
                                                            }
                                                            onClick={() =>
                                                                updateBooking(
                                                                    booking.id,
                                                                    "CONFIRMED"
                                                                )
                                                            }
                                                            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                                                        >
                                                            {updating ===
                                                                booking.id
                                                                ? "Updating..."
                                                                : "Confirm"}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                updating ===
                                                                booking.id
                                                            }
                                                            onClick={() =>
                                                                updateBooking(
                                                                    booking.id,
                                                                    "CANCELLED"
                                                                )
                                                            }
                                                            className="rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-50"
                                                        >
                                                            Cancel
                                                        </button>

                                                    </div>
                                                )}

                                            {booking.session && (
                                                <p className="text-sm text-gray-500">
                                                    Session:{" "}
                                                    {
                                                        booking
                                                            .session
                                                            .status
                                                    }
                                                </p>
                                            )}

                                        </div>

                                    </div>

                                </div>
                            )
                        )}

                    </div>
                )}

            </div>

        </main>
    );
}