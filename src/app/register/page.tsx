"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("STUDENT");
    const [dateOfBirth, setDateOfBirth] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            setIsSuccess(false);
            return;
        }
        setLoading(true);
        setMessage("");
        setIsSuccess(false);

        try {
            const payload: Record<string, any> = {
                email,
                password,
                role,
                phone,
            };

            if (role === "STUDENT") {
                if (!dateOfBirth) {
                    setMessage(
                        "Date of birth is required for Student profiles."
                    );
                    setLoading(false);
                    return;
                }

                payload.dateOfBirth = dateOfBirth;
            }

            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Registration failed. Try a different email."
                );
                return;
            }

            setIsSuccess(true);
            setMessage(
                "Registration successful! Redirecting to login..."
            );

            setTimeout(() => {
                router.push("/login");
            }, 1500);
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 font-sans flex items-center justify-center p-6 relative overflow-hidden">

            {/* Background glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

            <div className="w-full max-w-md bg-slate-900/40 border border-slate-800 p-8 rounded-2xl backdrop-blur-xl shadow-2xl relative z-10">

                {/* Back to Home */}
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
                    >
                        <span className="text-lg group-hover:-translate-x-1 transition-transform">
                            ←
                        </span>

                        <span>Back to Home</span>
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
                        Create Account
                    </h1>

                    <p className="text-slate-400 text-sm mt-2">
                        Start your learning journey with LearnBridge.
                    </p>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Role */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                            I am registering as
                        </label>

                        <select
                            value={role}
                            onChange={(e) => {
                                setRole(e.target.value);
                                setDateOfBirth("");
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm"
                        >
                            <option value="STUDENT">
                                Student (Self-study or Children)
                            </option>

                            <option value="PARENT">
                                Parent (Oversee profiles/budgets)
                            </option>

                            <option value="TUTOR">
                                Tutor (Teach & offer subjects)
                            </option>
                        </select>
                    </div>

                    {/* Email */}
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
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                            title="Enter a valid email address"
                            autoComplete="email"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                            Phone Number
                        </label>

                        <div className="flex">
                            {/* Fixed country code */}
                            <div className="flex items-center px-4 py-3 bg-slate-900 border border-slate-800 border-r-0 rounded-l-xl text-white text-sm">
                                +251
                            </div>

                            {/* User enters only 9 digits */}
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "").slice(0, 9);
                                    setPhone(value);
                                }}
                                placeholder="9XX XXX XXX"
                                pattern="9[0-9]{8}"
                                title="Enter 9 digits starting with 9, for example 912345678"
                                className="w-full bg-slate-950 border border-slate-800 rounded-r-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 transition-colors text-sm"
                            />
                        </div>

                        <p className="text-[11px] text-slate-500 mt-1.5">
                            Enter your 9-digit Ethiopian phone number.
                        </p>
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            required
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimum 8 characters"
                            autoComplete="new-password"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            required
                            minLength={8}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter your password"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 transition-colors text-sm"
                        />

                        {confirmPassword && password !== confirmPassword && (
                            <p className="text-[11px] text-red-400 mt-1.5">
                                Passwords do not match.
                            </p>
                        )}
                    </div>

                    {/* Student DOB */}
                    {role === "STUDENT" && (
                        <div>
                            <label
                                htmlFor="dateOfBirth"
                                className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2"
                            >
                                Date of Birth
                            </label>

                            <input
                                id="dateOfBirth"
                                type="date"
                                required
                                value={dateOfBirth}
                                onChange={(e) =>
                                    setDateOfBirth(e.target.value)
                                }
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm scheme-dark"
                            />

                            <p className="text-[11px] text-slate-500 mt-1.5 leading-normal">
                                Students under age 16 cannot send independent
                                tutor requests. A parent account must manage
                                tutoring requests and bookings.
                            </p>
                        </div>
                    )}

                    {/* Parent Information */}
                    {role === "PARENT" && (
                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 text-[11px] text-slate-400 leading-relaxed">
                            <span className="mr-1">💡</span>

                            <strong className="text-slate-300">
                                Parent Account:
                            </strong>{" "}
                            After registration, you can add student profiles
                            for your children, manage tutoring budgets, and
                            submit tutor requests on their behalf.
                        </div>
                    )}

                    {/* Message */}
                    {message && (
                        <div
                            className={`border px-4 py-3 rounded-xl text-xs flex items-start gap-2 ${isSuccess
                                ? "bg-green-500/10 border-green-500/20 text-green-400"
                                : "bg-red-500/10 border-red-500/20 text-red-400"
                                }`}
                        >
                            <span className="text-sm">
                                {isSuccess ? "✓" : "⚠"}
                            </span>

                            <span>{message}</span>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-semibold text-sm text-white px-6 py-3 rounded-xl disabled:opacity-50 transition-all select-none shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/30 active:scale-[0.98]"
                    >
                        {loading
                            ? "Creating account..."
                            : "Create Account"}
                    </button>
                </form>

                {/* Login */}
                <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
                    Already have an account?{" "}

                    <Link
                        href="/login"
                        className="text-indigo-400 font-semibold hover:text-indigo-300 hover:underline transition-colors"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </main>
    );
}