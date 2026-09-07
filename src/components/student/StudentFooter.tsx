"use client";

import Link from "next/link";
import {
    BookOpen,
    Bell,
    Shield,
    HelpCircle,
    Mail,
    Phone,
    Heart,
    ExternalLink,
} from "lucide-react";

export default function StudentFooter() {
    return (
        <footer className="mt-16 border-t border-slate-200 bg-white pt-12 pb-8 text-slate-600">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link href="/student" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg shadow-md shadow-blue-500/20">
                                L
                            </div>
                            <div>
                                <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                                    LearnBridge
                                </span>
                                <span className="block text-xs font-medium text-blue-600 uppercase tracking-wider">
                                    Student Portal
                                </span>
                            </div>
                        </Link>

                        <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
                            Connect with expert tutors, manage personalized learning goals, track your progress, and get real-time SMS & email updates for seamless academic growth.
                        </p>

                        <div className="flex items-center gap-2 pt-2">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-semibold text-slate-700">
                                Student Services Operational
                            </span>
                        </div>
                    </div>

                    {/* Quick Navigation */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
                            Learning Navigation
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link href="/student" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/student/tutors" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                                    Find Tutors
                                </Link>
                            </li>
                            <li>
                                <Link href="/student/progress" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                                    My Progress
                                </Link>
                            </li>
                            <li>
                                <Link href="/student/messages" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                                    Messages
                                </Link>
                            </li>
                            <li>
                                <Link href="/student/bookings" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                                    My Bookings
                                </Link>
                            </li>
                            <li>
                                <Link href="/student/subjects" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                                    Browse Subjects
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Student Tools & Accounts */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
                            Account & Tools
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link href="/student/goals" className="hover:text-blue-600 transition-colors">
                                    Learning Goals
                                </Link>
                            </li>
                            <li>
                                <Link href="/student/budget" className="hover:text-blue-600 transition-colors">
                                    Budget & Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="/student/availability" className="hover:text-blue-600 transition-colors">
                                    My Availability
                                </Link>
                            </li>
                            <li>
                                <Link href="/student/payments" className="hover:text-blue-600 transition-colors">
                                    Payment History
                                </Link>
                            </li>
                            <li>
                                <Link href="/student/profile" className="hover:text-blue-600 transition-colors">
                                    Student Profile
                                </Link>
                            </li>
                            <li>
                                <Link href="/student/settings" className="hover:text-blue-600 transition-colors">
                                    Notification Settings
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Notifications & Help */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
                            Notifications & Support
                        </h3>
                        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-3 text-xs mb-4">
                            <div className="flex items-center gap-2 text-slate-800 font-semibold">
                                <Bell className="h-4 w-4 text-blue-600" />
                                <span>Instant Alerts</span>
                            </div>
                            <p className="text-slate-500 leading-normal">
                                Direct SMS & Email notifications dispatched upon booking confirmation, message receipt, and account updates.
                            </p>
                        </div>
                        <ul className="space-y-2 text-xs">
                            <li className="flex items-center gap-2 text-slate-600">
                                <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                                <span>Help Center & Guidelines</span>
                            </li>
                            <li className="flex items-center gap-2 text-slate-600">
                                <Shield className="h-3.5 w-3.5 text-slate-400" />
                                <span>Student Safety & Privacy</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <p>
                        &copy; {new Date().getFullYear()} LearnBridge Platform. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="hover:text-slate-900 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-slate-900 transition-colors">
                            Terms of Service
                        </Link>
                        <span className="flex items-center gap-1 text-slate-400">
                            Built with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> for students
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
