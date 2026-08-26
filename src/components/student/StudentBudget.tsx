"use client";

import { useEffect, useState } from "react";

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

    async function loadBudget() {
        try {
            const response = await fetch("/api/student/budget");
            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to load budget.");
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
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBudget();
    }, []);

    async function saveBudget() {
        if (!amount || Number(amount) <= 0) {
            setMessage("Please enter a valid budget.");
            return;
        }

        setSaving(true);
        setMessage("");

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
                setMessage(data.message || "Failed to save budget.");
                return;
            }

            setMessage("Budget saved successfully.");
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <p>Loading budget...</p>;
    }

    return (
        <section className="rounded-xl border p-6">
            <h2 className="text-xl font-semibold">
                My Tutoring Budget
            </h2>

            <p className="mt-2 text-sm text-gray-600">
                Tell us how much you are comfortable paying for tutoring.
            </p>

            {message && (
                <div className="mt-4 rounded-lg border p-3">
                    {message}
                </div>
            )}

            <div className="mt-6 space-y-5">
                <div>
                    <label className="mb-2 block font-medium">
                        Maximum Amount
                    </label>

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Example: 500"
                        className="w-full rounded-lg border p-3"
                    />
                </div>

                <div>
                    <label className="mb-2 block font-medium">
                        Currency
                    </label>

                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full rounded-lg border p-3"
                    >
                        <option value="ETB">ETB - Ethiopian Birr</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block font-medium">
                        Budget Period
                    </label>

                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="w-full rounded-lg border p-3"
                    >
                        <option value="PER_SESSION">
                            Per Session
                        </option>

                        <option value="PER_HOUR">
                            Per Hour
                        </option>

                        <option value="PER_WEEK">
                            Per Week
                        </option>

                        <option value="PER_MONTH">
                            Per Month
                        </option>
                    </select>
                </div>

                <label className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={isFlexible}
                        onChange={(e) => setIsFlexible(e.target.checked)}
                        className="h-4 w-4"
                    />

                    <span>
                        I'm flexible with my budget
                    </span>
                </label>

                <button
                    type="button"
                    onClick={saveBudget}
                    disabled={saving}
                    className="rounded-lg bg-black px-6 py-3 font-medium text-white disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save Budget"}
                </button>
            </div>
        </section>
    );
}