"use client";

import { useEffect, useState } from "react";

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
    const [durationMinutes, setDurationMinutes] =
        useState("60");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    async function loadPricing() {
        try {
            const response = await fetch("/api/tutor/pricing");
            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Failed to load pricing."
                );
                return;
            }

            setPricing(data.pricing || []);
        } catch (error) {
            console.error(error);
            setMessage("Failed to load pricing.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPricing();
    }, []);

    async function addPricing() {
        if (!amount || !durationMinutes) {
            setMessage("Please enter amount and duration.");
            return;
        }

        setSaving(true);
        setMessage("");

        try {
            const response = await fetch(
                "/api/tutor/pricing",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount,
                        currency,
                        durationMinutes,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Failed to add pricing."
                );
                return;
            }

            setMessage("Pricing added successfully.");

            setAmount("");
            setDurationMinutes("60");

            await loadPricing();
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong.");
        } finally {
            setSaving(false);
        }
    }

    async function removePricing(id: string) {
        try {
            const response = await fetch(
                `/api/tutor/pricing/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Failed to remove pricing."
                );
                return;
            }

            setMessage("Pricing removed successfully.");

            await loadPricing();
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong.");
        }
    }

    if (loading) {
        return <p>Loading pricing...</p>;
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
                    Add Pricing
                </h2>

                <div className="mt-5 space-y-4">
                    <div>
                        <label className="mb-2 block font-medium">
                            Amount
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={amount}
                            onChange={(e) =>
                                setAmount(e.target.value)
                            }
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
                            onChange={(e) =>
                                setCurrency(e.target.value)
                            }
                            className="w-full rounded-lg border p-3"
                        >
                            <option value="ETB">
                                Ethiopian Birr (ETB)
                            </option>

                            <option value="USD">
                                US Dollar (USD)
                            </option>

                            <option value="EUR">
                                Euro (EUR)
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Session Duration
                        </label>

                        <select
                            value={durationMinutes}
                            onChange={(e) =>
                                setDurationMinutes(e.target.value)
                            }
                            className="w-full rounded-lg border p-3"
                        >
                            <option value="30">
                                30 minutes
                            </option>

                            <option value="45">
                                45 minutes
                            </option>

                            <option value="60">
                                1 hour
                            </option>

                            <option value="90">
                                1.5 hours
                            </option>

                            <option value="120">
                                2 hours
                            </option>
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={addPricing}
                        disabled={saving}
                        className="rounded-lg bg-black px-6 py-3 font-medium text-white disabled:opacity-50"
                    >
                        {saving
                            ? "Adding..."
                            : "Add Pricing"}
                    </button>
                </div>
            </section>

            <section>
                <h2 className="mb-4 text-xl font-semibold">
                    My Pricing
                </h2>

                {pricing.length === 0 ? (
                    <div className="rounded-xl border p-6 text-gray-600">
                        No pricing has been added yet.
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {pricing.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-xl border p-5"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-2xl font-bold">
                                            {item.amount} {item.currency}
                                        </p>

                                        <p className="mt-1 text-gray-600">
                                            per{" "}
                                            {item.durationMinutes} minutes
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removePricing(item.id)
                                        }
                                        className="rounded-lg border px-3 py-2 text-sm"
                                    >
                                        Remove
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