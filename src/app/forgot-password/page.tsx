"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Something went wrong.");
                return;
            }

            setMessage(
                "If an account exists with this email, a password reset link has been sent."
            );
        } catch (error) {
            console.error(error);
            setError("Unable to connect to the server. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 font-sans flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

            <div className="w-full max-w-md bg-slate-900/40 border border-slate-800 p-8 rounded-2xl backdrop-blur-xl shadow-2xl relative z-10">

                {/* Back to Login */}
                <div className="mb-6">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
                    >
                        <span className="text-lg group-hover:-translate-x-1 transition-transform">
                            ←
                        </span>
                        <span>Back to Login</span>
                    </Link>
                </div>

                {/* Logo + Heading */}
                <div className="mb-8 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 mb-6 group"
                    >
                        <div className="h-11 w-11 overflow-hidden rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                            <Image
                                src="/learnbridge.png"
                                alt="LearnBridge Logo"
                                width={44}
                                height={44}
                                className="h-full w-full object-cover"
                                priority
                            />
                        </div>

                        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            LearnBridge
                        </span>
                    </Link>

                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Forgot Password?
                    </h1>

                    <p className="text-slate-400 text-sm mt-2">
                        Enter your email address and we&apos;ll send you a link
                        to reset your password.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2"
                        >
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="you@example.com"
                            required
                            autoComplete="email"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs flex items-start gap-2">
                            <span>⚠</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {message && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-xs flex items-start gap-2">
                            <span>✓</span>
                            <span>{message}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-semibold text-sm text-white px-6 py-3 rounded-xl disabled:opacity-50 transition-all select-none shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/30 active:scale-[0.98]"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                {/* Login */}
                <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
                    Remember your password?{" "}
                    <Link
                        href="/login"
                        className="text-indigo-400 font-semibold hover:text-indigo-300 hover:underline transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </main>
    );
}