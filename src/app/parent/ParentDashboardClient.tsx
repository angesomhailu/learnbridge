"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Users,
    ClipboardList,
    CalendarDays,
    MessageSquare,
    ShieldCheck,
    UserPlus,
    Sparkles,
    ArrowRight,
    Menu,
    X,
    LayoutDashboard,
    UserRound,
    Search,
    Settings,
    LogOut,
    Bell,
    ChevronRight,
    Star,
    WalletCards,
    GraduationCap,
    BookOpen,
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

export default function ParentDashboardClient({
    session,
}: {
    session: any;
}) {
    const [children, setChildren] = useState<ChildStudent[]>([]);
    const [loadingChildren, setLoadingChildren] = useState(true);
    const [requestsCount, setRequestsCount] = useState(0);
    const [bookingsCount, setBookingsCount] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [recommendedTutors, setRecommendedTutors] =
        useState<TutorRecommendation[]>([]);

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
                setRequestsCount(
                    reqData.requests?.length || 0
                );
            }

            const bookRes = await fetch(
                "/api/student/bookings"
            );
            const bookData = await bookRes.json();

            if (bookData.success) {
                setBookingsCount(
                    bookData.bookings?.length || 0
                );
            }
        } catch (e) {
            console.error(e);
        }

        setRecommendedTutors([
            {
                id: "tut-1",
                name: "Dr. Abebe Bikila",
                bio: "PhD in Applied Physics with 8+ years of high school and university prep tutoring experience.",
                hourlyRate: 350,
                rating: 4.9,
                matchScore: 96,
                subjects: [
                    "Physics",
                    "Mechanics",
                    "Calculus",
                ],
            },
            {
                id: "tut-2",
                name: "Tigist Assefa",
                bio: "M.Sc Mathematics. Specializes in algebra fundamentals and test preparation for Grade 8–12.",
                hourlyRate: 280,
                rating: 4.8,
                matchScore: 92,
                subjects: [
                    "Algebra",
                    "Geometry",
                    "Basic Math",
                ],
            },
            {
                id: "tut-3",
                name: "Dawit Worku",
                bio: "Certified English & Chemistry tutor using interactive problem-solving techniques.",
                hourlyRate: 240,
                rating: 4.7,
                matchScore: 88,
                subjects: [
                    "Chemistry",
                    "English",
                ],
            },
        ]);
    }

    const parentName =
        session?.user?.email?.split("@")[0] ||
        "Parent";

    return (
        <div className="min-h-screen bg-[#e5e9ee] text-slate-800">
            {/* =====================================================
                DESKTOP SIDEBAR
            ====================================================== */}

            <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-300 bg-[#f5f6f8] lg:flex lg:flex-col">
                {/* Logo */}
                <div className="flex h-20 items-center border-b border-slate-300 px-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-slate-300 bg-white">
                            <img
                                src="/learnbridge.png"
                                alt="LearnBridge"
                                className="h-8 w-8 object-contain"
                            />
                        </div>

                        <div>
                            <p className="text-base font-bold tracking-tight text-slate-900">
                                LearnBridge
                            </p>

                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                Parent Portal
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-3 py-5">
                    <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Main
                    </p>

                    <nav className="space-y-1">
                        <Link
                            href="/parent"
                            className="flex items-center gap-3 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Link>

                        <Link
                            href="/parent/children"
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
                        >
                            <Users className="h-4 w-4" />
                            My Children
                        </Link>

                        <Link
                            href="/parent/requests"
                            className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
                        >
                            <span className="flex items-center gap-3">
                                <ClipboardList className="h-4 w-4" />
                                Tutor Requests
                            </span>

                            {requestsCount > 0 && (
                                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                                    {requestsCount}
                                </span>
                            )}
                        </Link>

                        <Link
                            href="/parent/bookings"
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
                        >
                            <CalendarDays className="h-4 w-4" />
                            Bookings
                        </Link>

                        <Link
                            href="/parent/messages"
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
                        >
                            <MessageSquare className="h-4 w-4" />
                            Messages
                        </Link>
                    </nav>

                    <p className="mt-8 px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Account
                    </p>

                    <nav className="space-y-1">
                        <Link
                            href="/parent/profile"
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
                        >
                            <UserRound className="h-4 w-4" />
                            Profile
                        </Link>

                        <Link
                            href="/parent/settings"
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
                        >
                            <Settings className="h-4 w-4" />
                            Settings
                        </Link>
                    </nav>
                </div>

                {/* Sidebar Bottom */}
                <div className="border-t border-slate-300 p-4">
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                        <div className="flex items-start gap-2">
                            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

                            <div>
                                <p className="text-xs font-bold text-blue-900">
                                    Parent Controls
                                </p>

                                <p className="mt-1 text-[10px] leading-4 text-blue-700">
                                    You control tutor requests,
                                    budgets and your children's
                                    learning activities.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* =====================================================
                MOBILE HEADER
            ====================================================== */}

            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-300 bg-[#f5f6f8] px-4 lg:hidden">
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-slate-300 bg-white">
                        <img
                            src="/learnbridge.png"
                            alt="LearnBridge"
                            className="h-7 w-7 object-contain"
                        />
                    </div>

                    <div>
                        <p className="text-sm font-bold text-slate-900">
                            LearnBridge
                        </p>

                        <p className="text-[9px] uppercase tracking-wider text-slate-500">
                            Parent Portal
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setMobileMenuOpen(
                            !mobileMenuOpen
                        )
                    }
                    className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700"
                >
                    {mobileMenuOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </button>
            </header>

            {/* =====================================================
                MOBILE MENU
            ====================================================== */}

            {mobileMenuOpen && (
                <div className="fixed inset-x-0 top-16 z-20 border-b border-slate-300 bg-[#f5f6f8] p-4 shadow-md lg:hidden">
                    <nav className="space-y-1">
                        <Link
                            href="/parent"
                            onClick={() =>
                                setMobileMenuOpen(false)
                            }
                            className="flex items-center gap-3 rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Link>

                        <Link
                            href="/parent/children"
                            onClick={() =>
                                setMobileMenuOpen(false)
                            }
                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-200"
                        >
                            <Users className="h-4 w-4" />
                            My Children
                        </Link>

                        <Link
                            href="/parent/requests"
                            onClick={() =>
                                setMobileMenuOpen(false)
                            }
                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-200"
                        >
                            <ClipboardList className="h-4 w-4" />
                            Tutor Requests
                        </Link>

                        <Link
                            href="/parent/bookings"
                            onClick={() =>
                                setMobileMenuOpen(false)
                            }
                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-200"
                        >
                            <CalendarDays className="h-4 w-4" />
                            Bookings
                        </Link>

                        <Link
                            href="/parent/messages"
                            onClick={() =>
                                setMobileMenuOpen(false)
                            }
                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-200"
                        >
                            <MessageSquare className="h-4 w-4" />
                            Messages
                        </Link>
                    </nav>
                </div>
            )}

            {/* =====================================================
                MAIN APPLICATION
            ====================================================== */}

            <div className="lg:pl-64">
                {/* Top Application Bar */}
                <header className="hidden h-16 items-center justify-between border-b border-slate-300 bg-[#f5f6f8] px-8 lg:flex">
                    <div>
                        <p className="text-xs font-medium text-slate-500">
                            Parent Portal
                        </p>

                        <p className="text-sm font-semibold text-slate-800">
                            Learning Management Dashboard
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className="relative rounded-lg border border-slate-300 bg-white p-2 text-slate-600 hover:bg-slate-100"
                        >
                            <Bell className="h-4 w-4" />

                            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-blue-600" />
                        </button>

                        <div className="h-7 w-px bg-slate-300" />

                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                {parentName
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div className="hidden xl:block">
                                <p className="max-w-[160px] truncate text-xs font-bold text-slate-800">
                                    {parentName}
                                </p>

                                <p className="text-[10px] text-slate-500">
                                    Parent
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* =================================================
                    CONTENT
                ================================================== */}

                <main className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
                    {/* Page Header */}
                    <section className="mb-6 border-b border-slate-300 pb-5">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                            <div>
                                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                                    <LayoutDashboard className="h-3.5 w-3.5" />
                                    Dashboard
                                    <ChevronRight className="h-3 w-3" />
                                    Parent Overview
                                </div>

                                <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                                    Welcome back,{" "}
                                    <span className="text-blue-700">
                                        {parentName}
                                    </span>
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                                    Monitor your children's learning,
                                    manage tutor requests, and keep
                                    track of upcoming tutoring
                                    sessions.
                                </p>
                            </div>

                            <Link
                                href="/parent/children"
                                className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
                            >
                                <UserPlus className="h-4 w-4" />
                                Add Child
                            </Link>
                        </div>
                    </section>

                    {/* =================================================
                        INFORMATION STRIP
                    ================================================== */}

                    <div className="mb-6 flex flex-col gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                            <div>
                                <p className="text-xs font-bold text-blue-900">
                                    Parent supervision is active
                                </p>

                                <p className="mt-0.5 text-[11px] leading-5 text-blue-700">
                                    You can manage children's profiles,
                                    budgets and tutor requests from
                                    this portal.
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/parent/children"
                            className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900"
                        >
                            Manage children
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    {/* =================================================
                        STATISTICS
                    ================================================== */}

                    <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <Link
                            href="/parent/children"
                            className="group rounded-lg border border-slate-300 bg-[#f8f9fa] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                        Linked Children
                                    </p>

                                    <p className="mt-3 text-3xl font-bold text-slate-900">
                                        {children.length}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-blue-100 p-2.5 text-blue-700">
                                    <Users className="h-5 w-5" />
                                </div>
                            </div>

                            <p className="mt-3 text-[11px] text-slate-500">
                                Active student profiles
                            </p>
                        </Link>

                        <Link
                            href="/parent/requests"
                            className="group rounded-lg border border-slate-300 bg-[#f8f9fa] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                        Tutor Requests
                                    </p>

                                    <p className="mt-3 text-3xl font-bold text-slate-900">
                                        {requestsCount}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-amber-100 p-2.5 text-amber-700">
                                    <ClipboardList className="h-5 w-5" />
                                </div>
                            </div>

                            <p className="mt-3 text-[11px] text-slate-500">
                                Pending and active requests
                            </p>
                        </Link>

                        <Link
                            href="/parent/bookings"
                            className="group rounded-lg border border-slate-300 bg-[#f8f9fa] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                        Family Bookings
                                    </p>

                                    <p className="mt-3 text-3xl font-bold text-slate-900">
                                        {bookingsCount}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-emerald-100 p-2.5 text-emerald-700">
                                    <CalendarDays className="h-5 w-5" />
                                </div>
                            </div>

                            <p className="mt-3 text-[11px] text-slate-500">
                                Scheduled tutoring sessions
                            </p>
                        </Link>

                        <Link
                            href="/parent/messages"
                            className="group rounded-lg border border-slate-300 bg-[#f8f9fa] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                        Messages
                                    </p>

                                    <p className="mt-3 text-xl font-bold text-slate-900">
                                        Tutor Inbox
                                    </p>
                                </div>

                                <div className="rounded-lg bg-purple-100 p-2.5 text-purple-700">
                                    <MessageSquare className="h-5 w-5" />
                                </div>
                            </div>

                            <p className="mt-3 text-[11px] text-slate-500">
                                Communicate with tutors
                            </p>
                        </Link>
                    </section>

                    {/* =================================================
                        TWO COLUMN SECTION
                    ================================================== */}

                    <section className="mb-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                        {/* Children */}
                        <div className="rounded-lg border border-slate-300 bg-[#f8f9fa] shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-300 px-5 py-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5 text-blue-600" />

                                        <h2 className="text-sm font-bold text-slate-900">
                                            My Children
                                        </h2>
                                    </div>

                                    <p className="mt-1 text-[11px] text-slate-500">
                                        Student accounts linked to your
                                        parent profile
                                    </p>
                                </div>

                                <Link
                                    href="/parent/children"
                                    className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800"
                                >
                                    View all
                                    <ArrowRight className="h-3 w-3" />
                                </Link>
                            </div>

                            <div className="p-5">
                                {loadingChildren ? (
                                    <div className="py-10 text-center">
                                        <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />

                                        <p className="mt-3 text-xs text-slate-500">
                                            Loading student accounts...
                                        </p>
                                    </div>
                                ) : children.length === 0 ? (
                                    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                                        <Users className="mx-auto h-9 w-9 text-slate-300" />

                                        <h3 className="mt-3 text-sm font-bold text-slate-800">
                                            No children linked yet
                                        </h3>

                                        <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
                                            Register your child's
                                            student account to manage
                                            tutoring, budgets and
                                            learning activities.
                                        </p>

                                        <Link
                                            href="/parent/children"
                                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                                        >
                                            <UserPlus className="h-3.5 w-3.5" />
                                            Register Child
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-200">
                                        {children.map(
                                            (child) => (
                                                <div
                                                    key={child.id}
                                                    className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700">
                                                            {child.user?.email
                                                                ?.charAt(
                                                                    0
                                                                )
                                                                .toUpperCase()}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate text-xs font-bold text-slate-900">
                                                                {
                                                                    child
                                                                        .user
                                                                        ?.email
                                                                }
                                                            </p>

                                                            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500">
                                                                <span>
                                                                    Grade:{" "}
                                                                    <strong className="text-slate-700">
                                                                        {child.grade ||
                                                                            "Unassigned"}
                                                                    </strong>
                                                                </span>

                                                                <span>
                                                                    DOB:{" "}
                                                                    {new Date(
                                                                        child.dateOfBirth
                                                                    ).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 sm:justify-end">
                                                        <span
                                                            className={`rounded-full px-2 py-1 text-[9px] font-bold ${child.independentRequestEligible
                                                                    ? "bg-emerald-100 text-emerald-700"
                                                                    : "bg-amber-100 text-amber-700"
                                                                }`}
                                                        >
                                                            {child.independentRequestEligible
                                                                ? "Independent"
                                                                : "Parent approval"}
                                                        </span>

                                                        <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-700">
                                                            {child.budget
                                                                ? `${child.budget.maxAmount} ${child.budget.currency}`
                                                                : "Budget not set"}
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="rounded-lg border border-slate-300 bg-[#f8f9fa] shadow-sm">
                            <div className="border-b border-slate-300 px-5 py-4">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-blue-600" />

                                    <h2 className="text-sm font-bold text-slate-900">
                                        Quick Actions
                                    </h2>
                                </div>

                                <p className="mt-1 text-[11px] text-slate-500">
                                    Common parent activities
                                </p>
                            </div>

                            <div className="grid gap-2 p-4">
                                <Link
                                    href="/parent/children"
                                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 transition hover:border-blue-300 hover:bg-blue-50"
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="rounded-md bg-blue-100 p-2 text-blue-600">
                                            <UserPlus className="h-4 w-4" />
                                        </span>

                                        <span>
                                            <span className="block text-xs font-bold text-slate-800">
                                                Add Child
                                            </span>

                                            <span className="block text-[10px] text-slate-500">
                                                Create a student profile
                                            </span>
                                        </span>
                                    </span>

                                    <ArrowRight className="h-4 w-4 text-slate-400" />
                                </Link>

                                <Link
                                    href="/student/tutors"
                                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 transition hover:border-blue-300 hover:bg-blue-50"
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="rounded-md bg-emerald-100 p-2 text-emerald-600">
                                            <Search className="h-4 w-4" />
                                        </span>

                                        <span>
                                            <span className="block text-xs font-bold text-slate-800">
                                                Find a Tutor
                                            </span>

                                            <span className="block text-[10px] text-slate-500">
                                                Browse available tutors
                                            </span>
                                        </span>
                                    </span>

                                    <ArrowRight className="h-4 w-4 text-slate-400" />
                                </Link>

                                <Link
                                    href="/parent/bookings"
                                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 transition hover:border-blue-300 hover:bg-blue-50"
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="rounded-md bg-amber-100 p-2 text-amber-600">
                                            <CalendarDays className="h-4 w-4" />
                                        </span>

                                        <span>
                                            <span className="block text-xs font-bold text-slate-800">
                                                View Bookings
                                            </span>

                                            <span className="block text-[10px] text-slate-500">
                                                Manage tutoring sessions
                                            </span>
                                        </span>
                                    </span>

                                    <ArrowRight className="h-4 w-4 text-slate-400" />
                                </Link>

                                <Link
                                    href="/parent/messages"
                                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 transition hover:border-blue-300 hover:bg-blue-50"
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="rounded-md bg-purple-100 p-2 text-purple-600">
                                            <MessageSquare className="h-4 w-4" />
                                        </span>

                                        <span>
                                            <span className="block text-xs font-bold text-slate-800">
                                                Message Tutors
                                            </span>

                                            <span className="block text-[10px] text-slate-500">
                                                Open your conversations
                                            </span>
                                        </span>
                                    </span>

                                    <ArrowRight className="h-4 w-4 text-slate-400" />
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* =================================================
                        AI TUTOR RECOMMENDATIONS
                    ================================================== */}

                    <section className="rounded-lg border border-slate-300 bg-[#f8f9fa] shadow-sm">
                        <div className="flex flex-col gap-3 border-b border-slate-300 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-blue-600" />

                                    <h2 className="text-sm font-bold text-slate-900">
                                        AI Tutor Recommendations
                                    </h2>

                                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[9px] font-bold text-blue-700">
                                        AI MATCH
                                    </span>
                                </div>

                                <p className="mt-1 text-[11px] text-slate-500">
                                    Tutors matched using student needs,
                                    grade level and budget.
                                </p>
                            </div>

                            <Link
                                href="/student/tutors"
                                className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800"
                            >
                                Browse all tutors
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
                            {recommendedTutors.map(
                                (tutor) => (
                                    <div
                                        key={tutor.id}
                                        className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm"
                                    >
                                        <div>
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                                                        {tutor.name
                                                            .split(
                                                                " "
                                                            )
                                                            .map(
                                                                (
                                                                    word
                                                                ) =>
                                                                    word.charAt(
                                                                        0
                                                                    )
                                                            )
                                                            .slice(
                                                                0,
                                                                2
                                                            )
                                                            .join(
                                                                ""
                                                            )}
                                                    </div>

                                                    <div>
                                                        <h3 className="text-xs font-bold text-slate-900">
                                                            {
                                                                tutor.name
                                                            }
                                                        </h3>

                                                        <div className="mt-1 flex items-center gap-1">
                                                            <Star className="h-3 w-3 fill-current text-amber-500" />

                                                            <span className="text-[10px] font-bold text-slate-600">
                                                                {
                                                                    tutor.rating
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <span className="rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-bold text-emerald-700">
                                                    {tutor.matchScore}%
                                                    match
                                                </span>
                                            </div>

                                            <p className="mt-4 line-clamp-2 text-[11px] leading-5 text-slate-500">
                                                {tutor.bio}
                                            </p>

                                            <div className="mt-3 flex flex-wrap gap-1.5">
                                                {tutor.subjects.map(
                                                    (
                                                        subject
                                                    ) => (
                                                        <span
                                                            key={
                                                                subject
                                                            }
                                                            className="rounded-md bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-600"
                                                        >
                                                            {
                                                                subject
                                                            }
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                                            <div className="flex items-center gap-1.5">
                                                <WalletCards className="h-3.5 w-3.5 text-slate-400" />

                                                <span className="text-xs font-bold text-slate-900">
                                                    {
                                                        tutor.hourlyRate
                                                    }{" "}
                                                    ETB/hr
                                                </span>
                                            </div>

                                            <Link
                                                href="/parent/requests"
                                                className="rounded-md bg-blue-600 px-3 py-2 text-[10px] font-bold text-white transition hover:bg-blue-700"
                                            >
                                                Request Tutor
                                            </Link>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="mt-8 flex flex-col gap-2 border-t border-slate-300 pt-5 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            LearnBridge Parent Portal
                        </p>

                        <div className="flex items-center gap-4">
                            <Link
                                href="/parent/settings"
                                className="hover:text-blue-600"
                            >
                                Settings
                            </Link>

                            <Link
                                href="/help"
                                className="hover:text-blue-600"
                            >
                                Help & Support
                            </Link>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}