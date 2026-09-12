"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { X, Send } from "lucide-react";

interface TelegramAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TelegramAuthModal({
    isOpen,
    onClose,
}: TelegramAuthModalProps) {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleTelegramSignIn = async (e: React.FormEvent) => {
        e.preventDefault();

        const cleanInput = input.trim();
        if (!cleanInput) {
            setError("Please enter your Telegram username, phone, or ID.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const isEmail = cleanInput.includes("@");
            const isUsername = cleanInput.startsWith("@") || (!isEmail && isNaN(Number(cleanInput)));
            const usernameClean = isUsername ? cleanInput.replace(/^@/, "") : "";
            const telegramIdClean = !isEmail && !isUsername ? cleanInput : `user_${Date.now()}`;

            const payload = {
                telegramId: telegramIdClean,
                username: usernameClean || undefined,
                email: isEmail ? cleanInput.toLowerCase() : undefined,
            };

            const res = await fetch("/api/auth/telegram", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Telegram authentication failed.");
                setLoading(false);
                return;
            }

            // NextAuth signIn using telegram provider
            await signIn("telegram", {
                telegramId: data.user.telegramId,
                email: data.user.email,
                username: data.user.username ?? "",
                callbackUrl: "/dashboard",
            });
        } catch (err) {
            console.error("Telegram Login Error:", err);
            setError("Failed to sign in with Telegram. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                            <Send className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Telegram Sign-In</h3>
                            <p className="text-xs text-sky-100">Connect with your Telegram Account</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleTelegramSignIn} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Telegram Username or Phone Number
                        </label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-3 text-slate-400 font-semibold text-sm">@</span>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="username or +251..."
                                required
                                className="w-full h-11 pl-8 pr-4 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                            />
                        </div>
                        <p className="mt-2 text-xs text-slate-500">
                            Enter your Telegram handle (e.g. <code>@john_doe</code>) or registered phone number to sign in.
                        </p>
                    </div>

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium">
                            {error}
                        </div>
                    )}

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-11 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 h-11 rounded-xl bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white text-sm font-semibold transition shadow-md shadow-sky-500/25 disabled:opacity-60"
                        >
                            {loading ? "Authenticating..." : "Continue"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
