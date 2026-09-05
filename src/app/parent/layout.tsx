"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
} from "lucide-react";

interface ParentLayoutProps {
    children: React.ReactNode;
}

const menuItems = [
    {
        name: "Dashboard",
        href: "/parent",
        icon: LayoutDashboard,
    },
    {
        name: "My Children",
        href: "/parent/children",
        icon: Users,
    },
    {
        name: "Tutor Requests",
        href: "/parent/requests",
        icon: ClipboardList,
    },
    {
        name: "Family Bookings",
        href: "/parent/bookings",
        icon: CalendarDays,
    },
    {
        name: "Messages",
        href: "/parent/messages",
        icon: MessageSquare,
    },
    {
        name: "Session Reviews",
        href: "/parent/reviews",
        icon: Star,
    },
];

const accountItems = [
    {
        name: "Parent Settings",
        href: "/parent/settings",
        icon: Settings,
    },
];

export default function ParentLayout({ children }: ParentLayoutProps) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
            {/* Mobile Header Bar */}
            <header className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
                <Link href="/parent" className="flex items-center gap-2.5">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600">
                        <Image
                            src="/learnbridge.png"
                            alt="LearnBridge Logo"
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div>
                        <span className="block font-bold text-sm text-slate-900 leading-tight">LearnBridge</span>
                        <span className="block text-[9px] font-semibold uppercase text-purple-600 tracking-wider">Parent Hub</span>
                    </div>
                </Link>

                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </header>

            {/* Sidebar Desktop */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out md:static md:translate-x-0 flex flex-col justify-between ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div>
                    {/* Brand */}
                    <div className="p-6 border-b border-slate-800">
                        <Link href="/parent" className="flex items-center gap-3">
                            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md">
                                <Image
                                    src="/learnbridge.png"
                                    alt="LearnBridge Logo"
                                    width={36}
                                    height={36}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div>
                                <span className="block font-extrabold text-base tracking-tight text-white">
                                    LearnBridge
                                </span>
                                <span className="block text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                                    Parent Portal
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Main Navigation */}
                    <nav className="p-4 space-y-1">
                        <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Management
                        </div>

                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive =
                                item.href === "/parent"
                                    ? pathname === "/parent"
                                    : pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive
                                            ? "bg-indigo-600 text-white shadow-sm"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                                        }`}
                                >
                                    <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                                    {item.name}
                                </Link>
                            );
                        })}

                        <div className="pt-4 px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Account & Safety
                        </div>

                        {accountItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive
                                            ? "bg-indigo-600 text-white shadow-sm"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                                        }`}
                                >
                                    <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer Safety Tag & Signout */}
                <div className="p-4 border-t border-slate-800 space-y-3">
                    <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700/50 flex items-center gap-2.5">
                        <Shield className="h-4 w-4 text-emerald-400 shrink-0" />
                        <div className="text-[11px] leading-tight text-slate-300">
                            <span className="font-bold text-white block">Parental Guard Active</span>
                            Minor safety controls enforced
                        </div>
                    </div>

                    <Link
                        href="/api/auth/signout"
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors w-full"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Backdrop for Mobile */}
            {mobileMenuOpen && (
                <div
                    onClick={() => setMobileMenuOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs md:hidden"
                />
            )}

            {/* Main Content Body */}
            <div className="flex-1 overflow-y-auto min-h-screen">
                {children}
            </div>
        </div>
    );
}
