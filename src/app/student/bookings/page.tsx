"use client";

import { useEffect, useState } from "react";

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

    const [selectedRequest, setSelectedRequest] =
        useState("");

    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);

    const [message, setMessage] = useState("");

    async function loadData() {
        try {
            setLoading(true);

            const [requestsResponse, bookingsResponse] =
                await Promise.all([
                    fetch("/api/student/tutor-requests"),
                    fetch("/api/student/bookings"),
                ]);

            const requestsData =
                await requestsResponse.json();

            const bookingsData =
                await bookingsResponse.json();

            if (requestsResponse.ok) {
                setRequests(
                    (requestsData.requests || []).filter(
                        (request: TutorRequest) =>
                            request.status === "ACCEPTED"
                    )
                );
            }

            if (bookingsResponse.ok) {
                setBookings(
                    bookingsData.bookings || []
                );
            }
        } catch (error) {
            console.error(error);

            setMessage(
                "Failed to load booking information."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    async function createBooking() {
        setMessage("");

        if (!selectedRequest) {
            setMessage(
                "Please select an accepted tutor."
            );
            return;
        }

        if (!date || !startTime || !endTime) {
            setMessage(
                "Please select the date and time."
            );
            return;
        }

        const start = `${date}T${startTime}`;
        const end = `${date}T${endTime}`;

        try {
            setBooking(true);

            const response = await fetch(
                "/api/student/bookings",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        requestId:
                            selectedRequest,
                        startTime: start,
                        endTime: end,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Failed to create booking."
                );
                return;
            }

            setMessage(
                "Booking created successfully!"
            );

            setSelectedRequest("");
            setDate("");
            setStartTime("");
            setEndTime("");

            await loadData();
        } catch (error) {
            console.error(error);

            setMessage(
                "Something went wrong while creating the booking."
            );
        } finally {
            setBooking(false);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen p-6">
                <div className="mx-auto max-w-5xl">
                    Loading bookings...
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-5xl">

                <h1 className="text-3xl font-bold">
                    My Bookings
                </h1>

                <p className="mt-2 text-gray-600">
                    Schedule and manage your tutoring
                    sessions.
                </p>

                {message && (
                    <div className="mt-6 rounded-lg border bg-white p-4">
                        {message}
                    </div>
                )}

                {/* Create booking */}

                <section className="mt-8 rounded-xl border bg-white p-6">

                    <h2 className="text-xl font-semibold">
                        Book a Tutoring Session
                    </h2>

                    {requests.length === 0 ? (
                        <div className="mt-4 rounded-lg bg-gray-50 p-5">
                            <p className="font-medium">
                                No accepted tutor requests.
                            </p>

                            <p className="mt-1 text-sm text-gray-600">
                                A tutor must accept your
                                request before you can
                                schedule a session.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-6 space-y-5">

                            {/* Tutor */}

                            <div>
                                <label
                                    htmlFor="tutor"
                                    className="block text-sm font-medium"
                                >
                                    Tutor
                                </label>

                                <select
                                    id="tutor"
                                    value={selectedRequest}
                                    onChange={(event) =>
                                        setSelectedRequest(
                                            event.target.value
                                        )
                                    }
                                    className="mt-2 w-full rounded-lg border p-3"
                                >
                                    <option value="">
                                        Select a tutor
                                    </option>

                                    {requests.map(
                                        (request) => (
                                            <option
                                                key={
                                                    request.id
                                                }
                                                value={
                                                    request.id
                                                }
                                            >
                                                {
                                                    request
                                                        .tutor
                                                        .user
                                                        .email
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* Date */}

                            <div>
                                <label
                                    htmlFor="date"
                                    className="block text-sm font-medium"
                                >
                                    Date
                                </label>

                                <input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={(event) =>
                                        setDate(
                                            event.target.value
                                        )
                                    }
                                    min={
                                        new Date()
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    className="mt-2 w-full rounded-lg border p-3"
                                />
                            </div>

                            {/* Time */}

                            <div className="grid gap-4 md:grid-cols-2">

                                <div>
                                    <label
                                        htmlFor="startTime"
                                        className="block text-sm font-medium"
                                    >
                                        Start Time
                                    </label>

                                    <input
                                        id="startTime"
                                        type="time"
                                        value={startTime}
                                        onChange={(event) =>
                                            setStartTime(
                                                event.target.value
                                            )
                                        }
                                        className="mt-2 w-full rounded-lg border p-3"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="endTime"
                                        className="block text-sm font-medium"
                                    >
                                        End Time
                                    </label>

                                    <input
                                        id="endTime"
                                        type="time"
                                        value={endTime}
                                        onChange={(event) =>
                                            setEndTime(
                                                event.target.value
                                            )
                                        }
                                        className="mt-2 w-full rounded-lg border p-3"
                                    />
                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={createBooking}
                                disabled={booking}
                                className="rounded-lg bg-black px-6 py-3 font-medium text-white disabled:opacity-50"
                            >
                                {booking
                                    ? "Creating Booking..."
                                    : "Book Session"}
                            </button>

                        </div>
                    )}

                </section>

                {/* Existing bookings */}

                <section className="mt-8">

                    <h2 className="text-xl font-semibold">
                        Scheduled Sessions
                    </h2>

                    {bookings.length === 0 ? (
                        <div className="mt-4 rounded-xl border bg-white p-8 text-center">
                            <p className="text-gray-600">
                                You don't have any bookings
                                yet.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-4 space-y-4">

                            {bookings.map(
                                (booking) => (
                                    <div
                                        key={
                                            booking.id
                                        }
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
                                            </div>

                                            <div className="text-right">

                                                <span className="rounded-full border px-3 py-1 text-sm">
                                                    {
                                                        booking.status
                                                    }
                                                </span>

                                                {booking.session && (
                                                    <p className="mt-2 text-sm text-gray-500">
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

                </section>

            </div>
        </main>
    );
}