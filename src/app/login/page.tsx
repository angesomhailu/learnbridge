"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TelegramAuthModal from "@/components/auth/TelegramAuthModal";

export default function LoginPage() {
    const router = useRouter();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setLoading(true);

        let cleanInput = identifier.trim();

        // Normalize Ethiopian phone number
        if (/^09\d{8}$/.test(cleanInput)) {
            cleanInput = `+251${cleanInput.substring(1)}`;
        } else if (/^9\d{8}$/.test(cleanInput)) {
            cleanInput = `+251${cleanInput}`;
        }

        // Normalize email
        if (cleanInput.includes("@")) {
            cleanInput = cleanInput.toLowerCase();
        }

        try {
            const result = await signIn("credentials", {
                identifier: cleanInput,
                password,
                redirect: false,
            });

            setLoading(false);

            if (!result || result.error) {
                setError(
                    "Invalid email/phone number or password. Please check your credentials."
                );
                return;
            }

            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            console.error(error);
            setLoading(false);
            setError("Something went wrong. Please try again.");
        }
    }

    return (
        <main className="min-h-screen bg-[#f0f4f8] font-sans text-slate-900 flex flex-col justify-between">
            {/* ================= NETACAD TOP HEADER ================= */}
            <header className="h-[72px] bg-[#002b49] border-b border-sky-950 text-white sticky top-0 z-50 shadow-md">
                <div className="max-w-7xl mx-auto h-full px-5 sm:px-8 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white/10 p-1 border border-white/20 backdrop-blur-md">
                            <Image
                                src="/learnbridge.png"
                                alt="LearnBridge"
                                width={40}
                                height={40}
                                className="h-full w-full object-contain"
                                priority
                            />
                        </div>

                        <div>
                            <div className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                                <span>Learn<span className="text-sky-400">Bridge</span></span>
                                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full border border-sky-400/30">
                                    Skills Portal
                                </span>
                            </div>
                            <div className="hidden text-[8px] font-semibold uppercase tracking-[0.2em] text-sky-200/70 sm:block">
                                Powered by AI & Certified Tutors
                            </div>
                        </div>
                    </Link>

                    {/* Right Controls */}
                    <div className="flex items-center gap-4 text-xs font-semibold text-sky-100">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>EN — Global English</span>
                        </div>

                        <Link
                            href="/"
                            className="text-xs font-bold text-sky-200 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition border border-white/10"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </header>

            {/* ================= MAIN NETACAD SPLIT PORTAL ================= */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
                    {/* LEFT HERO PANEL (NetAcad Style) */}
                    <div className="lg:col-span-6 bg-gradient-to-br from-[#002b49] via-[#004870] to-[#0070ad] p-8 sm:p-12 text-white relative flex flex-col justify-between overflow-hidden min-h-[440px] lg:min-h-[600px]">
                        {/* Background glowing tech graphics */}
                        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-sky-400/15 blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

                        {/* Top Tag & Headline */}
                        <div className="space-y-6 relative z-10">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-sky-300 text-xs font-bold uppercase tracking-wider border border-white/15">
                                <span>🎓</span> Skills for All — Learning Platform
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                                Empower Your Future with Expert Tutors.
                            </h1>

                            <p className="text-sm sm:text-base text-sky-100/90 leading-relaxed max-w-lg">
                                Access personalized 1-on-1 tutoring, Ethiopian curriculum mastery, AI-driven study recommendations, and interactive live virtual classrooms.
                            </p>
                        </div>

                        {/* Feature Badges Grid */}
                        <div className="space-y-3 pt-8 border-t border-white/15 relative z-10">
                            <p className="text-xs font-bold uppercase tracking-wider text-sky-300">
                                Platform Capabilities
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
                                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                                    <span className="text-sky-300 font-bold text-sm">✓</span>
                                    <span>Verified Educator Credentials</span>
                                </div>

                                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                                    <span className="text-sky-300 font-bold text-sm">✓</span>
                                    <span>AI Tutor Matching</span>
                                </div>

                                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                                    <span className="text-sky-300 font-bold text-sm">✓</span>
                                    <span>Ethio-Curriculum & Prep</span>
                                </div>

                                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                                    <span className="text-sky-300 font-bold text-sm">✓</span>
                                    <span>Live Interactive Sessions</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Trust Badge */}
                        <div className="pt-6 relative z-10 flex items-center justify-between text-xs text-sky-200/80 font-medium">
                            <span>Join over 10,000+ active students & parents</span>
                            <span className="font-bold text-white">LearnBridge v2.0</span>
                        </div>
                    </div>

                    {/* RIGHT AUTH CARD (NetAcad Login) */}
                    <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between space-y-8 bg-white">
                        <div className="space-y-6">
                            {/* Card Header */}
                            <div className="space-y-2">
                                <div className="text-xs font-bold uppercase tracking-wider text-[#0070ad]">
                                    Account Authentication
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                    Sign in to your account
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Enter your credentials to access your dashboard.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Email / Phone */}
                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="identifier"
                                        className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                                    >
                                        Email Address or Phone Number
                                    </label>
                                    <input
                                        id="identifier"
                                        type="text"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        placeholder="you@example.com or 09XXXXXXXX"
                                        required
                                        autoComplete="username"
                                        className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-all focus:border-[#0070ad] focus:ring-2 focus:ring-[#0070ad]/20"
                                    />
                                </div>

                                {/* Password */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor="password"
                                            className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                                        >
                                            Password
                                        </label>
                                        <Link
                                            href="/forgot-password"
                                            className="text-xs font-bold text-[#0070ad] hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your account password"
                                        required
                                        autoComplete="current-password"
                                        className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-all focus:border-[#0070ad] focus:ring-2 focus:ring-[#0070ad]/20"
                                    />
                                </div>

                                {/* Error message */}
                                {error && (
                                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 font-semibold shadow-xs flex items-center gap-2">
                                        <span>⚠️</span>
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* Submit Button (NetAcad Primary Cisco Blue) */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="cursor-pointer w-full h-12 rounded-xl bg-[#0070ad] hover:bg-[#005073] active:bg-[#003d59] text-white font-bold text-sm shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Authenticating...</span>
                                        </>
                                    ) : (
                                        <span>Sign In</span>
                                    )}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-white px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                                        or continue with
                                    </span>
                                </div>
                            </div>

                            {/* Social Sign In Options */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        signIn("google", { callbackUrl: "/dashboard" })
                                    }
                                    className="flex cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs font-bold text-slate-700 shadow-xs transition hover:border-slate-400 hover:bg-slate-50"
                                >
                                    <span className="text-base font-black text-blue-600">G</span>
                                    <span>Google</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsTelegramModalOpen(true)}
                                    className="flex cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs font-bold text-slate-700 shadow-xs transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                                >
                                    <svg
                                        className="h-4 w-4 fill-sky-500"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                    </svg>

                                    <span>Telegram</span>
                                </button>
                            </div>

                            <TelegramAuthModal
                                isOpen={isTelegramModalOpen}
                                onClose={() => setIsTelegramModalOpen(false)}
                            />
                        </div>

                        {/* Sign Up Redirect */}
                        <div className="pt-6 border-t border-slate-100 text-center space-y-1">
                            <p className="text-xs text-slate-500 font-medium">
                                New to LearnBridge Skills Platform?
                            </p>
                            <Link
                                href="/register"
                                className="inline-block text-xs font-bold text-[#0070ad] hover:text-[#005073] hover:underline"
                            >
                                Create an account →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* NetAcad Footer */}
            <footer className="py-4 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
                &copy; {new Date().getFullYear()} LearnBridge Skills Platform. Inspired by Cisco NetAcad Skills for All. All rights reserved.
            </footer>
        </main>
    );
}