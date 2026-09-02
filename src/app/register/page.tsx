"use client";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
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

        setLoading(true);
        setMessage("");
        setIsSuccess(false);

        try {
            // Prepare payload
            const payload: Record<string, any> = {
                email,
                password,
                role,
            };

            // Include DOB for student registration
            if (role === "STUDENT") {
                if (!dateOfBirth) {
                    setMessage("Date of birth is required for Student profiles.");
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
                setMessage(data.message || "Registration failed. Try a different email.");
                return;
            }

            setIsSuccess(true);
            setMessage("Registration successful! Redirecting to login...");

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
        <main className="min-h-screen bg-slate-950 font-sans flex items-center justify-center p-6 relative">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

            <div className="w-full max-w-md bg-slate-900/40 border border-slate-900 p-8 rounded-2xl backdrop-blur-xl shadow-2xl relative z-10">
                <div className="mb-6 text-center">
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
                        Create Account
                    </h1>
                    <p className="text-slate-400 text-sm mt-2">
                        Get started with your smart learning profile
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/80 transition-colors text-sm"
                        >
                            <option value="STUDENT">Student (Self-study or Children)</option>
                            <option value="PARENT">Parent (Oversee profiles/budgets)</option>
                            <option value="TUTOR">Tutor (Teach & offer subjects)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="XXXXXXX@gmail.com"
                            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                            title="Enter a valid email address"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 transition-colors text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                            Phone Number
                        </label>

                        <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+251 9XX XXX XXX"
                            pattern="^\+2519[0-9]{8}$"
                            title="Enter an Ethiopian phone number, for example +251912345678"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 transition-colors text-sm"
                        />

                        <p className="text-[11px] text-slate-500 mt-1.5">
                            We will send a verification code to this number.
                        </p>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimum 8 characters"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 transition-colors text-sm"
                        />
                    </div>

                    {/* Conditional Date of Birth input for Student signup */}
                    {role === "STUDENT" && (
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                required
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/80 transition-colors text-sm scheme-dark"
                            />
                            <p className="text-[11px] text-slate-500 mt-1.5 leading-normal">
                                Student accounts under age 16 cannot send independent requests. A parent account must link with you to manage bookings.
                            </p>
                        </div>
                    )}

                    {role === "PARENT" && (
                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 text-[11px] text-slate-400 leading-normal">
                            💡 <strong>Parent Account Advice:</strong> Register your parent account here. From your dashboard, you can add student profiles for your children, configure tutoring budgets, and submit matched requests.
                        </div>
                    )}

                    {message && (
                        <div className={`border px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 ${isSuccess
                            ? "bg-green-500/10 border-green-500/20 text-green-400"
                            : "bg-red-500/10 border-red-500/20 text-red-400"
                            }`}>
                            <span>{isSuccess ? "✓" : "⚠"}</span>
                            <span>{message}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-medium text-sm text-white px-6 py-3 rounded-xl disabled:opacity-50 transition-all select-none shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/30 active:scale-95"
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-900 text-center text-xs text-slate-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-indigo-400 font-medium hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </main>
    );
}