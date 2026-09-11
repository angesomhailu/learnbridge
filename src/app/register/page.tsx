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
        <main className="min-h-screen bg-[#f5f7fa] font-sans text-slate-900">

            {/* ================= HEADER ================= */}
            <header className="h-[72px] bg-white border-b border-slate-200">

                <div className="max-w-7xl mx-auto h-full px-5 sm:px-8 flex items-center justify-between">

                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-3"
                    >

                        <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                            <Image
                                src="/learnbridge.png"
                                alt="LearnBridge"
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                                priority
                            />
                        </div>

                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            Learn<span className="text-blue-600">
                                Bridge
                            </span>
                        </span>

                    </Link>

                    {/* Back */}
                    <Link
                        href="/"
                        className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                    >
                        Back to home
                    </Link>

                </div>

            </header>

            {/* ================= MAIN ================= */}
            <div className="flex justify-center px-5 py-10 sm:py-14">

                <div className="w-full max-w-[520px]">

                    {/* Heading */}
                    <div className="text-center mb-8">

                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                            Create your account
                        </h1>

                        <p className="mt-3 text-sm sm:text-base text-slate-600">
                            Join LearnBridge and start your personalized
                            learning journey.
                        </p>

                    </div>

                    {/* ================= CARD ================= */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-[0_4px_20px_rgba(15,23,42,0.08)]">

                        <div className="p-7 sm:p-9">

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >

                                {/* ================= ROLE ================= */}
                                <div>

                                    <label className="block text-sm font-semibold text-slate-800 mb-3">
                                        I am registering as
                                    </label>

                                    <div className="grid grid-cols-3 gap-2">

                                        {/* Student */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setRole("STUDENT");
                                                setDateOfBirth("");
                                            }}
                                            className={`h-11 rounded-md border text-sm font-semibold transition-all ${role === "STUDENT"
                                                ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                                                : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
                                                }`}
                                        >
                                            Student
                                        </button>

                                        {/* Parent */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setRole("PARENT");
                                                setDateOfBirth("");
                                            }}
                                            className={`h-11 rounded-md border text-sm font-semibold transition-all ${role === "PARENT"
                                                ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                                                : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
                                                }`}
                                        >
                                            Parent
                                        </button>

                                        {/* Tutor */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setRole("TUTOR");
                                                setDateOfBirth("");
                                            }}
                                            className={`h-11 rounded-md border text-sm font-semibold transition-all ${role === "TUTOR"
                                                ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                                                : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
                                                }`}
                                        >
                                            Tutor
                                        </button>

                                    </div>

                                    <p className="mt-2 text-xs text-slate-500">
                                        Choose the type of LearnBridge
                                        account you want to create.
                                    </p>

                                </div>

                                {/* ================= EMAIL ================= */}
                                <div>

                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-semibold text-slate-800 mb-2"
                                    >
                                        Email address
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                                        title="Enter a valid email address"
                                        className="w-full h-12 px-4 rounded-md border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                                    />

                                </div>

                                {/* ================= PHONE ================= */}
                                <div>

                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-semibold text-slate-800 mb-2"
                                    >
                                        Phone number
                                    </label>

                                    <div className="flex">

                                        <div className="h-12 px-4 flex items-center bg-slate-50 border border-slate-300 border-r-0 rounded-l-md text-slate-700 text-sm font-medium">
                                            +251
                                        </div>

                                        <input
                                            id="phone"
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={(e) => {
                                                const value =
                                                    e.target.value
                                                        .replace(/\D/g, "")
                                                        .slice(0, 9);

                                                setPhone(value);
                                            }}
                                            placeholder="9XX XXX XXX"
                                            pattern="9[0-9]{8}"
                                            title="Enter 9 digits starting with 9, for example 912345678"
                                            autoComplete="tel"
                                            className="w-full h-12 px-4 rounded-r-md border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                                        />

                                    </div>

                                    <p className="mt-2 text-xs text-slate-500">
                                        Enter your 9-digit Ethiopian phone
                                        number.
                                    </p>

                                </div>

                                {/* ================= PASSWORD ================= */}
                                <div>

                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-semibold text-slate-800 mb-2"
                                    >
                                        Password
                                    </label>

                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        minLength={8}
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Minimum 8 characters"
                                        autoComplete="new-password"
                                        className="w-full h-12 px-4 rounded-md border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                                    />

                                    <p className="mt-2 text-xs text-slate-500">
                                        Use at least 8 characters.
                                    </p>

                                </div>

                                {/* ================= CONFIRM PASSWORD ================= */}
                                <div>

                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-semibold text-slate-800 mb-2"
                                    >
                                        Confirm password
                                    </label>

                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        required
                                        minLength={8}
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Re-enter your password"
                                        autoComplete="new-password"
                                        className={`w-full h-12 px-4 rounded-md border bg-white text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-all ${confirmPassword &&
                                            password !==
                                            confirmPassword
                                            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                                            : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                                            }`}
                                    />

                                    {confirmPassword &&
                                        password !==
                                        confirmPassword && (
                                            <p className="mt-2 text-xs text-red-600">
                                                Passwords do not match.
                                            </p>
                                        )}

                                </div>

                                {/* ================= STUDENT DOB ================= */}
                                {role === "STUDENT" && (
                                    <div>

                                        <label
                                            htmlFor="dateOfBirth"
                                            className="block text-sm font-semibold text-slate-800 mb-2"
                                        >
                                            Date of birth
                                        </label>

                                        <input
                                            id="dateOfBirth"
                                            type="date"
                                            required
                                            value={dateOfBirth}
                                            onChange={(e) =>
                                                setDateOfBirth(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full h-12 px-4 rounded-md border border-slate-300 bg-white text-slate-900 text-sm outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                                        />

                                        <div className="mt-3 rounded-md bg-blue-50 border border-blue-100 px-4 py-3">

                                            <p className="text-xs leading-5 text-blue-800">
                                                <strong>Student safety:</strong>{" "}
                                                Students under 16 cannot
                                                independently send tutor
                                                requests. A parent account
                                                must manage tutoring requests
                                                and bookings.
                                            </p>

                                        </div>

                                    </div>
                                )}

                                {/* ================= PARENT INFO ================= */}
                                {role === "PARENT" && (
                                    <div className="rounded-md bg-blue-50 border border-blue-100 px-4 py-4">

                                        <h3 className="text-sm font-semibold text-slate-800 mb-1">
                                            Parent account
                                        </h3>

                                        <p className="text-xs leading-5 text-slate-600">
                                            After registration, you can add
                                            student profiles for your children,
                                            manage tutoring budgets, and submit
                                            tutor requests on their behalf.
                                        </p>

                                    </div>
                                )}

                                {/* ================= TUTOR INFO ================= */}
                                {role === "TUTOR" && (
                                    <div className="rounded-md bg-slate-50 border border-slate-200 px-4 py-4">

                                        <h3 className="text-sm font-semibold text-slate-800 mb-1">
                                            Tutor account
                                        </h3>

                                        <p className="text-xs leading-5 text-slate-600">
                                            After creating your account, you
                                            can complete your tutor profile,
                                            add subjects, qualifications,
                                            certificates, availability, and
                                            other professional information.
                                        </p>

                                    </div>
                                )}

                                {/* ================= MESSAGE ================= */}
                                {message && (
                                    <div
                                        className={`rounded-md border px-4 py-3 text-sm ${isSuccess
                                            ? "border-green-200 bg-green-50 text-green-700"
                                            : "border-red-200 bg-red-50 text-red-700"
                                            }`}
                                    >

                                        <div className="flex gap-2">

                                            <span>
                                                {isSuccess ? "✓" : "⚠"}
                                            </span>

                                            <span>{message}</span>

                                        </div>

                                    </div>
                                )}

                                {/* ================= SUBMIT ================= */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 rounded-md bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading
                                        ? "Creating account..."
                                        : "Create account"}
                                </button>

                            </form>

                            {/* ================= LOGIN ================= */}
                            <div className="mt-7 pt-7 border-t border-slate-200 text-center">

                                <p className="text-sm text-slate-600">
                                    Already have a LearnBridge account?
                                </p>

                                <Link
                                    href="/login"
                                    className="inline-block mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                    Sign in
                                </Link>

                            </div>

                        </div>

                    </div>

                    {/* Footer */}
                    <div className="mt-7 text-center">

                        <p className="text-xs leading-5 text-slate-500">
                            LearnBridge connects students, parents, and tutors
                            to create a safer and more personalized learning
                            experience.
                        </p>

                    </div>

                </div>

            </div>

        </main>
    );
}