"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
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
} from "lucide-react";
import AdminFooter from "@/components/admin/AdminFooter";

const navItems = [
    { name: "Overview Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Tutor Approvals", href: "/admin/tutors", icon: UserCheck },
    { name: "User Directory", href: "/admin/users", icon: Users },
    { name: "Subject Catalog", href: "/admin/subjects", icon: BookOpen },
    { name: "Bookings Audit", href: "/admin/bookings", icon: CalendarDays },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut({ callbackUrl: "/login" });
        } catch {
            window.location.href = "/login";
        }
    };

    const currentRoute = navItems.find(
        (item) =>
            item.href === pathname ||
            (item.href !== "/admin" && pathname.startsWith(item.href))
    );

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col font-sans text-slate-100">
            {/* Desktop Sidebar Navigation */}
            <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 bg-slate-950 text-slate-300 md:flex flex-col justify-between p-5 border-r border-slate-800 shrink-0">
                <div className="space-y-6">
                    {/* Brand */}
                    <Link href="/admin" className="flex items-center gap-3 px-2 pt-1">
                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-rose-600 to-amber-600 flex items-center justify-center font-black text-white text-xl shadow-md shadow-rose-600/30">
                            A
                        </div>
                        <div>
                            <span className="font-black text-base text-white tracking-tight block">
                                LearnBridge
                            </span>
                            <span className="text-[10px] uppercase tracking-wider font-extrabold text-rose-400 block -mt-1">
                                Admin Console
                            </span>
                        </div>
                    </Link>

                    {/* Admin Guard Pill */}
                    <div className="rounded-2xl border border-rose-500/30 bg-rose-950/40 p-3.5 space-y-1">
                        <div className="flex items-center gap-2 text-xs font-extrabold text-rose-300">
                            <ShieldAlert className="h-4 w-4 text-rose-400" />
                            Admin Access Granted
                        </div>
                        <p className="text-[10px] text-slate-400 leading-snug">
                            Full system privileges active. Auditing user registrations & tutor credentials.
                        </p>
                    </div>

                    {/* Navigation Items */}
                    <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                        <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
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
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition group ${active
                                        ? "bg-rose-600 text-white shadow-sm shadow-rose-600/40"
                                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                                        }`}
                                >
                                    <Icon
                                        className={`h-4 w-4 transition-colors ${active ? "text-white" : "text-slate-400 group-hover:text-rose-400"
                                            }`}
                                    />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Desktop Sign Out */}
                <div className="pt-4 border-t border-slate-800">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/60 hover:text-rose-300 transition"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile & Desktop Top Header Navbar */}
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/95 backdrop-blur px-4 sm:px-6 md:ml-64 shadow-xs">
                <div className="flex items-center gap-3">
                    {/* Sandwich / Hamburger Toggle Button (Mobile) */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="rounded-xl p-2 text-slate-300 hover:bg-slate-900 md:hidden focus:outline-hidden"
                        aria-label="Toggle Admin Sandwich Menu"
                    >
                        {mobileOpen ? (
                            <X className="h-6 w-6 text-white" />
                        ) : (
                            <Menu className="h-6 w-6 text-white" />
                        )}
                    </button>

                    {/* Logo (Mobile view) */}
                    <Link href="/admin" className="flex items-center gap-2 md:hidden">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 text-white font-bold text-sm">
                            A
                        </div>
                        <span className="font-bold text-white text-base tracking-tight">
                            LearnBridge <span className="text-xs text-rose-400 font-semibold">Admin</span>
                        </span>
                    </Link>

                    {/* Active Section Breadcrumb (Desktop view) */}
                    <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
                        <span>Admin Console</span>
                        <ChevronRight className="h-4 w-4 text-slate-600" />
                        <span className="font-semibold text-white">
                            {currentRoute?.name || "Overview Dashboard"}
                        </span>
                    </div>
                </div>

                {/* Right Utilities (System Alerts, Profile, Logout) */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/tutors"
                        className="relative rounded-xl p-2 text-slate-400 hover:bg-slate-900 transition"
                        title="Pending Verification Approvals"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-slate-950"></span>
                    </Link>

                    <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

                    <div className="flex items-center gap-2.5 rounded-xl p-1.5 bg-slate-900 border border-slate-800">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-950 text-rose-300 font-extrabold text-xs border border-rose-800">
                            AD
                        </div>
                        <span className="hidden sm:block text-xs font-semibold text-slate-200 pr-1">
                            Administrator
                        </span>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="hidden sm:flex items-center gap-1.5 rounded-xl border border-rose-900/60 bg-rose-950/30 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-900/60 transition"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                    </button>
                </div>
            </header>

            {/* Sandwich Mobile Drawer Navigation */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
                        onClick={() => setMobileOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="relative flex w-full max-w-xs flex-col bg-slate-950 p-6 shadow-2xl z-10 text-slate-300 border-r border-slate-800">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <Link
                                href="/admin"
                                className="flex items-center gap-3"
                                onClick={() => setMobileOpen(false)}
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-600 to-amber-600 text-white font-bold">
                                    A
                                </div>
                                <div>
                                    <h2 className="font-bold text-white tracking-tight">LearnBridge</h2>
                                    <p className="text-xs text-rose-400 font-bold uppercase tracking-wider">
                                        Admin Console
                                    </p>
                                </div>
                            </Link>

                            <button
                                onClick={() => setMobileOpen(false)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex-1 overflow-y-auto py-6 space-y-1">
                            <p className="px-3 mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                                System Menu
                            </p>
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active =
                                    pathname === item.href ||
                                    (item.href !== "/admin" && pathname.startsWith(item.href));

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${active
                                            ? "bg-rose-600 text-white"
                                            : "text-slate-400 hover:bg-slate-900 hover:text-white"
                                            }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Mobile Drawer Sign Out */}
                        <div className="border-t border-slate-800 pt-4">
                            <button
                                onClick={() => {
                                    setMobileOpen(false);
                                    handleSignOut();
                                }}
                                className="flex w-full items-center gap-3 rounded-xl bg-rose-950/60 px-4 py-3 text-sm font-bold text-rose-300 hover:bg-rose-900 transition"
                            >
                                <LogOut className="h-5 w-5 text-rose-400" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 bg-slate-900 md:ml-64 flex flex-col min-h-[calc(100vh-64px)]">
                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </div>

                {/* Useful Admin Footer */}
                <AdminFooter />
            </main>
        </div>
    );
}
