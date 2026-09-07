"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
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

const accountItems = [
    {
        name: "Profile",
        href: "/student/profile",
        icon: User,
    },
    {
        name: "Settings",
        href: "/student/settings",
        icon: Settings,
    },
];

export default function StudentLayout({
    children,
}: StudentLayoutProps) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut({ callbackUrl: "/login" });
        } catch {
            window.location.href = "/login";
        }
    };

    const currentRoute = [...menuItems, ...accountItems].find(
        (item) =>
            item.href === pathname ||
            (item.href !== "/student" && pathname.startsWith(item.href))
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Desktop Sidebar */}
            <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
                {/* Logo */}
                <div className="flex h-20 items-center border-b border-slate-200 px-6">
                    <Link href="/student" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20">
                            <span className="text-lg">L</span>
                        </div>

                        <div>
                            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                                LearnBridge
                            </h1>
                            <p className="text-xs font-semibold text-blue-600">
                                Student Portal
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <div className="flex h-[calc(100vh-80px)] flex-col px-4 py-6 overflow-y-auto">
                    <nav className="space-y-1">
                        <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                            Learning Hub
                        </p>

                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active =
                                pathname === item.href ||
                                (item.href !== "/student" &&
                                    pathname.startsWith(item.href));

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${active
                                        ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <nav className="mt-6 space-y-1">
                        <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                            Account & Preferences
                        </p>

                        {accountItems.map((item) => {
                            const Icon = item.icon;
                            const active = pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${active
                                        ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout Button */}
                    <div className="mt-auto pt-6 border-t border-slate-100">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                        >
                            <LogOut className="h-4 w-4 text-red-500" />
                            Log Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile / Desktop Top Header Navbar */}
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur px-4 sm:px-6 lg:ml-64 shadow-xs">
                <div className="flex items-center gap-3">
                    {/* Sandwich / Hamburger Toggle Button (Mobile) */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden focus:outline-hidden"
                        aria-label="Toggle Navigation Sandwich Menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6 text-slate-900" />
                        ) : (
                            <Menu className="h-6 w-6 text-slate-900" />
                        )}
                    </button>

                    {/* Logo (Mobile view) */}
                    <Link href="/student" className="flex items-center gap-2 lg:hidden">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                            L
                        </div>
                        <span className="font-bold text-slate-900 text-base">LearnBridge</span>
                    </Link>

                    {/* Active Section Breadcrumb (Desktop view) */}
                    <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500">
                        <span>Student Portal</span>
                        <ChevronRight className="h-4 w-4 text-slate-300" />
                        <span className="font-semibold text-slate-900">
                            {currentRoute?.name || "Dashboard"}
                        </span>
                    </div>
                </div>

                {/* Right Utilities (Notifications, Profile, Logout) */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/student/messages"
                        className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100 transition"
                        title="Messages & Notifications"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
                    </Link>

                    <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

                    <Link
                        href="/student/profile"
                        className="flex items-center gap-2.5 rounded-xl p-1.5 hover:bg-slate-50 transition"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                            ST
                        </div>
                        <span className="hidden sm:block text-xs font-semibold text-slate-800">
                            Student Profile
                        </span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        Logout
                    </button>
                </div>
            </header>

            {/* Sandwich Mobile Navigation Drawer Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="relative flex w-full max-w-xs flex-col bg-white p-6 shadow-2xl z-10">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <Link
                                href="/student"
                                className="flex items-center gap-3"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                                    L
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-900">LearnBridge</h2>
                                    <p className="text-xs text-blue-600 font-semibold">Student Portal</p>
                                </div>
                            </Link>

                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Navigation Menu Links */}
                        <div className="flex-1 overflow-y-auto py-6 space-y-6">
                            <div>
                                <p className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Learning Navigation
                                </p>
                                <nav className="space-y-1">
                                    {menuItems.map((item) => {
                                        const Icon = item.icon;
                                        const active =
                                            pathname === item.href ||
                                            (item.href !== "/student" &&
                                                pathname.startsWith(item.href));

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${active
                                                    ? "bg-blue-600 text-white font-semibold"
                                                    : "text-slate-700 hover:bg-slate-100"
                                                    }`}
                                            >
                                                <Icon className="h-5 w-5" />
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>

                            <div>
                                <p className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Account & Settings
                                </p>
                                <nav className="space-y-1">
                                    {accountItems.map((item) => {
                                        const Icon = item.icon;
                                        const active = pathname.startsWith(item.href);

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${active
                                                    ? "bg-blue-600 text-white font-semibold"
                                                    : "text-slate-700 hover:bg-slate-100"
                                                    }`}
                                            >
                                                <Icon className="h-5 w-5" />
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>

                        {/* Mobile Drawer Logout */}
                        <div className="border-t border-slate-100 pt-4">
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    handleLogout();
                                }}
                                className="flex w-full items-center gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-100 transition"
                            >
                                <LogOut className="h-5 w-5" />
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content View */}
            <main className="flex-1 lg:ml-64 flex flex-col">
                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </div>

                {/* Useful Student Footer */}
                <StudentFooter />
            </main>
        </div>
    );
}