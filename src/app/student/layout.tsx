"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
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
    const { data: session } = useSession();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    const currentRoute = [...menuItems, ...accountItems].find(
        (item) =>
            item.href === pathname ||
            (item.href !== "/student" &&
                pathname.startsWith(item.href))
    );

    return (
        <div className="min-h-screen bg-[#e5e9ee] text-slate-800 flex flex-col font-sans">
            {/* =========================================================
                TOP APPLICATION BAR
            ========================================================= */}
            <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-[#f7f8fa] px-4 shadow-sm sm:px-6">
                <div className="flex items-center gap-3">
                    {/* SANDWICH BUTTON */}
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(true)}
                        aria-label="Open navigation menu"
                        aria-expanded={isSidebarOpen}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    {/* LOGO */}
                    <Link
                        href="/student"
                        className="flex items-center gap-2"
                        onClick={closeSidebar}
                    >
                        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white">
                            <img
                                src="/learnbridge.png"
                                alt="LearnBridge"
                                className="h-full w-full object-contain"
                            />
                        </div>

                        <div className="hidden sm:block">
                            <p className="text-sm font-bold text-slate-800">
                                LearnBridge
                            </p>
                            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                                Student Portal
                            </p>
                        </div>
                    </Link>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Breadcrumb / Current Page */}
                    <div className="hidden items-center gap-2 text-sm text-slate-500 md:flex">
                        <span>Student</span>

                        <ChevronRight className="h-4 w-4 text-slate-400" />

                        <span className="font-medium text-slate-700">
                            {currentRoute?.name ?? "Dashboard"}
                        </span>
                    </div>

                    {/* Notification */}
                    <button
                        type="button"
                        aria-label="Notifications"
                        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
                    >
                        <Bell className="h-5 w-5" />

                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-[#f7f8fa]" />
                    </button>

                    {/* Profile */}
                    <Link
                        href="/student/profile"
                        className="hidden items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-100 sm:flex"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                            <User className="h-4 w-4" />
                        </div>

                        <div className="hidden lg:block">
                            <p className="max-w-[140px] truncate text-xs font-semibold text-slate-700">
                                {session?.user?.name || "Student"}
                            </p>

                            <p className="text-[10px] text-slate-500">
                                Student
                            </p>
                        </div>
                    </Link>
                </div>
            </header>

            {/* =========================================================
                DARK OVERLAY
            ========================================================= */}
            {isSidebarOpen && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={closeSidebar}
                    className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[1px]"
                />
            )}

            {/* =========================================================
                SLIDE-IN SIDEBAR
            ========================================================= */}
            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-slate-200 bg-[#f7f8fa] shadow-2xl transition-transform duration-300 ease-in-out ${isSidebarOpen
                    ? "translate-x-0"
                    : "-translate-x-full"
                    }`}
            >
                {/* Sidebar Header */}
                <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
                    <Link
                        href="/student"
                        onClick={closeSidebar}
                        className="flex items-center gap-3"
                    >
                        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white">
                            <img
                                src="/learnbridge.png"
                                alt="LearnBridge"
                                className="h-full w-full object-contain"
                            />
                        </div>

                        <div>
                            <p className="text-sm font-bold text-slate-800">
                                LearnBridge
                            </p>

                            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                                Student Portal
                            </p>
                        </div>
                    </Link>

                    {/* CLOSE BUTTON */}
                    <button
                        type="button"
                        onClick={closeSidebar}
                        aria-label="Close navigation menu"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-3 py-5">
                    {/* MAIN MENU */}
                    <div>
                        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Learning
                        </p>

                        <nav className="space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;

                                const isActive =
                                    item.href === "/student"
                                        ? pathname === "/student"
                                        : pathname.startsWith(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={closeSidebar}
                                        className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                                            }`}
                                    >
                                        <Icon
                                            className={`h-4.5 w-4.5 shrink-0 ${isActive
                                                ? "text-white"
                                                : "text-slate-500 group-hover:text-blue-600"
                                                }`}
                                        />

                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* ACCOUNT */}
                    <div className="mt-7">
                        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Account
                        </p>

                        <nav className="space-y-1">
                            {accountItems.map((item) => {
                                const Icon = item.icon;

                                const isActive =
                                    pathname === item.href ||
                                    pathname.startsWith(
                                        `${item.href}/`
                                    );

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={closeSidebar}
                                        className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                                            }`}
                                    >
                                        <Icon
                                            className={`h-4.5 w-4.5 shrink-0 ${isActive
                                                ? "text-white"
                                                : "text-slate-500 group-hover:text-blue-600"
                                                }`}
                                        />

                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Sidebar Footer */}
                <div className="border-t border-slate-200 p-3">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut className="h-4.5 w-4.5" />

                        <span>Sign Out</span>
                    </button>
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