
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
        <main className="min-h-screen bg-[#dfe3e8] font-sans text-slate-900 flex items-center justify-center p-6 relative overflow-hidden">

            {/* Soft background decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-200/30 blur-3xl" />

                <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-200/20 blur-3xl" />

                <div className="absolute bottom-[-200px] left-1/3 w-[500px] h-[500px] rounded-full bg-blue-100/30 blur-3xl" />
            </div>

            {/* Main Card */}
            <div className="w-full max-w-md relative z-10">

                {/* Card */}
                <div className="rounded-2xl border border-slate-300 bg-[#f4f5f7] p-8 shadow-[0_20px_50px_rgba(15,23,42,0.10)] sm:p-9">

                    {/* Back to Login */}
                    <div className="mb-7">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors group"
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
                            <div className="h-12 w-12 overflow-hidden rounded-xl bg-blue-600 shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
                                <Image
                                    src="/learnbridge.png"
                                    alt="LearnBridge Logo"
                                    width={48}
                                    height={48}
                                    className="h-full w-full object-contain"
                                    priority
                                />
                            </div>

                            <span className="font-bold text-xl tracking-tight text-slate-900">
                                Learn<span className="text-blue-600">Bridge</span>
                            </span>
                        </Link>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                            Forgot Password?
                        </h1>

                        <p className="text-slate-500 text-sm leading-6 mt-2">
                            Enter your email address and we&apos;ll send you a
                            link to reset your password.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2"
                            >
                                Email Address
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                                <span className="font-bold">⚠</span>

                                <span>{error}</span>
                            </div>
                        )}

                        {/* Success */}
                        {message && (
                            <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
                                <span className="font-bold">✓</span>

                                <span>{message}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>

                    {/* Login */}
                    <div className="mt-8 border-t border-slate-300 pt-6 text-center text-sm text-slate-500">
                        Remember your password?{" "}

                        <Link
                            href="/login"
                            className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* Small security note */}
                <div className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
                    <span className="text-green-600">✓</span>
                    Your account information is kept secure.
                </div>
            </div>
        </main>
    );
}

