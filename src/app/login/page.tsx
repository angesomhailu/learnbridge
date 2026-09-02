"use client";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState("");
    //const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setLoading(true);

        const result = await signIn("credentials", {
            identifier,
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
        <main className="min-h-screen bg-slate-950 font-sans flex items-center justify-center p-6 relative">
            {/* Soft decorative background glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

            <div className="w-full max-w-md bg-slate-905 border border-slate-900 bg-slate-900/40 p-8 rounded-2xl backdrop-blur-xl shadow-2xl relative z-10">
                <div className="mb-8 text-center">
                    <div className="flex items-center pl-25 pb-10">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-indigo-500/25">
                                <Image
                                    src="/learnbridge.png"
                                    alt="LearnBridge Logo"
                                    width={40}
                                    height={40}
                                    className="h-full w-full object-cover"
                                    priority
                                />
                            </div>

                            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                LearnBridge
                            </span>
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="text-slate-400 text-sm mt-2">
                        Enter credentials to access your dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                            onChange={(event) => setIdentifier(event.target.value)}
                            placeholder="XXXXXXX@gmail.com or +2519XXXXXXXX"
                            required
                            autoComplete="username"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 transition-colors text-sm"
                        />

                        <p className="text-[11px] text-slate-500 mt-1.5">
                            You can sign in using your email address or phone number.
                        </p>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Password
                            </label>
                        </div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 transition-colors text-sm"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
                            <span>⚠</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-medium text-sm text-white px-6 py-3 rounded-xl disabled:opacity-50 transition-all select-none shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/30 active:scale-95"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-900 text-center text-xs text-slate-400">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-indigo-400 font-medium hover:underline">
                        Create account
                    </Link>
                </div>
            </div>
        </main>
    );
}