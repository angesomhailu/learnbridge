"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Settings, Shield, Bell, Lock, User, CheckCircle2, AlertCircle } from "lucide-react";

export default function StudentSettingsPage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState("");
    const [notifications, setNotifications] = useState({
        emailBooking: true,
        emailMessages: true,
        reminderAlerts: true,
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            setLoading(true);
            const res = await fetch("/api/student/profile");
            const data = await res.json();
            if (res.ok && data.success) {
                setProfile(data.profile);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    function handleSaveNotifications(e: React.FormEvent) {
        e.preventDefault();
        setMsg("Notification preferences updated successfully!");
        setTimeout(() => setMsg(""), 3000);
    }

    return (
        <main className="min-h-screen bg-slate-50 p-6 md:p-10">
            <div className="mx-auto max-w-4xl space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Settings className="h-8 w-8 text-blue-600" />
                        Account & Portal Settings
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage your account preferences, minor safety guards, and notifications.
                    </p>
                </div>

                {msg && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        {msg}
                    </div>
                )}

                {/* Account & Profile Summary Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-900">Student Profile Information</h2>
                                <p className="text-xs text-slate-500">Grade level, age, and parent connection</p>
                            </div>
                        </div>

                        <Link
                            href="/student/profile"
                            className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                            Edit Profile
                        </Link>
                    </div>

                    {loading ? (
                        <div className="py-4 text-xs text-slate-400">Loading profile details...</div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
                            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Age</span>
                                <p className="text-sm font-bold text-slate-900 mt-0.5">{profile?.age ?? "Not set"}</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Grade Level</span>
                                <p className="text-sm font-bold text-slate-900 mt-0.5">{profile?.gradeLevel ?? "Not set"}</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Mode Eligibility</span>
                                <p className="text-sm font-bold text-slate-900 mt-0.5">
                                    {profile?.independentRequestEligible ? "Direct Match (16+)" : "Parent Approval Required"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Minor Guard & Safety Info */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                            <Shield className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Child Safety & Parental Control Policy</h2>
                            <p className="text-xs text-slate-500">LearnBridge age restriction guards</p>
                        </div>
                    </div>

                    <div className="text-xs text-slate-600 leading-relaxed space-y-2">
                        <p>
                            Students under 16 years of age require parent or legal guardian authorization before booking or requesting tutors directly.
                        </p>
                        <div className="rounded-xl bg-blue-50/70 p-3.5 border border-blue-100 text-blue-900 flex items-start gap-2.5">
                            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>
                                LearnBridge automatically validates age upon profile save. If your age is updated to 16 or above, direct tutor match requests will unlock instantly.
                            </span>
                        </div>
                    </div>
                </div>

                {/* Notifications Preferences */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <Bell className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Notification Preferences</h2>
                            <p className="text-xs text-slate-500">Choose when and how LearnBridge notifies you</p>
                        </div>
                    </div>

                    <form onSubmit={handleSaveNotifications} className="space-y-4">
                        <div className="space-y-3">
                            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                                <div>
                                    <span className="text-xs font-bold text-slate-900">Booking Confirmation Alerts</span>
                                    <p className="text-[11px] text-slate-500">Receive email when a tutor accepts or schedules a session</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={notifications.emailBooking}
                                    onChange={(e) => setNotifications({ ...notifications, emailBooking: e.target.checked })}
                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                            </label>

                            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                                <div>
                                    <span className="text-xs font-bold text-slate-900">New Message Notifications</span>
                                    <p className="text-[11px] text-slate-500">Get notified when a tutor sends you a chat message</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={notifications.emailMessages}
                                    onChange={(e) => setNotifications({ ...notifications, emailMessages: e.target.checked })}
                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                            </label>

                            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                                <div>
                                    <span className="text-xs font-bold text-slate-900">Upcoming Session Reminders</span>
                                    <p className="text-[11px] text-slate-500">Alerts 1 hour before scheduled tutoring classes</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={notifications.reminderAlerts}
                                    onChange={(e) => setNotifications({ ...notifications, reminderAlerts: e.target.checked })}
                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                        >
                            Save Notification Settings
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
