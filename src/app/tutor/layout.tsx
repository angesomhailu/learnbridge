"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/router";
import { useState } from "react";
import {
    LayoutDashboard,
    ClipboardList,
    CalendarDays,
    MessageSquare,
    Clock,
    DollarSign,
    BookOpen,
    GraduationCap,
    FileCheck,
    User,
    LogOut,
    ShieldCheck,
    Menu,
    X,
    Sparkles,
    CheckCircle2,
} from "lucide-react";

const navItems = [
    { name: "Overview Hub", href: "/tutor", icon: LayoutDashboard },
    { name: "Student Requests", href: "/tutor/requests", icon: ClipboardList },
    { name: "Sessions & Bookings", href: "/tutor/bookings", icon: CalendarDays },
    { name: "Messages", href: "/tutor/messages", icon: MessageSquare },
    { name: "Teaching Availability", href: "/tutor/availability", icon: Clock },
    { name: "Pricing & Rates", href: "/tutor/pricing", icon: DollarSign },
    { name: "Subjects Competency", href: "/tutor/subjects", icon: BookOpen },
    { name: "Academic Education", href: "/tutor/education", icon: GraduationCap },
    { name: "Verification Docs", href: "/tutor/documents", icon: FileCheck },
    { name: "Profile Settings", href: "/tutor/profile", icon: User },
];

export default function TutorLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    async function handleSignOut() {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
            {/* Top Bar for Mobile */}
            <header className="md:hidden bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between sticky top-0 z-40 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-sm">
                        L
                    </div>
                    <span className="font-extrabold text-sm tracking-tight text-white">
                        LearnBridge <span className="text-emerald-400 font-normal text-xs ml-1">Tutor</span>
                    </span>
                </div>

                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    aria-label="Toggle Navigation Menu"
                >
                    {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </header>

            {/* Sidebar Navigation */}
            <aside
                className={`fixed md:sticky top-0 left-0 z-30 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-5 transition-transform duration-300 border-r border-slate-800/80 shrink-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    }`}
            >
                <div className="space-y-6">
                    {/* Brand */}
                    <div className="flex items-center gap-3 px-2 pt-1">
                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center font-black text-white text-xl shadow-md">
                            L
                        </div>
                        <div>
                            <span className="font-black text-base text-white tracking-tight block">LearnBridge</span>
                            <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400 block -mt-1">
                                Educator Portal
                            </span>
                        </div>
                    </div>

                    {/* Verification Status Pill */}
                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 space-y-1">
                        <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-300">
                            <ShieldCheck className="h-4 w-4 text-emerald-400" />
                            Verified Educator
                        </div>
                        <p className="text-[10px] text-slate-400 leading-snug">
                            Your credentials & identity documents are active. Ready to accept student requests.
                        </p>
                    </div>

                    {/* Navigation Items */}
                    <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-800 hover:text-white transition text-slate-400 group"
                                >
                                    <Icon className="h-4 w-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer / Sign Out */}
                <div className="pt-4 border-t border-slate-800/80 space-y-2">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0 bg-slate-50 min-h-screen">
                {children}
            </div>
        </div>
    );
}
