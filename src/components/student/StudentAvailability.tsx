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

export default function StudentAvailability() {
    const [items, setItems] = useState<Availability[]>([]);
    const [day, setDay] = useState("1");
    const [startTime, setStartTime] = useState("16:00");
    const [endTime, setEndTime] = useState("18:00");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    async function loadAvailability() {
        try {
            const response = await fetch("/api/student/availability");
            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message);
                return;
            }

            setItems(data.availability);
        } catch {
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

        const response = await fetch("/api/student/availability", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                dayOfWeek: Number(day),
                startTime,
                endTime,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            setMessage(data.message);
            setSaving(false);
            return;
        }

        setMessage("Availability added.");

        await loadAvailability();

        setSaving(false);
    }

    async function removeAvailability(id: string) {
        await fetch(`/api/student/availability/${id}`, {
            method: "DELETE",
        });

        await loadAvailability();
    }

    if (loading) return <p>Loading...</p>;

    return (
        <div className="space-y-8">
            {message && (
                <div className="rounded-lg border p-3">
                    {message}
                </div>
            )}

            <section className="rounded-xl border p-6 space-y-4">
                <h2 className="text-xl font-semibold">Add Time Slot</h2>

                <div>
                    <label className="mb-2 block">Day</label>

                    <select
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        className="w-full rounded-lg border p-3"
                    >
                        {days.map((d, index) => (
                            <option key={index} value={index}>
                                {d}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-2 block">Start</label>

                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full rounded-lg border p-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block">End</label>

                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full rounded-lg border p-3"
                        />
                    </div>
                </div>

                <button
                    onClick={addAvailability}
                    disabled={saving}
                    className="rounded-lg bg-black px-6 py-3 text-white"
                >
                    {saving ? "Saving..." : "Add Availability"}
                </button>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">
                    My Schedule
                </h2>

                {items.length === 0 ? (
                    <div className="rounded-xl border p-6 text-gray-600">
                        No availability added yet.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {items.map((slot) => (
                            <div
                                key={slot.id}
                                className="flex items-center justify-between rounded-lg border p-4"
                            >
                                <div>
                                    <p className="font-medium">
                                        {days[slot.dayOfWeek]}
                                    </p>

                                    <p className="text-sm text-gray-600">
                                        {slot.startTime} – {slot.endTime}
                                    </p>
                                </div>

                                <button
                                    onClick={() => removeAvailability(slot.id)}
                                    className="rounded-lg border px-4 py-2 text-sm"
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