"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Users,
    ClipboardList,
    CalendarDays,
    MessageSquare,
    Shield,
    UserPlus,
    Sparkles,
    CheckCircle2,
    ArrowRight,
    DollarSign,
    Star,
} from "lucide-react";

type ChildStudent = {
    id: string;
    dateOfBirth: string;
    grade?: string;
    learningNeeds?: string;
    independentRequestEligible: boolean;
    user: {
        id: string;
        email: string;
    };
    budget?: {
        maxAmount: number;
        currency: string;
        isFlexible: boolean;
    } | null;
};

type TutorRecommendation = {
    id: string;
    name: string;
    bio?: string;
    hourlyRate: number;
    rating: number;
    matchScore: number;
    subjects: string[];
};

export default function ParentDashboardClient({ session }: { session: any }) {
    const [children, setChildren] = useState<ChildStudent[]>([]);
    const [loadingChildren, setLoadingChildren] = useState(true);
    const [requestsCount, setRequestsCount] = useState(0);
    const [bookingsCount, setBookingsCount] = useState(0);

    const [recommendedTutors, setRecommendedTutors] = useState<TutorRecommendation[]>([]);

    useEffect(() => {
        fetchChildren();
        fetchStats();
    }, []);

    async function fetchChildren() {
        try {
            setLoadingChildren(true);
            const res = await fetch("/api/parent/children");
            const data = await res.json();
            if (res.ok && data.success) {
                setChildren(data.children || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingChildren(false);
        }
    }

    async function fetchStats() {
        try {
            const reqRes = await fetch("/api/tutor/requests");
            const reqData = await reqRes.json();
            if (reqData.success) {
                setRequestsCount(reqData.requests?.length || 0);
            }

            const bookRes = await fetch("/api/student/bookings");
            const bookData = await bookRes.json();
            if (bookData.success) {
                setBookingsCount(bookData.bookings?.length || 0);
            }
        } catch (e) {
            console.error(e);
        }

        // Mock high quality recommended tutors for parent children
        setRecommendedTutors([
            {
                id: "tut-1",
                name: "Dr. Abebe Bikila",
                bio: "PhD in Applied Physics with 8+ years of high school and university prep tutoring experience.",
                hourlyRate: 350,
                rating: 4.9,
                matchScore: 96,
                subjects: ["Physics", "Mechanics", "Calculus"],
            },
            {
                id: "tut-2",
                name: "Tigist Assefa",
                bio: "M.Sc Mathematics. Specializes in algebra fundamentals and test prep for Grade 8-12.",
                hourlyRate: 280,
                rating: 4.8,
                matchScore: 92,
                subjects: ["Algebra II", "Geometry", "Basic Math"],
            },
            {
                id: "tut-3",
                name: "Dawit Worku",
                bio: "Certified English & Chemistry tutor with interactive problem solving techniques.",
                hourlyRate: 240,
                rating: 4.7,
                matchScore: 88,
                subjects: ["Chemistry", "English Literature"],
            },
        ]);
    }

    return (
        <main className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
            {/* Top Welcome Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2 relative z-10 max-w-xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/20 px-3.5 py-1 text-xs font-semibold text-indigo-300">
                        <Shield className="h-3.5 w-3.5 text-emerald-400" />
                        Parental Oversight Hub
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                        Welcome back, {session?.user?.email?.split("@")[0]}!
                    </h1>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                        Manage your linked children accounts, review tutor match requests, and track academic session progress.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
                    <Link
                        href="/parent/children"
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition"
                    >
                        <UserPlus className="h-4 w-4" />
                        Add Child Account
                    </Link>
                </div>
            </div>

            {/* Quick Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <Link
                    href="/parent/children"
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition space-y-2 group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Linked Children</span>
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900">{children.length}</div>
                    <span className="text-[11px] text-slate-400 block">Active dependent profiles</span>
                </Link>

                <Link
                    href="/parent/requests"
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition space-y-2 group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tutor Requests</span>
                        <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ClipboardList className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900">{requestsCount}</div>
                    <span className="text-[11px] text-slate-400 block">Requests pending/accepted</span>
                </Link>

                <Link
                    href="/parent/bookings"
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition space-y-2 group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Family Bookings</span>
                        <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <CalendarDays className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900">{bookingsCount}</div>
                    <span className="text-[11px] text-slate-400 block">Scheduled tutoring classes</span>
                </Link>

                <Link
                    href="/parent/messages"
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition space-y-2 group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tutor Messages</span>
                        <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <MessageSquare className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900">Inbox</div>
                    <span className="text-[11px] text-slate-400 block">Active tutor conversations</span>
                </Link>
            </div>

            {/* Linked Children Quick Summary Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Users className="h-5 w-5 text-indigo-600" />
                        Registered Student Children
                    </h2>

                    <Link
                        href="/parent/children"
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                        Manage All Profiles <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                {loadingChildren ? (
                    <div className="py-8 text-center text-xs text-slate-400">Loading student accounts...</div>
                ) : children.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-3">
                        <Users className="h-10 w-10 text-slate-300 mx-auto" />
                        <h3 className="text-sm font-bold text-slate-900">No children linked yet</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            Register your child's student account to set budget limits and manage tutor requests.
                        </p>
                        <Link
                            href="/parent/children"
                            className="inline-block rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition"
                        >
                            Register Child Account
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {children.map((child) => (
                            <div
                                key={child.id}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-3"
                            >
                                <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-xs text-slate-900 truncate max-w-[160px]">
                                            {child.user?.email}
                                        </h3>
                                        <span
                                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${child.independentRequestEligible
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : "bg-amber-100 text-amber-800"
                                                }`}
                                        >
                                            {child.independentRequestEligible ? "16+ Independent" : "Parent Authorization"}
                                        </span>
                                    </div>

                                    <div className="text-xs text-slate-500 space-y-0.5">
                                        <p>Grade: <strong className="text-slate-800">{child.grade || "Unassigned"}</strong></p>
                                        <p>DOB: {new Date(child.dateOfBirth).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                    <span className="text-slate-400 text-[10px] uppercase font-semibold">Weekly Budget</span>
                                    <span className="font-extrabold text-indigo-600">
                                        {child.budget ? `${child.budget.maxAmount} ETB` : "Not set"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* AI Recommended Tutors for Children */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-indigo-600" />
                            Recommended Tutors for Your Children
                        </h2>
                        <p className="text-xs text-slate-500">
                            Matched based on registered grade levels, learning needs, and budget constraints.
                        </p>
                    </div>

                    <Link
                        href="/student/tutors"
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                        Browse All Tutors <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    {recommendedTutors.map((tut) => (
                        <div
                            key={tut.id}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
                        >
                            <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-sm text-slate-900">{tut.name}</h3>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                                        <Sparkles className="h-3 w-3" />
                                        {tut.matchScore}% Match
                                    </span>
                                </div>

                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{tut.bio}</p>

                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {tut.subjects.map((sub) => (
                                        <span
                                            key={sub}
                                            className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                                        >
                                            {sub}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span className="font-extrabold text-slate-900">{tut.hourlyRate} ETB / hr</span>
                                <Link
                                    href="/parent/requests"
                                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition"
                                >
                                    Request Tutor
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
