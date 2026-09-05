"use client";

import { useEffect, useState } from "react";
import { Clock, Plus, Trash2, CheckCircle2, AlertCircle, Calendar } from "lucide-react";

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
    const [availability, setAvailability] = useState<Availability[]>([]);
    const [dayOfWeek, setDayOfWeek] = useState("1");
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    async function loadAvailability() {
        try {
            const response = await fetch("/api/tutor/availability");
            const data = await response.json();
            if (response.ok && data.success) {
                setAvailability(data.availability || []);
            }
        } catch (error) {
            console.error(error);
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
            const response = await fetch("/api/tutor/availability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    dayOfWeek: Number(dayOfWeek),
                    startTime,
                    endTime,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage("Availability slot added successfully!");
                await loadAvailability();
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage(data.message || "Failed to add availability.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    }

    async function removeAvailability(id: string) {
        try {
            const response = await fetch(`/api/tutor/availability/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setMessage("Availability slot removed.");
                await loadAvailability();
                setTimeout(() => setMessage(""), 3000);
            }
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="h-7 w-7 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {message && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {message}
                </div>
            )}

            {/* Add Availability Slot Form */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Plus className="h-5 w-5 text-emerald-600" />
                    Add Weekly Teaching Slot
                </h2>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Day of Week</label>
                        <select
                            value={dayOfWeek}
                            onChange={(e) => setDayOfWeek(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            {days.map((day, index) => (
                                <option key={day} value={index}>
                                    {day}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Start Time</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">End Time</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="button"
                        onClick={addAvailability}
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition shadow-xs"
                    >
                        <Plus className="h-4 w-4" />
                        {saving ? "Saving..." : "Add Time Slot"}
                    </button>
                </div>
            </section>

            {/* Configured Slots List */}
            <section className="space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-emerald-600" />
                    Active Availability Schedule
                </h2>

                {availability.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-2">
                        <Calendar className="h-10 w-10 text-slate-300 mx-auto" />
                        <h3 className="text-sm font-bold text-slate-900">No availability slots configured</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            Add open time slots above so students can select tutoring session times.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {availability.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:shadow-md transition"
                            >
                                <div className="space-y-0.5">
                                    <span className="text-xs font-bold text-slate-900">{days[item.dayOfWeek]}</span>
                                    <p className="text-xs text-emerald-700 font-semibold">
                                        {item.startTime} – {item.endTime}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeAvailability(item.id)}
                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                                    title="Remove Slot"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}