"use client";

import Link from "next/link";
import {
    ShieldAlert,
    Activity,
    Lock,
    Server,
    FileCheck,
    Terminal,
} from "lucide-react";

export default function AdminFooter() {
    return (
        <footer className="mt-16 border-t border-slate-800 bg-slate-950 text-slate-400 pt-12 pb-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link href="/admin" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-600 to-amber-600 font-black text-white text-lg shadow-md shadow-rose-600/30">
                                A
                            </div>
                            <div>
                                <span className="text-xl font-extrabold text-white tracking-tight block">
                                    LearnBridge
                                </span>
                                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                                    Admin Console
                                </span>
                            </div>
                        </Link>

                        <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
                            Centralized platform management, educator credential verification, role-based access enforcement, user moderation, and real-time system metrics.
                        </p>

                        <div className="flex items-center gap-2 pt-2">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-semibold text-slate-300">
                                System Health: All Services Operational (100%)
                            </span>
                        </div>
                    </div>

                    {/* Console Links */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                            Console Navigation
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link href="/admin" className="hover:text-rose-400 transition-colors">
                                    Overview Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/tutors" className="hover:text-rose-400 transition-colors">
                                    Tutor Approvals
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/users" className="hover:text-rose-400 transition-colors">
                                    User Directory
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/subjects" className="hover:text-rose-400 transition-colors">
                                    Subject Catalog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Security & Audit */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                            Security & Auditing
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <li className="flex items-center gap-2 text-slate-400">
                                <Lock className="h-3.5 w-3.5 text-rose-400" />
                                <span>RBAC Enforcement Active</span>
                            </li>
                            <li className="flex items-center gap-2 text-slate-400">
                                <FileCheck className="h-3.5 w-3.5 text-emerald-400" />
                                <span>Audit Log Compliance</span>
                            </li>
                            <li className="flex items-center gap-2 text-slate-400">
                                <Server className="h-3.5 w-3.5 text-amber-400" />
                                <span>PostgreSQL Database Pool</span>
                            </li>
                        </ul>
                    </div>

                    {/* Admin Status Notice */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                            System Security Notice
                        </h3>
                        <div className="rounded-2xl bg-rose-950/40 p-4 border border-rose-900/40 space-y-2 text-xs mb-4">
                            <div className="flex items-center gap-2 text-rose-300 font-bold">
                                <ShieldAlert className="h-4 w-4 text-rose-400" />
                                <span>Admin Session Monitored</span>
                            </div>
                            <p className="text-slate-400 leading-normal">
                                All administrative actions, verification status changes, and user role updates are audited and recorded for platform security.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <p>
                        &copy; {new Date().getFullYear()} LearnBridge Platform. Admin Console v2.0.
                    </p>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1.5 text-slate-400 font-mono">
                            <Terminal className="h-3.5 w-3.5 text-rose-400" />
                            Admin ID: admin@learnbridge.com
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
