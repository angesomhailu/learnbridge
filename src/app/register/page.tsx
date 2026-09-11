"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

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
        <main className="min-h-screen bg-[#eef1f5] font-sans text-slate-900 relative overflow-hidden">

            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">

                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-200/20 blur-3xl" />

                <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-200/15 blur-3xl" />

                <div className="absolute bottom-[-200px] left-1/3 w-[500px] h-[500px] rounded-full bg-blue-100/20 blur-3xl" />

            </div>

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
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-300" />
                                </div>

                                <div className="relative flex justify-center">
                                    <span className="bg-[#f4f5f7] px-4 text-xs font-medium text-slate-500">
                                        OR
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                                    className="w-full flex items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-400"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fill="#4285F4"
                                            d="M21.35 12.23c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 21.5c2.63 0 4.84-.87 6.46-2.35l-3.14-2.45c-.87.58-1.98.92-3.32.92-2.55 0-4.71-1.72-5.48-4.03H3.27v2.53A9.75 9.75 0 0 0 12 21.5Z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M6.52 13.59A5.86 5.86 0 0 1 6.2 12c0-.55.09-1.08.32-1.59V7.88H3.27A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.05 1.02 4.12l3.25-2.53Z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 6.38c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.45 14.63 2.5 12 2.5a9.75 9.75 0 0 0-8.73 5.38l3.25 2.53C7.29 8.1 9.45 6.38 12 6.38Z"
                                        />
                                    </svg>

                                    Sign up with Google
                                </button>
                            </div>
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