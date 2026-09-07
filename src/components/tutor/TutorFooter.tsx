"use client";

import Link from "next/link";
import {
    ShieldCheck,
    Bell,
    Award,
    HelpCircle,
    FileText,
    Heart,
} from "lucide-react";

export default function TutorFooter() {
    return (
        <footer className="mt-16 border-t border-slate-800 bg-slate-900 text-slate-400 pt-12 pb-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link href="/tutor" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-indigo-600 font-black text-white text-xl shadow-md">
                                L
                            </div>
                            <div>
                                <span className="text-xl font-extrabold text-white tracking-tight block">
                                    LearnBridge
                                </span>
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                                    Educator Portal
                                </span>
                            </div>
                        </Link>

                        <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
                            Empowering passionate educators to teach, manage student bookings, set flexible rates, track session earnings, and communicate seamlessly with direct SMS & email alerts.
                        </p>

                        <div className="flex items-center gap-2 pt-2">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-semibold text-slate-300">
                                Educator Booking Gateway Active
                            </span>
                        </div>
                    </div>

                    {/* Quick Navigation */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                            Educator Portal Pages
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link href="/tutor" className="hover:text-emerald-400 transition-colors">
                                    Overview Hub
                                </Link>
                            </li>
                            <li>
                                <Link href="/tutor/requests" className="hover:text-emerald-400 transition-colors">
                                    Student Requests
                                </Link>
                            </li>
                            <li>
                                <Link href="/tutor/bookings" className="hover:text-emerald-400 transition-colors">
                                    Sessions & Bookings
                                </Link>
                            </li>
                            <li>
                                <Link href="/tutor/messages" className="hover:text-emerald-400 transition-colors">
                                    Messages
                                </Link>
                            </li>
                            <li>
                                <Link href="/tutor/availability" className="hover:text-emerald-400 transition-colors">
                                    Teaching Availability
                                </Link>
                            </li>
                            <li>
                                <Link href="/tutor/pricing" className="hover:text-emerald-400 transition-colors">
                                    Pricing & Hourly Rates
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Qualifications & Account */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                            Credentials & Profile
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link href="/tutor/subjects" className="hover:text-emerald-400 transition-colors">
                                    Subjects Competency
                                </Link>
                            </li>
                            <li>
                                <Link href="/tutor/education" className="hover:text-emerald-400 transition-colors">
                                    Academic Education
                                </Link>
                            </li>
                            <li>
                                <Link href="/tutor/documents" className="hover:text-emerald-400 transition-colors">
                                    Verification Docs
                                </Link>
                            </li>
                            <li>
                                <Link href="/tutor/profile" className="hover:text-emerald-400 transition-colors">
                                    Profile Settings
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Direct Notifications & Support */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                            Notifications & Standards
                        </h3>
                        <div className="rounded-2xl bg-slate-800/80 p-4 border border-slate-700/60 space-y-2.5 text-xs mb-4">
                            <div className="flex items-center gap-2 text-emerald-300 font-bold">
                                <Bell className="h-4 w-4 text-emerald-400" />
                                <span>Real-Time Notifications</span>
                            </div>
                            <p className="text-slate-400 leading-normal">
                                Receive instant SMS alerts on your phone and email notifications to your Gmail whenever a student requests a session.
                            </p>
                        </div>
                        <ul className="space-y-2 text-xs">
                            <li className="flex items-center gap-2 text-slate-400">
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                                <span>Identity Verification Standards</span>
                            </li>
                            <li className="flex items-center gap-2 text-slate-400">
                                <Award className="h-3.5 w-3.5 text-emerald-400" />
                                <span>Tutor Code of Conduct</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <p>
                        &copy; {new Date().getFullYear()} LearnBridge Platform. Educator Portal.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="hover:text-slate-300 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-slate-300 transition-colors">
                            Terms of Service
                        </Link>
                        <span className="flex items-center gap-1 text-slate-500">
                            Built with <Heart className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500" /> for educators
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
