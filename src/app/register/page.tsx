"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import TelegramAuthModal from "@/components/auth/TelegramAuthModal";

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
    const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setMessage("");
        setIsSuccess(false);

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            setMessage("Password must be at least 8 characters.");
            return;
        }

        if (!/^9[0-9]{8}$/.test(phone)) {
            setMessage(
                "Please enter a valid Ethiopian phone number starting with 9."
            );
            return;
        }

        if (role === "STUDENT" && !dateOfBirth) {
            setMessage(
                "Date of birth is required for Student profiles."
            );
            return;
        }

        setLoading(true);

        try {
            const payload: Record<string, any> = {
                email: email.trim().toLowerCase(),
                password,
                role,
                phone: `+251${phone}`,
            };

            if (role === "STUDENT") {
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
                    "Registration failed. Please try again."
                );
                setLoading(false);
                return;
            }

            setIsSuccess(true);
            setMessage(
                "Registration successful! Redirecting you to login..."
            );

            setTimeout(() => {
                router.push("/login");
            }, 1500);

        } catch (error) {
            console.error(error);
            setMessage(
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
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
                    <div className="lg:col-span-5 bg-gradient-to-br from-[#002b49] via-[#004870] to-[#0070ad] p-8 sm:p-12 text-white relative flex flex-col justify-between overflow-hidden min-h-[440px] lg:min-h-[640px]">
                        {/* Background glowing tech graphics */}
                        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-sky-400/15 blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

                        {/* Top Tag & Headline */}
                        <div className="space-y-6 relative z-10">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-sky-300 text-xs font-bold uppercase tracking-wider border border-white/15">
                                <span>🚀</span> Join the Skills Network
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                                Start Your Educational Growth Today.
                            </h1>

                            <p className="text-sm sm:text-base text-sky-100/90 leading-relaxed">
                                Select your account role to unlock customized tools for learners, parents, or verified professional educators.
                            </p>
                        </div>

                        {/* Role Features Dynamic Card */}
                        <div className="space-y-3 pt-8 border-t border-white/15 relative z-10">
                            <p className="text-xs font-bold uppercase tracking-wider text-sky-300">
                                {role === "STUDENT" && "Student Benefits"}
                                {role === "PARENT" && "Parent Controls"}
                                {role === "TUTOR" && "Tutor Educator Tools"}
                            </p>

                            <div className="space-y-2 text-xs font-semibold">
                                {role === "STUDENT" && (
                                    <>
                                        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-2.5">
                                            <span className="text-sky-300 font-bold">✓</span>
                                            <span>AI-powered tutor recommendation engine</span>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-2.5">
                                            <span className="text-sky-300 font-bold">✓</span>
                                            <span>Grade & subject progress tracking</span>
                                        </div>
                                    </>
                                )}

                                {role === "PARENT" && (
                                    <>
                                        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-2.5">
                                            <span className="text-sky-300 font-bold">✓</span>
                                            <span>Manage children profiles & session budgets</span>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-2.5">
                                            <span className="text-sky-300 font-bold">✓</span>
                                            <span>Direct communication with verified tutors</span>
                                        </div>
                                    </>
                                )}

                                {role === "TUTOR" && (
                                    <>
                                        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-2.5">
                                            <span className="text-sky-300 font-bold">✓</span>
                                            <span>Verified educator badge & subject catalog</span>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-2.5">
                                            <span className="text-sky-300 font-bold">✓</span>
                                            <span>Flexible session calendar & payout tracking</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Bottom Trust Badge */}
                        <div className="pt-6 relative z-10 flex items-center justify-between text-xs text-sky-200/80 font-medium">
                            <span>100% Free Account Creation</span>
                            <span className="font-bold text-white">LearnBridge v2.0</span>
                        </div>
                    </div>

                    {/* RIGHT REGISTER CARD (NetAcad Style) */}
                    <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6 bg-white">
                        <div className="space-y-6">
                            {/* Card Header */}
                            <div className="space-y-1.5">
                                <div className="text-xs font-bold uppercase tracking-wider text-[#0070ad]">
                                    New Registration
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                    Create your LearnBridge account
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500">
                                    Select your role and fill in your account details.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Role Selection Tabs */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                        I am registering as:
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setRole("STUDENT");
                                                setDateOfBirth("");
                                            }}
                                            className={`cursor-pointer h-11 rounded-xl border text-xs font-bold transition-all ${role === "STUDENT"
                                                ? "border-[#0070ad] bg-sky-50 text-[#0070ad] ring-2 ring-[#0070ad]/20 shadow-xs"
                                                : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
                                                }`}
                                        >
                                            🎓 Student
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setRole("PARENT");
                                                setDateOfBirth("");
                                            }}
                                            className={`cursor-pointer h-11 rounded-xl border text-xs font-bold transition-all ${role === "PARENT"
                                                ? "border-[#0070ad] bg-sky-50 text-[#0070ad] ring-2 ring-[#0070ad]/20 shadow-xs"
                                                : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
                                                }`}
                                        >
                                            👨‍👩‍👧 Parent
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setRole("TUTOR");
                                                setDateOfBirth("");
                                            }}
                                            className={`cursor-pointer h-11 rounded-xl border text-xs font-bold transition-all ${role === "TUTOR"
                                                ? "border-[#0070ad] bg-sky-50 text-[#0070ad] ring-2 ring-[#0070ad]/20 shadow-xs"
                                                : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
                                                }`}
                                        >
                                            👨‍🏫 Tutor
                                        </button>
                                    </div>
                                </div>

                                {/* Email & Phone Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Email */}
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="email"
                                            className="block text-xs font-bold uppercase tracking-wider text-slate-700"
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
                                            autoComplete="email"
                                            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                                            title="Enter a valid email address"
                                            className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm outline-none transition-all focus:border-[#0070ad] focus:ring-2 focus:ring-[#0070ad]/20"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="phone"
                                            className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                                        >
                                            Phone Number
                                        </label>
                                        <div className="flex">
                                            <div className="h-11 px-3 flex items-center bg-slate-100 border border-slate-300 border-r-0 rounded-l-xl text-slate-600 text-xs font-bold">
                                                +251
                                            </div>
                                            <input
                                                id="phone"
                                                type="tel"
                                                required
                                                value={phone}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, "").slice(0, 9);
                                                    setPhone(value);
                                                }}
                                                placeholder="9XXXXXXXX"
                                                pattern="9[0-9]{8}"
                                                title="Enter 9 digits starting with 9"
                                                autoComplete="tel"
                                                className="w-full h-11 px-3 rounded-r-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm outline-none transition-all focus:border-[#0070ad] focus:ring-2 focus:ring-[#0070ad]/20"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Password & Confirm Password Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Password */}
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="password"
                                            className="block text-xs font-bold uppercase tracking-wider text-slate-700"
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
                                            placeholder="Min. 8 characters"
                                            autoComplete="new-password"
                                            className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm outline-none transition-all focus:border-[#0070ad] focus:ring-2 focus:ring-[#0070ad]/20"
                                        />
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="confirmPassword"
                                            className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                                        >
                                            Confirm Password
                                        </label>
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            required
                                            minLength={8}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Re-enter password"
                                            autoComplete="new-password"
                                            className={`w-full h-11 px-3.5 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm outline-none transition-all ${confirmPassword && password !== confirmPassword
                                                ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
                                                : "border-slate-300 focus:border-[#0070ad] focus:ring-2 focus:ring-[#0070ad]/20"
                                                }`}
                                        />
                                    </div>
                                </div>

                                {/* Student DOB field */}
                                {role === "STUDENT" && (
                                    <div className="space-y-1.5">
                                        <label
                                            htmlFor="dateOfBirth"
                                            className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                                        >
                                            Date of Birth
                                        </label>
                                        <input
                                            id="dateOfBirth"
                                            type="date"
                                            required
                                            value={dateOfBirth}
                                            onChange={(e) => setDateOfBirth(e.target.value)}
                                            className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs sm:text-sm outline-none transition-all focus:border-[#0070ad] focus:ring-2 focus:ring-[#0070ad]/20"
                                        />
                                        <p className="text-[11px] text-sky-800 font-medium bg-sky-50 p-2.5 rounded-lg border border-sky-100">
                                            ℹ️ <strong>Student Notice:</strong> Students under 16 require a parent account to authorize tutor requests.
                                        </p>
                                    </div>
                                )}

                                {/* Message alert */}
                                {message && (
                                    <div
                                        className={`rounded-xl border p-3.5 text-xs font-semibold shadow-xs flex items-center gap-2 ${isSuccess
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                            : "border-rose-200 bg-rose-50 text-rose-800"
                                            }`}
                                    >
                                        <span>{isSuccess ? "✓" : "⚠️"}</span>
                                        <span>{message}</span>
                                    </div>
                                )}

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="cursor-pointer w-full h-12 rounded-xl bg-[#0070ad] hover:bg-[#005073] active:bg-[#003d59] text-white font-bold text-sm shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Creating Account...</span>
                                        </>
                                    ) : (
                                        <span>Create Account</span>
                                    )}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-white px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                                        or register with
                                    </span>
                                </div>
                            </div>

                            {/* Social options */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        signIn("google", { callbackUrl: "/dashboard" })
                                    }
                                    className="flex cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition hover:border-slate-400 hover:bg-slate-50"
                                >
                                    <span className="text-base font-black text-blue-600">
                                        G
                                    </span>

                                    <span>Google</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsTelegramModalOpen(true)}
                                    className="flex cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
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

                        {/* Login Redirect */}
                        <div className="pt-4 border-t border-slate-100 text-center space-y-1">
                            <p className="text-xs text-slate-500 font-medium">
                                Already have a LearnBridge account?
                            </p>
                            <Link
                                href="/login"
                                className="inline-block text-xs font-bold text-[#0070ad] hover:text-[#005073] hover:underline"
                            >
                                Sign in to your account →
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