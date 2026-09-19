"use client";

import { useEffect, useState } from "react";
import { DollarSign, Save, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

type Budget = {
    id: string;
    maxAmount: string;
    currency: string;
    period: string | null;
    isFlexible: boolean;
};

export default function StudentBudget() {
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState("ETB");
    const [period, setPeriod] = useState("PER_SESSION");
    const [isFlexible, setIsFlexible] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    async function loadBudget() {
        try {
            const response = await fetch("/api/student/budget");
            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to load budget.");
                setIsSuccess(false);
                return;
            }

            if (data.budget) {
                const budget: Budget = data.budget;
                setAmount(String(budget.maxAmount));
                setCurrency(budget.currency);
                setPeriod(budget.period || "PER_SESSION");
                setIsFlexible(budget.isFlexible);
            }
        } catch (error) {
            console.error(error);
            setMessage("Failed to load budget.");
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBudget();
    }, []);

    async function saveBudget(e: React.FormEvent) {
        e.preventDefault();
        if (!amount || Number(amount) <= 0) {
            setMessage("Please enter a valid positive budget amount.");
            setIsSuccess(false);
            return;
        }

        setSaving(true);
        setMessage("");
        setIsSuccess(false);

        try {
            const response = await fetch("/api/student/budget", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    maxAmount: Number(amount),
                    currency,
                    period,
                    isFlexible,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to save budget preferences.");
                setIsSuccess(false);
                return;
            }

            setMessage("Budget preferences saved successfully.");
            setIsSuccess(true);
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong while saving budget.");
            setIsSuccess(false);
        } finally {
            setSaving(false);
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
        <div className="space-y-6">
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

            <form onSubmit={saveBudget} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-[#0070ad]" />
                        My Learning Budget Settings
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Define your target tutoring expenditure so our AI recommendation engine matches you with affordable tutors.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Maximum Amount
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="e.g. 500"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 pl-9 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-[#0070ad]"
                            />
                            <DollarSign className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Currency
                        </label>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-[#0070ad]"
                        >
                            <option value="ETB">ETB - Ethiopian Birr</option>
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Budget Period
                        </label>
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-[#0070ad]"
                        >
                            <option value="PER_SESSION">Per Session</option>
                            <option value="PER_HOUR">Per Hour</option>
                            <option value="PER_WEEK">Per Week</option>
                            <option value="PER_MONTH">Per Month</option>
                        </select>
                    </div>

                    <div className="flex items-center pt-5">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isFlexible}
                                onChange={(e) => setIsFlexible(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-[#0070ad] focus:ring-[#0070ad]"
                            />
                            <span className="text-xs font-bold text-slate-700">
                                Flexible Budget (Open to slightly higher rate tutors)
                            </span>
                        </label>
                    </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        Used for AI Tutor Match Scoring
                    </span>

                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#002b49] px-6 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-[#0070ad] transition disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        {saving ? "Saving..." : "Save Budget Settings"}
                    </button>
                </div>
            </form>
        </div>
    );
}