"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Role = "STUDENT" | "PARENT" | "TUTOR";

type Gender =
    | "MALE"
    | "FEMALE"
    | "OTHER"
    | "PREFER_NOT_TO_SAY";

export default function SocialCompletePage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();

    const [role, setRole] = useState<Role | null>(null);

    const [dateOfBirth, setDateOfBirth] = useState("");
    const [gender, setGender] =
        useState<Gender>("PREFER_NOT_TO_SAY");
    const [grade, setGrade] = useState("");
    const [phone, setPhone] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (
            status === "authenticated" &&
            session?.user?.role
        ) {
            router.replace("/dashboard");
        }
    }, [status, session, router]);

    if (status === "loading") {
        return (
            <main className="min-h-screen bg-[#dfe3e8] flex items-center justify-center px-4">
                <div className="rounded-2xl border border-slate-300 bg-[#f4f5f7] px-8 py-6 shadow-sm">
                    <p className="text-sm text-slate-600">
                        Loading your account...
                    </p>
                </div>
            </main>
        );
    }

    if (!session?.user) {
        return null;
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!role) {
            setError("Please select your account type.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "/api/auth/social-complete",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        role,
                        dateOfBirth:
                            role === "PARENT"
                                ? undefined
                                : dateOfBirth,
                        gender:
                            role === "PARENT"
                                ? undefined
                                : gender,
                        grade:
                            role === "STUDENT"
                                ? grade
                                : undefined,
                        phone: phone.trim() || undefined,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Unable to complete your profile."
                );
                return;
            }

            /*
             * Refresh the NextAuth JWT/session so the new
             * role is available immediately.
             */
            await update({
                role: data.role,
            });

            /*
             * Send the user to the correct dashboard.
             */
            if (data.role === "STUDENT") {
                router.replace("/student");
                return;
            }

            if (data.role === "PARENT") {
                router.replace("/parent");
                return;
            }

            if (data.role === "TUTOR") {
                router.replace("/tutor");
                return;
            }

            router.replace("/dashboard");
        } catch (err) {
            console.error(
                "Social profile completion error:",
                err
            );

            setError(
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#dfe3e8] px-4 py-10">
            <div className="mx-auto w-full max-w-2xl">
                <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-300 bg-[#f4f5f7] shadow-sm">
                        <img
                            src="/learnbridge.png"
                            alt="LearnBridge"
                            className="h-12 w-12 object-contain"
                        />
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900">
                        Complete your LearnBridge profile
                    </h1>

                    <p className="mt-2 text-sm text-slate-600">
                        Welcome! Tell us a little about yourself
                        so we can set up your LearnBridge account.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-slate-300 bg-[#f4f5f7] p-6 shadow-sm sm:p-8"
                >
                    <div>
                        <label className="text-sm font-semibold text-slate-800">
                            I want to join LearnBridge as
                        </label>

                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setRole("STUDENT");
                                    setError("");
                                }}
                                className={`rounded-xl border px-4 py-5 text-sm font-semibold transition ${role === "STUDENT"
                                        ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                                        : "border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50"
                                    }`}
                            >
                                <span className="block text-base">
                                    Student
                                </span>

                                <span className="mt-1 block text-xs font-normal text-slate-500">
                                    Find tutors and learn
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setRole("PARENT");
                                    setError("");
                                }}
                                className={`rounded-xl border px-4 py-5 text-sm font-semibold transition ${role === "PARENT"
                                        ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                                        : "border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50"
                                    }`}
                            >
                                <span className="block text-base">
                                    Parent
                                </span>

                                <span className="mt-1 block text-xs font-normal text-slate-500">
                                    Manage your children
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setRole("TUTOR");
                                    setError("");
                                }}
                                className={`rounded-xl border px-4 py-5 text-sm font-semibold transition ${role === "TUTOR"
                                        ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                                        : "border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50"
                                    }`}
                            >
                                <span className="block text-base">
                                    Tutor
                                </span>

                                <span className="mt-1 block text-xs font-normal text-slate-500">
                                    Teach students
                                </span>
                            </button>
                        </div>
                    </div>

                    {role && (
                        <div className="mt-8 space-y-5">
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium text-slate-700"
                                >
                                    Phone number
                                </label>

                                <input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(event) =>
                                        setPhone(
                                            event.target.value
                                        )
                                    }
                                    placeholder="+251 9XXXXXXXX"
                                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {role !== "PARENT" && (
                                <>
                                    <div>
                                        <label
                                            htmlFor="dateOfBirth"
                                            className="block text-sm font-medium text-slate-700"
                                        >
                                            Date of birth
                                        </label>

                                        <input
                                            id="dateOfBirth"
                                            type="date"
                                            value={dateOfBirth}
                                            onChange={(event) =>
                                                setDateOfBirth(
                                                    event.target.value
                                                )
                                            }
                                            required
                                            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="gender"
                                            className="block text-sm font-medium text-slate-700"
                                        >
                                            Gender
                                        </label>

                                        <select
                                            id="gender"
                                            value={gender}
                                            onChange={(event) =>
                                                setGender(
                                                    event.target
                                                        .value as Gender
                                                )
                                            }
                                            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        >
                                            <option value="PREFER_NOT_TO_SAY">
                                                Prefer not to say
                                            </option>

                                            <option value="MALE">
                                                Male
                                            </option>

                                            <option value="FEMALE">
                                                Female
                                            </option>

                                            <option value="OTHER">
                                                Other
                                            </option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {role === "STUDENT" && (
                                <div>
                                    <label
                                        htmlFor="grade"
                                        className="block text-sm font-medium text-slate-700"
                                    >
                                        Grade
                                    </label>

                                    <input
                                        id="grade"
                                        type="text"
                                        value={grade}
                                        onChange={(event) =>
                                            setGrade(
                                                event.target.value
                                            )
                                        }
                                        placeholder="e.g. Grade 8"
                                        required
                                        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            )}

                            {role === "TUTOR" && (
                                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                                    <p className="text-sm font-semibold text-blue-900">
                                        Tutor verification
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-blue-800">
                                        Your tutor account will remain
                                        pending until the required
                                        verification process is
                                        completed.
                                    </p>
                                </div>
                            )}

                            {error && (
                                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Creating your profile..."
                                    : "Complete my profile"}
                            </button>
                        </div>
                    )}

                    {!role && (
                        <p className="mt-6 text-center text-sm text-slate-500">
                            Select an account type above to continue.
                        </p>
                    )}
                </form>
            </div>
        </main>
    );
}