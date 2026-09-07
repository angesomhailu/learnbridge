"use client";

import Link from "next/link";
import {
    Shield,
    Bell,
    Users,
    Heart,
    Lock,
    HelpCircle,
    CheckCircle2,
} from "lucide-react";

export default function ParentFooter() {
    return (
        <footer className="mt-16 border-t border-slate-200 bg-white pt-12 pb-8 text-slate-600">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link href="/parent" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-extrabold text-white text-lg shadow-md shadow-indigo-500/20">
                                L
                            </div>
                            <div>
                                <span className="text-xl font-extrabold text-slate-900 tracking-tight block">
                                    LearnBridge
                                </span>
                                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                                    Parent Hub
                                </span>
                            </div>
                        </Link>

                        <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
                            Empowering parents to manage their children's profiles, request certified tutor matches, track family learning schedules, and receive instant SMS & email updates.
                        </p>

                        <div className="flex items-center gap-2 pt-2">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-semibold text-slate-700">
                                Parental Guard & Protection Active
                            </span>
                        </div>
                    </div>

                    {/* Quick Parent Navigation */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
                            Parent Hub Pages
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link href="/parent" className="hover:text-indigo-600 transition-colors">
                                    Parent Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/parent/children" className="hover:text-indigo-600 transition-colors">
                                    My Children
                                </Link>
                            </li>
                            <li>
                                <Link href="/parent/requests" className="hover:text-indigo-600 transition-colors">
                                    Tutor Requests
                                </Link>
                            </li>
                            <li>
                                <Link href="/parent/bookings" className="hover:text-indigo-600 transition-colors">
                                    Family Bookings
                                </Link>
                            </li>
                            <li>
                                <Link href="/parent/messages" className="hover:text-indigo-600 transition-colors">
                                    Messages
                                </Link>
                            </li>
                            <li>
                                <Link href="/parent/reviews" className="hover:text-indigo-600 transition-colors">
                                    Session Reviews
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Parent Controls & Safety */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
                            Safety & Controls
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link href="/parent/settings" className="hover:text-indigo-600 transition-colors">
                                    Parent Settings
                                </Link>
                            </li>
                            <li className="flex items-center gap-2 text-slate-600">
                                <Shield className="h-3.5 w-3.5 text-indigo-600" />
                                <span>Minor Safety Enforced</span>
                            </li>
                            <li className="flex items-center gap-2 text-slate-600">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                <span>Verified Tutor Profiles</span>
                            </li>
                            <li className="flex items-center gap-2 text-slate-600">
                                <Lock className="h-3.5 w-3.5 text-indigo-600" />
                                <span>Secure Family Payments</span>
                            </li>
                        </ul>
                    </div>

                    {/* Direct Notifications & Help */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
                            Direct Alerts
                        </h3>
                        <div className="rounded-2xl bg-indigo-50/70 p-4 border border-indigo-100 space-y-2 text-xs mb-4">
                            <div className="flex items-center gap-2 text-indigo-900 font-bold">
                                <Bell className="h-4 w-4 text-indigo-600" />
                                <span>Real-Time Notifications</span>
                            </div>
                            <p className="text-indigo-800 leading-normal">
                                Get direct SMS notifications on your mobile phone and email updates on your Gmail when session bookings are requested or confirmed.
                            </p>
                        </div>
                        <ul className="space-y-2 text-xs">
                            <li className="flex items-center gap-2 text-slate-600">
                                <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                                <span>Parent Help Center & FAQs</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <p>
                        &copy; {new Date().getFullYear()} LearnBridge Platform. Parent Hub.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="hover:text-slate-900 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-slate-900 transition-colors">
                            Terms of Service
                        </Link>
                        <span className="flex items-center gap-1 text-slate-400">
                            Built with <Heart className="h-3.5 w-3.5 text-indigo-500 fill-indigo-500" /> for families
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
