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

        const cleanInput = identifier.trim().toLowerCase();

        const result = await signIn("credentials", {
            identifier: cleanInput,
            email: cleanInput,
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
                        Welcome Back 👋
                    </h1>

                    <p className="text-slate-400 text-sm mt-2">
                        Sign in to continue your learning journey.
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="identifier"
                            className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2"
                        >
                            Email or Phone Number
                        </label>

                        <input
                            id="identifier"
                            type="text"
                            value={identifier}
                            onChange={(event) =>
                                setIdentifier(event.target.value)
                            }
                            placeholder="you@example.com or +2519XXXXXXXX"
                            required
                            autoComplete="username"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm"
                        />

                        <p className="text-[11px] text-slate-500 mt-1.5">
                            Sign in using your email address or phone number.
                        </p>
                    </div>

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
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs flex items-start gap-2">
                            <span>⚠</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-semibold text-sm text-white px-6 py-3 rounded-xl disabled:opacity-50 transition-all select-none shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/30 active:scale-[0.98]"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                {/* Register */}
                <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="text-indigo-400 font-semibold hover:text-indigo-300 hover:underline transition-colors"
                    >
                        Create account
                    </Link>
                </div>

            </div>
        </main>
    );
}