"use client";

import { useEffect, useState } from "react";

type Availability = {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
};

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

export default function TutorAvailability() {
    const [availability, setAvailability] =
        useState<Availability[]>([]);

    const [dayOfWeek, setDayOfWeek] = useState("1");
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    async function loadAvailability() {
        try {
            const response = await fetch(
                "/api/tutor/availability"
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Failed to load availability."
                );
                return;
            }

            setAvailability(data.availability || []);
        } catch (error) {
            console.error(error);
            setMessage("Failed to load availability.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAvailability();
    }, []);

    async function addAvailability() {
        setSaving(true);
        setMessage("");

        try {
            const response = await fetch(
                "/api/tutor/availability",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        dayOfWeek: Number(dayOfWeek),
                        startTime,
                        endTime,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Failed to add availability."
                );
                return;
            }

            setMessage(
                "Availability added successfully."
            );

            await loadAvailability();
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong.");
        } finally {
            setSaving(false);
        }
    }

    async function removeAvailability(id: string) {
        try {
            const response = await fetch(
                `/api/tutor/availability/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Failed to remove availability."
                );
                return;
            }

            setMessage(
                "Availability removed successfully."
            );

            await loadAvailability();
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong.");
        }
    }

    if (loading) {
        return <p>Loading availability...</p>;
    }

    return (
        <div className="space-y-8">
            {message && (
                <div className="rounded-lg border p-4">
                    {message}
                </div>
            )}

            <section className="rounded-xl border p-6">
                <h2 className="text-xl font-semibold">
                    Add Availability
                </h2>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div>
                        <label className="mb-2 block font-medium">
                            Day
                        </label>

                        <select
                            value={dayOfWeek}
                            onChange={(e) =>
                                setDayOfWeek(e.target.value)
                            }
                            className="w-full rounded-lg border p-3"
                        >
                            {days.map((day, index) => (
                                <option
                                    key={day}
                                    value={index}
                                >
                                    {day}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Start Time
                        </label>

                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) =>
                                setStartTime(e.target.value)
                            }
                            className="w-full rounded-lg border p-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            End Time
                        </label>

                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) =>
                                setEndTime(e.target.value)
                            }
                            className="w-full rounded-lg border p-3"
                        />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={addAvailability}
                    disabled={saving}
                    className="mt-5 rounded-lg bg-black px-6 py-3 font-medium text-white disabled:opacity-50"
                >
                    {saving
                        ? "Adding..."
                        : "Add Availability"}
                </button>
            </section>

            <section>
                <h2 className="mb-4 text-xl font-semibold">
                    My Availability
                </h2>

                {availability.length === 0 ? (
                    <div className="rounded-xl border p-6 text-gray-600">
                        No availability has been added yet.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {availability.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between rounded-xl border p-5"
                            >
                                <div>
                                    <p className="font-semibold">
                                        {days[item.dayOfWeek]}
                                    </p>

                                    <p className="text-gray-600">
                                        {item.startTime} -{" "}
                                        {item.endTime}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        removeAvailability(item.id)
                                    }
                                    className="rounded-lg border px-3 py-2 text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}