"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("STUDENT");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    role,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Registration failed.");
                return;
            }

            setMessage("Registration successful. Redirecting to login...");

            setTimeout(() => {
                router.push("/login");
            }, 1000);
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center p-6">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold">
                    Create your LearnBridge account
                </h1>

                <p className="mt-2 text-gray-600">
                    Join LearnBridge as a student, parent, or tutor.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-5 rounded-xl border p-6"
                >
                    <div>
                        <label className="mb-2 block font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full rounded-lg border p-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            required
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimum 8 characters"
                            className="w-full rounded-lg border p-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            I am registering as
                        </label>

                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full rounded-lg border p-3"
                        >
                            <option value="STUDENT">Student</option>
                            <option value="PARENT">Parent</option>
                            <option value="TUTOR">Tutor</option>
                        </select>
                    </div>

                    {message && (
                        <div className="rounded-lg border p-3 text-sm">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-black px-6 py-3 font-medium text-white disabled:opacity-50"
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>
            </div>
        </main>
    );
}