"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ClipboardList,
    CalendarDays,
    MessageSquare,
    BookOpen,
    Clock,
    DollarSign,
    GraduationCap,
    FileText,
    User,
    Settings,
    LogOut,
    Menu,
    ChevronDown,
    X,
    Bell,
    ChevronRight,
} from "lucide-react";

import TutorFooter from "@/components/tutor/TutorFooter";

interface TutorLayoutProps {
    children: React.ReactNode;
}

const teachingItems = [
    {
        name: "Dashboard",
        href: "/tutor",
        icon: LayoutDashboard,
    },
    {
        name: "Tutor Requests",
        href: "/tutor/requests",
        icon: ClipboardList,
    },
    {
        name: "My Bookings",
        href: "/tutor/bookings",
        icon: CalendarDays,
    },
    {
        name: "Messages",
        href: "/tutor/messages",
        icon: MessageSquare,
    },
    {
        name: "Subjects",
        href: "/tutor/subjects",
        icon: BookOpen,
    },
    {
        name: "Availability",
        href: "/tutor/availability",
        icon: Clock,
    },
    {
        name: "Pricing",
        href: "/tutor/pricing",
        icon: DollarSign,
    },
];

const credentialItems = [
    {
        name: "Education",
        href: "/tutor/education",
        icon: GraduationCap,
    },
    {
        name: "Documents",
        href: "/tutor/documents",
        icon: FileText,
    },
];

const accountItems = [
    {
        name: "Profile",
        href: "/tutor/profile",
        icon: User,
    },
    {
        name: "Settings",
        href: "/tutor/settings",
        icon: Settings,
    },
];

export default function TutorLayout({
    children,
}: TutorLayoutProps) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isProfileMenuOpen, setIsProfileMenuOpen] =
        useState(false);
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

    const allItems = [
        ...teachingItems,
        ...credentialItems,
        ...accountItems,
    ];

    const currentRoute = allItems.find(
        (item) =>
            item.href === pathname ||
            (item.href !== "/tutor" &&
                pathname.startsWith(item.href))
    );

    const renderNavigation = (
        items:
            | typeof teachingItems
            | typeof credentialItems
            | typeof accountItems
    ) => {
        return (
            <nav className="space-y-1">
                {items.map((item) => {
                    const Icon = item.icon;

                    const isActive =
                        item.href === "/tutor"
                            ? pathname === "/tutor"
                            : pathname === item.href ||
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
                                className={`h-[18px] w-[18px] shrink-0 ${isActive
                                    ? "text-white"
                                    : "text-slate-500 group-hover:text-blue-600"
                                    }`}
                            />

                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        );
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#e5e9ee] font-sans text-slate-800">
            {/* TOP BAR */}
            <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-[#f7f8fa] px-4 shadow-sm sm:px-6">
                <div className="flex items-center gap-3">
                    {/* MENU BUTTON */}
                    <button
                        type="button"
                        onClick={() =>
                            setIsSidebarOpen(true)
                        }
                        aria-label="Open navigation menu"
                        aria-expanded={isSidebarOpen}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    {/* LOGO */}
                    <Link
                        href="/tutor"
                        onClick={closeSidebar}
                        className="flex items-center gap-2"
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
                                Tutor Portal
                            </p>
                        </div>
                    </Link>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="hidden items-center gap-2 text-sm text-slate-500 md:flex">
                        <span>Tutor</span>

                        <ChevronRight className="h-4 w-4 text-slate-400" />

                        <span className="font-medium text-slate-700">
                            {currentRoute?.name ??
                                "Dashboard"}
                        </span>
                    </div>

                    {/* NOTIFICATIONS */}
                    <button
                        type="button"
                        aria-label="Notifications"
                        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
                    >
                        <Bell className="h-5 w-5" />

                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-[#f7f8fa]" />
                    </button>
                    {/* USER */}
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
                            className="hidden cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-100 sm:flex"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                <User className="h-4 w-4" />
                            </div>

                            <div className="hidden text-left lg:block">
                                <p className="max-w-[140px] truncate text-xs font-semibold text-slate-700">
                                    {session?.user?.name ||
                                        "Tutor"}
                                </p>

                                <p className="text-[10px] text-slate-500">
                                    Tutor
                                </p>
                            </div>

                            <ChevronDown className="hidden h-4 w-4 text-slate-400 lg:block" />
                        </button>

                        {isProfileMenuOpen && (
                            <>
                                {/* DROPDOWN OVERLAY */}
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

                                {/* DROPDOWN */}
                                <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                                    {/* USER INFORMATION */}
                                    <div className="border-b border-slate-100 px-4 py-3">
                                        <p className="truncate text-sm font-semibold text-slate-800">
                                            {session?.user?.name ||
                                                "Tutor"}
                                        </p>

                                        <p className="truncate text-xs text-slate-500">
                                            {session?.user?.email ||
                                                ""}
                                        </p>
                                    </div>

                                    <div className="p-2">
                                        {/* PROFILE */}
                                        <Link
                                            href="/tutor/profile"
                                            onClick={() =>
                                                setIsProfileMenuOpen(
                                                    false
                                                )
                                            }
                                            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
                                        >
                                            <User className="h-4 w-4" />

                                            <span>
                                                Profile
                                            </span>
                                        </Link>

                                        {/* SETTINGS */}
                                        <Link
                                            href="/tutor/settings"
                                            onClick={() =>
                                                setIsProfileMenuOpen(
                                                    false
                                                )
                                            }
                                            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
                                        >
                                            <Settings className="h-4 w-4" />

                                            <span>
                                                Settings
                                            </span>
                                        </Link>

                                        <div className="my-2 border-t border-slate-100" />

                                        {/* SIGN OUT */}
                                        <button
                                            type="button"
                                            onClick={
                                                handleLogout
                                            }
                                            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
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

            {/* OVERLAY */}
            {isSidebarOpen && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={closeSidebar}
                    className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[1px]"
                />
            )}

            {/* SLIDE-IN SIDEBAR */}
            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-slate-200 bg-[#f7f8fa] shadow-2xl transition-transform duration-300 ease-in-out ${isSidebarOpen
                    ? "translate-x-0"
                    : "-translate-x-full"
                    }`}
            >
                {/* SIDEBAR HEADER */}
                <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
                    <Link
                        href="/tutor"
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
                                Tutor Portal
                            </p>
                        </div>
                    </Link>

                    <button
                        type="button"
                        onClick={closeSidebar}
                        aria-label="Close navigation menu"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* NAVIGATION */}
                <div className="flex-1 overflow-y-auto px-3 py-5">
                    {/* TEACHING */}
                    <div>
                        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Teaching
                        </p>

                        {renderNavigation(
                            teachingItems
                        )}
                    </div>

                    {/* CREDENTIALS */}
                    <div className="mt-7">
                        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Credentials
                        </p>

                        {renderNavigation(
                            credentialItems
                        )}
                    </div>
                </div>
            </aside>

            {/* CONTENT */}
            <main className="flex min-w-0 flex-1 flex-col">
                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </div>

                <TutorFooter />
            </main>
        </div>
    );
}