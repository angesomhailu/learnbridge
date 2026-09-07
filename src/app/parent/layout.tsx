"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard,
    Users,
    ClipboardList,
    CalendarDays,
    MessageSquare,
    Star,
    Settings,
    LogOut,
    Menu,
    X,
    Shield,
    Bell,
    ChevronRight,
} from "lucide-react";
import ParentFooter from "@/components/parent/ParentFooter";

const menuItems = [
    { name: "Parent Dashboard", href: "/parent", icon: LayoutDashboard },
    { name: "My Children", href: "/parent/children", icon: Users },
    { name: "Tutor Requests", href: "/parent/requests", icon: ClipboardList },
    { name: "Family Bookings", href: "/parent/bookings", icon: CalendarDays },
    { name: "Messages", href: "/parent/messages", icon: MessageSquare },
    { name: "Session Reviews", href: "/parent/reviews", icon: Star },
    { name: "Parent Settings", href: "/parent/settings", icon: Settings },
];

export default function ParentLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut({ callbackUrl: "/login" });
        } catch {
            window.location.href = "/login";
        }
    };

    const currentRoute = menuItems.find(
        (item) =>
            item.href === pathname ||
            (item.href !== "/parent" && pathname.startsWith(item.href))
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            {/* Desktop Sidebar Navigation */}
            <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 bg-slate-900 text-slate-300 md:flex flex-col justify-between p-5 border-r border-slate-800/80 shrink-0">
                <div className="space-y-6">
                    {/* Brand */}
                    <Link href="/parent" className="flex items-center gap-3 px-2 pt-1">
                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-xl shadow-md">
                            L
                        </div>
                        <div>
                            <span className="font-black text-base text-white tracking-tight block">
                                LearnBridge
                            </span>
                            <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-400 block -mt-1">
                                Parent Hub
                            </span>
                        </div>
                    </Link>

                    {/* Safety Status Pill */}
                    <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-3.5 space-y-1">
                        <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-300">
                            <Shield className="h-4 w-4 text-emerald-400" />
                            Parental Guard Active
                        </div>
                        <p className="text-[10px] text-slate-400 leading-snug">
                            Minor safety controls enforced. Managing children's learning & bookings.
                        </p>
                    </div>

                    {/* Navigation Items */}
                    <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                        <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Management & Family
                        </div>

                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active =
                                pathname === item.href ||
                                (item.href !== "/parent" && pathname.startsWith(item.href));

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition group ${active
                                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                        }`}
                                >
                                    <Icon
                                        className={`h-4 w-4 transition-colors ${active ? "text-white" : "text-slate-400 group-hover:text-indigo-400"
                                            }`}
                                    />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Desktop Sign Out */}
                <div className="pt-4 border-t border-slate-800/80">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile & Desktop Top Header Navbar */}
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur px-4 sm:px-6 md:ml-64 shadow-xs">
                <div className="flex items-center gap-3">
                    {/* Sandwich / Hamburger Toggle Button (Mobile) */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 md:hidden focus:outline-hidden"
                        aria-label="Toggle Navigation Sandwich Menu"
                    >
                        {mobileOpen ? (
                            <X className="h-6 w-6 text-slate-900" />
                        ) : (
                            <Menu className="h-6 w-6 text-slate-900" />
                        )}
                    </button>

                    {/* Logo (Mobile view) */}
                    <Link href="/parent" className="flex items-center gap-2 md:hidden">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm">
                            L
                        </div>
                        <span className="font-bold text-slate-900 text-base tracking-tight">
                            LearnBridge <span className="text-xs text-indigo-600 font-semibold">Parent Hub</span>
                        </span>
                    </Link>

                    {/* Active Section Breadcrumb (Desktop view) */}
                    <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
                        <span>Parent Hub</span>
                        <ChevronRight className="h-4 w-4 text-slate-300" />
                        <span className="font-semibold text-slate-900">
                            {currentRoute?.name || "Parent Dashboard"}
                        </span>
                    </div>
                </div>

                {/* Right Utilities (Notifications, Profile, Logout) */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/parent/messages"
                        className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100 transition"
                        title="Tutor Messages & Notifications"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>
                    </Link>

                    <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

                    <Link
                        href="/parent/settings"
                        className="flex items-center gap-2.5 rounded-xl p-1.5 hover:bg-slate-50 transition"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs">
                            PA
                        </div>
                        <span className="hidden sm:block text-xs font-semibold text-slate-800">
                            Parent Account
                        </span>
                    </Link>

                    <button
                        onClick={handleSignOut}
                        className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition"
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
                        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
                        onClick={() => setMobileOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="relative flex w-full max-w-xs flex-col bg-slate-900 p-6 shadow-2xl z-10 text-slate-300">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <Link
                                href="/parent"
                                className="flex items-center gap-3"
                                onClick={() => setMobileOpen(false)}
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold">
                                    L
                                </div>
                                <div>
                                    <h2 className="font-bold text-white tracking-tight">LearnBridge</h2>
                                    <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                                        Parent Hub
                                    </p>
                                </div>
                            </Link>

                            <button
                                onClick={() => setMobileOpen(false)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex-1 overflow-y-auto py-6 space-y-1">
                            <p className="px-3 mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                                Parent Menu
                            </p>
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const active =
                                    pathname === item.href ||
                                    (item.href !== "/parent" && pathname.startsWith(item.href));

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${active
                                            ? "bg-indigo-600 text-white"
                                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
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
                                className="flex w-full items-center gap-3 rounded-xl bg-rose-950/40 px-4 py-3 text-sm font-bold text-rose-300 hover:bg-rose-900/60 transition"
                            >
                                <LogOut className="h-5 w-5 text-rose-400" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 bg-slate-50 md:ml-64 flex flex-col min-h-[calc(100vh-64px)]">
                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </div>

                {/* Useful Parent Footer */}
                <ParentFooter />
            </main>
        </div>
    );
}
