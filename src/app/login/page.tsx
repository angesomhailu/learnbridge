"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
                    <Link href="/" className="flex items-center gap-3 group">

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
                            Learn<span className="text-blue-600">Bridge</span>
                        </span>

                    </Link>

                    {/* Back home */}
                    <Link
                        href="/"
                        className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                    >
                        Back to home
                    </Link>

                </div>
            </header>

            {/* ================= MAIN ================= */}
            <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-5 py-12">

                <div className="w-full max-w-[470px]">

                    {/* Heading */}
                    <div className="text-center mb-8">

                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                            Welcome back
                        </h1>

                        <p className="mt-3 text-sm sm:text-base text-slate-600">
                            Sign in to continue your LearnBridge journey.
                        </p>

                    </div>

                    {/* ================= CARD ================= */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-[0_4px_20px_rgba(15,23,42,0.08)]">

                        <div className="p-7 sm:p-9">

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >

                                {/* Email / Phone */}
                                <div>

                                    <label
                                        htmlFor="identifier"
                                        className="block text-sm font-semibold text-slate-800 mb-2"
                                    >
                                        Email or phone number
                                    </label>

                                    <input
                                        id="identifier"
                                        type="text"
                                        value={identifier}
                                        onChange={(event) =>
                                            setIdentifier(event.target.value)
                                        }
                                        placeholder="you@example.com or 09XXXXXXXX"
                                        required
                                        autoComplete="username"
                                        className="w-full h-12 px-4 rounded-md border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                                    />

                                    <p className="mt-2 text-xs text-slate-500">
                                        Use the email address or phone number
                                        associated with your account.
                                    </p>

                                </div>

                                {/* Password */}
                                <div>

                                    <div className="flex items-center justify-between mb-2">

                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-semibold text-slate-800"
                                        >
                                            Password
                                        </label>

                                        <Link
                                            href="/forgot-password"
                                            className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                        >
                                            Forgot password?
                                        </Link>

                                    </div>

                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        placeholder="Enter your password"
                                        required
                                        autoComplete="current-password"
                                        className="w-full h-12 px-4 rounded-md border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                                    />

                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                        <div className="flex gap-2">
                                            <span>⚠</span>
                                            <span>{error}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 rounded-md bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading
                                        ? "Signing in..."
                                        : "Sign in"}
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

                                    Continue with Google
                                </button>
                            </div>


                            {/* Register */}
                            <div className="mt-7 pt-7 border-t border-slate-200 text-center">

                                <p className="text-sm text-slate-600">
                                    Don't have a LearnBridge account?
                                </p>

                                <Link
                                    href="/register"
                                    className="inline-block mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                    Create an account
                                </Link>

                            </div>

                        </div>

                    </div>

                    {/* Bottom information */}
                    <div className="mt-7 text-center">

                        <p className="text-xs leading-5 text-slate-500">
                            By signing in, you agree to use LearnBridge
                            responsibly and respect the privacy and safety
                            of other learners and tutors.
                        </p>

                    </div>

                </div>

            </div>

        </main>
    );
}