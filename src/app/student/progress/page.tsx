"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, Award, Target, BookOpen, CheckCircle2, Clock, Calendar } from "lucide-react";

type Goal = {
    id: string;
    title: string;
    description?: string | null;
    targetDate?: string | null;
    status: string;
};

type Booking = {
    id: string;
    startTime: string;
    endTime: string;
    status: string;
    tutor: {
        user: {
            email: string;
        };
    };
};

export default function StudentProgressPage() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            const [goalsRes, bookingsRes] = await Promise.all([
                fetch("/api/student/goals"),
                fetch("/api/student/bookings"),
            ]);

            const goalsData = await goalsRes.json();
            const bookingsData = await bookingsRes.json();

            if (goalsRes.ok && goalsData.success) {
                setGoals(goalsData.goals || []);
            }
            if (bookingsRes.ok && bookingsData.success) {
                setBookings(bookingsData.bookings || []);
            }
        } catch (e) {
            console.error("Failed to load progress data:", e);
        } finally {
            setLoading(false);
        }
    }

    const completedBookings = bookings.filter((b) => b.status === "COMPLETED");
    const completedGoals = goals.filter((g) => g.status === "COMPLETED" || g.status === "ACHIEVED");
    const pendingGoals = goals.filter((g) => g.status !== "COMPLETED" && g.status !== "ACHIEVED");

    // Calculate total hours completed
    const totalHours = completedBookings.reduce((acc, b) => {
        const start = new Date(b.startTime).getTime();
        const end = new Date(b.endTime).getTime();
        const hours = (end - start) / (1000 * 60 * 60);
        return acc + Math.max(0, hours);
    }, 0);

    return (
        <main className="min-h-screen bg-slate-50 p-6 md:p-10">
            <div className="mx-auto max-w-6xl space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <TrendingUp className="h-8 w-8 text-blue-600" />
                            My Learning Progress
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Track completed tutoring hours, milestone achievements, and academic goals.
                        </p>
                    </div>

                    <Link
                        href="/student/goals"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                    >
                        <Target className="h-4 w-4" />
                        Manage Goals
                    </Link>
                </div>

                {/* Stat Cards Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Clock className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500">Completed Tutoring</p>
                                <p className="text-2xl font-bold text-slate-900">{totalHours.toFixed(1)} hrs</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500">Completed Sessions</p>
                                <p className="text-2xl font-bold text-slate-900">{completedBookings.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                <Award className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500">Goals Achieved</p>
                                <p className="text-2xl font-bold text-slate-900">{completedGoals.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <Target className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500">Active Goals</p>
                                <p className="text-2xl font-bold text-slate-900">{pendingGoals.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Details Sections */}
                <div className="grid gap-8 lg:grid-cols-12">
                    {/* Goals Progress */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Target className="h-5 w-5 text-blue-600" />
                                Active Learning Goals
                            </h2>
                            <Link href="/student/goals" className="text-xs font-semibold text-blue-600 hover:underline">
                                View All
                            </Link>
                        </div>

                        {loading ? (
                            <div className="p-8 text-center text-xs text-slate-400">Loading goals...</div>
                        ) : goals.length === 0 ? (
                            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                                <p className="text-xs text-slate-500">No learning goals set yet.</p>
                                <Link href="/student/goals" className="mt-3 inline-block text-xs font-semibold text-blue-600">
                                    + Add Learning Goal
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {goals.map((g) => {
                                    const isDone = g.status === "COMPLETED" || g.status === "ACHIEVED";
                                    return (
                                        <div key={g.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-sm font-bold text-slate-900">{g.title}</h3>
                                                <span
                                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isDone ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                                                        }`}
                                                >
                                                    {g.status}
                                                </span>
                                            </div>
                                            {g.description && <p className="text-xs text-slate-600">{g.description}</p>}
                                            {g.targetDate && (
                                                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    Target: {new Date(g.targetDate).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Recent Sessions */}
                    <div className="lg:col-span-5 space-y-4">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            Completed Tutoring Sessions
                        </h2>

                        {loading ? (
                            <div className="p-8 text-center text-xs text-slate-400">Loading session history...</div>
                        ) : completedBookings.length === 0 ? (
                            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                                <p className="text-xs text-slate-500">No completed sessions logged yet.</p>
                                <Link href="/student/tutors" className="mt-3 inline-block text-xs font-semibold text-blue-600">
                                    Find a Tutor
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {completedBookings.map((b) => (
                                    <div key={b.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">{b.tutor?.user?.email}</p>
                                            <p className="text-[11px] text-slate-500 mt-0.5">
                                                {new Date(b.startTime).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold">
                                            Completed
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
