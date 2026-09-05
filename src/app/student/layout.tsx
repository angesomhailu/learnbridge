"use client";

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
    LogOut,
    X,
    BookOpen,
    DollarSign,
    Clock,
    Target,
} from "lucide-react";

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

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
                {/* Logo */}
                <div className="flex h-20 items-center border-b border-slate-200 px-6">
                    <Link href="/student" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                            <span className="text-lg font-bold">L</span>
                        </div>

                        <div>
                            <h1 className="text-lg font-bold text-slate-900">
                                LearnBridge
                            </h1>
                            <p className="text-xs text-slate-500">
                                Student Portal
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <div className="flex h-[calc(100vh-80px)] flex-col px-4 py-6">
                    <nav className="space-y-1">
                        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Learning
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
                                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <nav className="mt-8 space-y-1">
                        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Account
                        </p>

                        {accountItems.map((item) => {
                            const Icon = item.icon;

                            const active = pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-auto">
                        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600">
                            <LogOut className="h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile header */}
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
                <Link href="/student" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white">
                        <span className="font-bold">L</span>
                    </div>

                    <span className="font-bold text-slate-900">
                        LearnBridge
                    </span>
                </Link>

                <button className="rounded-lg p-2 hover:bg-slate-100">
                    <X className="h-5 w-5" />
                </button>
            </header>

            {/* Main content */}
            <main className="lg:ml-64">
                {children}
            </main>
        </div>
    );
}