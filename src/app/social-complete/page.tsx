"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SocialCompletePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <main className="min-h-screen bg-[#dfe3e8] flex items-center justify-center">
                <div className="rounded-xl border border-slate-300 bg-[#f4f5f7] px-8 py-6 shadow-sm">
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

    return (
        <main className="min-h-screen bg-[#dfe3e8] flex items-center justify-center px-4">
            <div className="w-full max-w-xl rounded-2xl border border-slate-300 bg-[#f4f5f7] p-8 shadow-sm">
                <h1 className="text-2xl font-bold text-slate-900">
                    Welcome to LearnBridge
                </h1>

                <p className="mt-2 text-sm text-slate-600">
                    Complete your account setup to continue.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <button
                        type="button"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-6 text-center font-semibold text-slate-800 transition hover:border-blue-500 hover:bg-blue-50"
                    >
                        Student
                    </button>

                    <button
                        type="button"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-6 text-center font-semibold text-slate-800 transition hover:border-blue-500 hover:bg-blue-50"
                    >
                        Parent
                    </button>

                    <button
                        type="button"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-6 text-center font-semibold text-slate-800 transition hover:border-blue-500 hover:bg-blue-50"
                    >
                        Tutor
                    </button>
                </div>
            </div>
        </main>
    );
}