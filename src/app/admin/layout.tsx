"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    UserCheck,
    Users,
    BookOpen,
    CalendarDays,
    LogOut,
    ShieldAlert,
    Menu,
    X,
    Bell,
    ChevronRight,
    ChevronDown,
    User,
} from "lucide-react";
import AdminFooter from "@/components/admin/AdminFooter";

const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Tutor Approvals", href: "/admin/tutors", icon: UserCheck },
    { name: "User Directory", href: "/admin/users", icon: Users },
    { name: "Subject Catalog", href: "/admin/subjects", icon: BookOpen },
    { name: "Bookings Audit", href: "/admin/bookings", icon: CalendarDays },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();

    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut({ callbackUrl: "/login" });
        } catch {
            window.location.href = "/login";
        }
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const currentRoute = navItems.find(
        (item) =>
            item.href === pathname ||
            (item.href !== "/admin" && pathname.startsWith(item.href))
    );

    return (
        <div className="flex min-h-screen flex-col bg-[#e5e9ee] font-sans text-slate-800">
            {/* Sidebar Backdrop Overlay */}
            {isSidebarOpen && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={closeSidebar}
                    className="fixed inset-0 z-40 cursor-default bg-slate-900/50 backdrop-blur-xs transition-opacity"
                />
            )}

            {/* Slide-in Drawer Navigation */}
            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col justify-between border-r border-slate-200 bg-white p-5 text-slate-700 shadow-2xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="space-y-6">
                    {/* Brand Header */}
                    <div className="flex items-center justify-between">
                        <Link
                            href="/admin"
                            onClick={closeSidebar}
                            className="flex items-center gap-3 px-1 pt-1"
                        >
                            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white shadow-xs">
                                <img
                                    src="/learnbridge.png"
                                    alt="LearnBridge"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <div>
                                <span className="font-bold text-base text-slate-800 tracking-tight block">
                                    LearnBridge
                                </span>
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-rose-600 block -mt-1">
                                    Admin Console
                                </span>
                            </div>
                        </Link>

                        <button
                            type="button"
                            onClick={closeSidebar}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            aria-label="Close navigation menu"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Admin Access Pill */}
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                            <ShieldAlert className="h-4 w-4 text-rose-600" />
                            Admin Access Active
                        </div>
                        <p className="text-[11px] text-rose-700/80 leading-snug">
                            Full system privileges active. Auditing registrations & educator credentials.
                        </p>
                    </div>

                    {/* Navigation Items */}
                    <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            System Administration
                        </div>

                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active =
                                pathname === item.href ||
                                (item.href !== "/admin" && pathname.startsWith(item.href));

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={closeSidebar}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition group ${active
                                        ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                                        }`}
                                >
                                    <Icon
                                        className={`h-4 w-4 transition-colors ${active ? "text-white" : "text-slate-500 group-hover:text-blue-600"
                                            }`}
                                    />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Drawer Sign Out */}
                <div className="pt-4 border-t border-slate-100">
                    <button
                        onClick={() => {
                            closeSidebar();
                            handleSignOut();
                        }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Top Header Navbar */}
            <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-[#f7f8fa] px-4 sm:px-6 shadow-sm">
                <div className="flex items-center gap-3">
                    {/* Hamburger Button */}
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(true)}
                        aria-label="Open navigation menu"
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    {/* Logo */}
                    <Link
                        href="/admin"
                        className="flex items-center gap-2"
                        onClick={closeSidebar}
                    >
                        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white shadow-xs">
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
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-rose-600">
                                Admin Console
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Right Utilities */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Breadcrumb */}
                    <div className="hidden items-center gap-2 text-sm text-slate-500 md:flex">
                        <span>Admin</span>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-700">
                            {currentRoute?.name ?? "Dashboard"}
                        </span>
                    </div>

                    {/* Notification Bell */}
                    <Link
                        href="/admin/tutors"
                        aria-label="Notifications"
                        className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
                        title="Pending Verification Approvals"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-600 ring-2 ring-[#f7f8fa]" />
                    </Link>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-100"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-700">
                                <User className="h-4 w-4" />
                            </div>

                            <div className="hidden text-left lg:block">
                                <p className="max-w-[140px] truncate text-xs font-semibold text-slate-700">
                                    {session?.user?.name || "Administrator"}
                                </p>
                                <p className="text-[10px] text-slate-500 font-medium">
                                    Platform Admin
                                </p>
                            </div>

                            <ChevronDown className="hidden h-4 w-4 text-slate-400 lg:block" />
                        </button>

                        {isProfileMenuOpen && (
                            <>
                                <button
                                    type="button"
                                    aria-label="Close profile menu"
                                    onClick={() => setIsProfileMenuOpen(false)}
                                    className="fixed inset-0 z-40 cursor-default"
                                />

                                <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                                    <div className="border-b border-slate-100 px-4 py-3">
                                        <p className="truncate text-sm font-semibold text-slate-800">
                                            {session?.user?.name || "Administrator"}
                                        </p>
                                        <p className="truncate text-xs text-slate-500">
                                            {session?.user?.email || "admin@learnbridge.com"}
                                        </p>
                                    </div>

                                    <div className="p-2">
                                        <button
                                            onClick={() => {
                                                setIsProfileMenuOpen(false);
                                                handleSignOut();
                                            }}
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 flex flex-col min-h-[calc(100vh-64px)]">
                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </div>

                {/* Light Theme Admin Footer */}
                <AdminFooter />
            </main>
        </div>
    );
}


