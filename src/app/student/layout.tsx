"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    LayoutDashboard,
    Search,
    ClipboardList,
    CalendarDays,
    MessageSquare,
    TrendingUp,
    CreditCard,
    User,
    Settings,
    ChevronDown,
    LogOut,
    Menu,
    X,
    BookOpen,
    DollarSign,
    Clock,
    Target,
    Bell,
    ChevronRight,
} from "lucide-react";

import StudentFooter from "@/components/student/StudentFooter";

interface StudentLayoutProps {
    children: React.ReactNode;
}

const menuItems = [
    {
        name: "Dashboard",
        href: "/student",
        icon: LayoutDashboard,
    },
    {
        name: "Find Tutors",
        href: "/student/tutors",
        icon: Search,
    },
    {
        name: "My Requests",
        href: "/student/requests",
        icon: ClipboardList,
    },
    {
        name: "My Bookings",
        href: "/student/bookings",
        icon: CalendarDays,
    },
    {
        name: "Messages",
        href: "/student/messages",
        icon: MessageSquare,
    },
    {
        name: "My Progress",
        href: "/student/progress",
        icon: TrendingUp,
    },
    {
        name: "Subjects",
        href: "/student/subjects",
        icon: BookOpen,
    },
    {
        name: "Budget",
        href: "/student/budget",
        icon: DollarSign,
    },
    {
        name: "Availability",
        href: "/student/availability",
        icon: Clock,
    },
    {
        name: "Learning Goals",
        href: "/student/goals",
        icon: Target,
    },
    {
        name: "Payments",
        href: "/student/payments",
        icon: CreditCard,
    },
];

export default function StudentLayout({
    children,
}: StudentLayoutProps) {
    const pathname = usePathname();
    const { data: session } = useSession();

    const [isProfileMenuOpen, setIsProfileMenuOpen] =
        useState(false);

    const [isSidebarOpen, setIsSidebarOpen] =
        useState(false);

    const handleLogout = async () => {
        try {
            await signOut({
                callbackUrl: "/login",
            });
        } catch {
            window.location.href = "/login";
        }
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const currentRoute = menuItems.find(
        (item) =>
            item.href === pathname ||
            (item.href !== "/student" &&
                pathname.startsWith(item.href))
    );

    return (
        <div className="flex min-h-screen flex-col bg-[#e5e9ee] font-sans text-slate-800">

            {/* =========================================================
                TOP APPLICATION BAR (NETACAD NAVY)
            ========================================================= */}
            <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#001f35] bg-[#002b49] px-4 shadow-md sm:px-6 text-white">

                {/* LEFT SIDE */}
                <div className="flex items-center gap-3">

                    {/* SANDWICH BUTTON */}
                    <button
                        type="button"
                        onClick={() =>
                            setIsSidebarOpen(true)
                        }
                        aria-label="Open navigation menu"
                        aria-expanded={isSidebarOpen}
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white shadow-sm transition hover:bg-white/20 hover:text-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    {/* LOGO */}
                    <Link
                        href="/student"
                        className="flex items-center gap-2.5"
                        onClick={closeSidebar}
                    >
                        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white/10 p-1 border border-white/20">
                            <img
                                src="/learnbridge.png"
                                alt="LearnBridge"
                                className="h-full w-full object-contain"
                            />
                        </div>

                        <div className="hidden sm:block">
                            <p className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
                                Learn<span className="text-sky-400">Bridge</span>
                                <span className="text-[9px] uppercase font-extrabold bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded-full border border-sky-400/30">Student</span>
                            </p>

                            <p className="text-[9px] font-semibold uppercase tracking-widest text-sky-200/70">
                                Global Skills Partner
                            </p>
                        </div>
                    </Link>
                </div>

                {/* =====================================================
                    RIGHT SIDE
                ====================================================== */}
                <div className="flex items-center gap-2 sm:gap-4">

                    {/* BREADCRUMB */}
                    <div className="hidden items-center gap-2 text-xs text-sky-200/80 md:flex font-semibold">
                        <span>Student Portal</span>

                        <ChevronRight className="h-3.5 w-3.5 text-sky-400" />

                        <span className="font-bold text-white bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                            {currentRoute?.name ??
                                "Dashboard"}
                        </span>
                    </div>

                    {/* NOTIFICATION */}
                    <button
                        type="button"
                        aria-label="Notifications"
                        className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-sky-100 transition hover:bg-white/10 hover:text-white"
                    >
                        <Bell className="h-5 w-5" />

                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#002b49]" />
                    </button>

                    {/* PROFILE */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() =>
                                setIsProfileMenuOpen(
                                    (prev) => !prev
                                )
                            }
                            aria-expanded={
                                isProfileMenuOpen
                            }
                            className="hidden cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-2.5 py-1.5 transition hover:bg-white/20 sm:flex"
                        >
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0070ad] text-white font-bold text-xs">
                                <User className="h-4 w-4" />
                            </div>

                            <div className="hidden text-left lg:block">
                                <p className="max-w-[140px] truncate text-xs font-bold text-white">
                                    {session?.user?.name ||
                                        "Student"}
                                </p>

                                <p className="text-[9px] font-semibold text-sky-200">
                                    Active Learner
                                </p>
                            </div>

                            <ChevronDown className="hidden h-4 w-4 text-sky-300 lg:block" />
                        </button>

                        {isProfileMenuOpen && (
                            <>
                                {/* PROFILE MENU OVERLAY */}
                                <button
                                    type="button"
                                    aria-label="Close profile menu"
                                    onClick={() =>
                                        setIsProfileMenuOpen(
                                            false
                                        )
                                    }
                                    className="fixed inset-0 z-40 cursor-default"
                                />

                                {/* PROFILE DROPDOWN */}
                                <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-2xl">

                                    {/* USER INFORMATION */}
                                    <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                                        <p className="truncate text-sm font-extrabold text-slate-900">
                                            {session?.user?.name ||
                                                "Student"}
                                        </p>

                                        <p className="truncate text-xs text-slate-500 font-medium">
                                            {session?.user?.email ||
                                                ""}
                                        </p>
                                    </div>

                                    <div className="p-2">

                                        {/* PROFILE */}
                                        <Link
                                            href="/student/profile"
                                            onClick={() =>
                                                setIsProfileMenuOpen(
                                                    false
                                                )
                                            }
                                            className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-sky-50 hover:text-[#0070ad]"
                                        >
                                            <User className="h-4 w-4 text-[#0070ad]" />

                                            <span>
                                                Profile Settings
                                            </span>
                                        </Link>

                                        {/* SETTINGS */}
                                        <Link
                                            href="/student/settings"
                                            onClick={() =>
                                                setIsProfileMenuOpen(
                                                    false
                                                )
                                            }
                                            className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-sky-50 hover:text-[#0070ad]"
                                        >
                                            <Settings className="h-4 w-4 text-[#0070ad]" />

                                            <span>
                                                Account Settings
                                            </span>
                                        </Link>

                                        <div className="my-2 border-t border-slate-100" />

                                        {/* SIGN OUT */}
                                        <button
                                            type="button"
                                            onClick={
                                                handleLogout
                                            }
                                            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                        >
                                            <LogOut className="h-4 w-4" />

                                            <span>
                                                Sign Out
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* =========================================================
                SIDEBAR OVERLAY
            ========================================================= */}
            {isSidebarOpen && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={closeSidebar}
                    className="fixed inset-0 z-40 cursor-default bg-slate-950/60 backdrop-blur-sm"
                />
            )}

            {/* =========================================================
                SLIDE-IN SIDEBAR (NETACAD STYLING)
            ========================================================= */}
            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${isSidebarOpen
                    ? "translate-x-0"
                    : "-translate-x-full"
                    }`}
            >
                {/* SIDEBAR HEADER */}
                <div className="flex h-16 items-center justify-between border-b border-sky-950 bg-[#002b49] px-4 text-white">
                    <Link
                        href="/student"
                        onClick={closeSidebar}
                        className="flex items-center gap-3"
                    >
                        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white/10 p-1 border border-white/20">
                            <img
                                src="/learnbridge.png"
                                alt="LearnBridge"
                                className="h-full w-full object-contain"
                            />
                        </div>

                        <div>
                            <p className="text-sm font-extrabold tracking-tight text-white">
                                Learn<span className="text-sky-400">Bridge</span>
                            </p>

                            <p className="text-[9px] font-semibold uppercase tracking-widest text-sky-200">
                                Student Portal
                            </p>
                        </div>
                    </Link>

                    {/* CLOSE BUTTON */}
                    <button
                        type="button"
                        onClick={closeSidebar}
                        aria-label="Close navigation menu"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* =====================================================
                    NAVIGATION (NETACAD ACTIVE ACCENTS)
                ====================================================== */}
                <div className="flex-1 overflow-y-auto px-3 py-5">

                    {/* LEARNING */}
                    <div>
                        <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-widest text-[#0070ad]">
                            Learning Center
                        </p>

                        <nav className="space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;

                                const isActive =
                                    item.href ===
                                        "/student"
                                        ? pathname ===
                                        "/student"
                                        : pathname ===
                                        item.href ||
                                        pathname.startsWith(
                                            `${item.href}/`
                                        );

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={closeSidebar}
                                        className={`group flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${isActive
                                            ? "bg-[#0070ad] text-white shadow-md font-extrabold"
                                            : "text-slate-700 hover:bg-sky-50 hover:text-[#0070ad]"
                                            }`}
                                    >
                                        <Icon
                                            className={`h-[18px] w-[18px] shrink-0 ${isActive
                                                ? "text-white"
                                                : "text-slate-500 group-hover:text-[#0070ad]"
                                                }`}
                                        />

                                        <span>
                                            {item.name}
                                        </span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </aside>

            {/* =========================================================
                MAIN CONTENT
            ========================================================= */}
            <main className="flex min-w-0 flex-1 flex-col">
                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </div>

                <StudentFooter />
            </main>
        </div>
    );
}