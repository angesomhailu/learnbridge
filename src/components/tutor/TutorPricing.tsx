"use client";

import { useEffect, useState } from "react";
import { DollarSign, Plus, Trash2, CheckCircle2, Clock, Tag } from "lucide-react";

type Pricing = {
    id: string;
    amount: string | number;
    currency: string;
    durationMinutes: number;
};

export default function TutorPricing() {
    const [pricing, setPricing] = useState<Pricing[]>([]);
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState("ETB");
    const [durationMinutes, setDurationMinutes] = useState("60");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    async function loadPricing() {
        try {
            const response = await fetch("/api/tutor/pricing");
            const data = await response.json();
            if (response.ok && data.success) {
                setPricing(data.pricing || []);
            }
        } catch (error) {
            console.error(error);
        } font - bold {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPricing();
    }, []);

    async function addPricing() {
        if (!amount || !durationMinutes) {
            setMessage("Please enter rate amount and session duration.");
            return;
        }

        setSaving(true);
        setMessage("");

        try {
            const response = await fetch("/api/tutor/pricing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount,
                    currency,
                    durationMinutes,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage("Tutoring rate option added successfully!");
                setAmount("");
                setDurationMinutes("60");
                await loadPricing();
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage(data.message || "Failed to add rate option.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    }

    async function removePricing(id: string) {
        try {
            const response = await fetch(`/api/tutor/pricing/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setMessage("Pricing rate option removed.");
                await loadPricing();
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

            {/* Form */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Plus className="h-5 w-5 text-emerald-600" />
                    Add Tutoring Rate Option
                </h2>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Rate Amount</label>
                        <input
                            type="number"
                            min="0"
                            step="10"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g. 350"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Currency</label>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="ETB">Ethiopian Birr (ETB)</option>
                            <option value="USD">US Dollar (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Session Duration</label>
                        <select
                            value={durationMinutes}
                            onChange={(e) => setDurationMinutes(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60">1 hour (60 mins)</option>
                            <option value="90">1.5 hours (90 mins)</option>
                            <option value="120">2 hours (120 mins)</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="button"
                        onClick={addPricing}
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition shadow-xs"
                    >
                        <Plus className="h-4 w-4" />
                        {saving ? "Saving..." : "Add Rate Option"}
                    </button>
                </div>
            </section>

            {/* List */}
            <section className="space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    Configured Tutoring Rates
                </h2>

                {pricing.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-2">
                        <Tag className="h-10 w-10 text-slate-300 mx-auto" />
                        <h3 className="text-sm font-bold text-slate-900">No pricing rates configured yet</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            Add hourly or per-session rates above so students can view your pricing.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {pricing.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
                            >
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                                        Tutoring Rate
                                    </span>
                                    <div className="text-2xl font-black text-slate-900">
                                        {item.amount} <span className="text-sm font-bold text-slate-500">{item.currency}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                                        Per {item.durationMinutes} minutes session
                                    </p>
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => removePricing(item.id)}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Remove Rate
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}