"use client";

import { useEffect, useState } from "react";
import { Clock, Plus, Trash2, Calendar, CheckCircle2, AlertCircle } from "lucide-react";

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
    const [isSuccess, setIsSuccess] = useState(false);

    async function loadAvailability() {
        try {
            const response = await fetch("/api/student/availability");
            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to load availability.");
                setIsSuccess(false);
                return;
            }

            setItems(data.availability || []);
        } catch {
            setMessage("Failed to load availability.");
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAvailability();
    }, []);

    async function addAvailability(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setMessage("");
        setIsSuccess(false);

        try {
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
                setMessage(data.message || "Failed to add time slot.");
                setIsSuccess(false);
                setSaving(false);
                return;
            }

            setMessage("Availability time slot added.");
            setIsSuccess(true);
            await loadAvailability();
        } catch {
            setMessage("Something went wrong while saving availability.");
            setIsSuccess(false);
        } finally {
            setSaving(false);
        }
    }

    async function removeAvailability(id: string) {
        try {
            await fetch(`/api/student/availability/${id}`, {
                method: "DELETE",
            });
            await loadAvailability();
        } catch {
            setMessage("Failed to remove slot.");
            setIsSuccess(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0070ad] border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
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

            {/* Add Slot Form */}
            <form onSubmit={addAvailability} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-[#0070ad]" />
                        Add Preferred Tutoring Time
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Set your weekly recurring availability so tutors know when you can attend sessions.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Day of Week
                        </label>
                        <select
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-[#0070ad]"
                        >
                            {days.map((d, index) => (
                                <option key={index} value={index}>
                                    {d}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Start Time
                        </label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#0070ad]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            End Time
                        </label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#0070ad]"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#002b49] px-5 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-[#0070ad] transition disabled:opacity-50"
                >
                    <Plus className="h-4 w-4" />
                    {saving ? "Saving..." : "Add Time Slot"}
                </button>
            </form>

            {/* Schedule List */}
            <section className="space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#0070ad]" />
                    My Availability Schedule ({items.length})
                </h2>

                {items.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                        <Clock className="mx-auto h-10 w-10 text-slate-300" />
                        <p className="mt-2 text-xs font-bold text-slate-700">No availability set yet</p>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                            Add your free hours above to streamline session planning.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-3.5 md:grid-cols-2">
                        {items.map((slot) => (
                            <div
                                key={slot.id}
                                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-[#0070ad] font-bold">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-extrabold text-slate-900">
                                            {days[slot.dayOfWeek]}
                                        </p>
                                        <p className="text-xs text-slate-500 font-medium">
                                            {slot.startTime} – {slot.endTime}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeAvailability(slot.id)}
                                    className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
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