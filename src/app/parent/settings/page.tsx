"use client";

import { useEffect, useState } from "react";
import { Settings, Shield, Bell, Lock, User, Phone, MapPin, Briefcase, CheckCircle2, Save } from "lucide-react";

export default function ParentSettingsPage() {
    const [phone, setPhone] = useState("+251 91 123 4567");
    const [occupation, setOccupation] = useState("Software Engineer");
    const [address, setAddress] = useState("Addis Ababa, Ethiopia");
    const [emailNotify, setEmailNotify] = useState(true);
    const [smsNotify, setSmsNotify] = useState(true);
    const [minorGuardRequired, setMinorGuardRequired] = useState(true);
    const [savedMsg, setSavedMsg] = useState("");

    function handleSaveSettings(e: React.FormEvent) {
        e.preventDefault();
        setSavedMsg("Parent account and safety preferences updated successfully!");
        setTimeout(() => setSavedMsg(""), 4000);
    }

    return (
        <main className="min-h-screen bg-slate-50 p-6 md:p-10 space-y-8 max-w-4xl">
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                    <Settings className="h-8 w-8 text-indigo-600" />
                    Parent Account & Safety Settings
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Manage your contact details, notification alerts, and minor child safety preferences.
                </p>
            </div>

            {savedMsg && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {savedMsg}
                </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* Personal Information */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <User className="h-5 w-5 text-indigo-600" />
                        Parent Profile Information
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5 text-slate-400" /> Phone Number
                            </label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <Briefcase className="h-3.5 w-3.5 text-slate-400" /> Occupation
                            </label>
                            <input
                                type="text"
                                value={occupation}
                                onChange={(e) => setOccupation(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" /> Address / Location
                        </label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Minor Safety & Guard Settings */}
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6 space-y-4">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-indigo-600" />
                        Minor Child Protection Guard
                    </h2>

                    <div className="space-y-3">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={minorGuardRequired}
                                onChange={(e) => setMinorGuardRequired(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                            />
                            <div>
                                <span className="text-xs font-bold text-slate-900 block">
                                    Enforce Parent Approval for Minor Tutor Requests (Under 16)
                                </span>
                                <span className="text-[11px] text-slate-500 block mt-0.5">
                                    Students under age 16 cannot send direct tutor requests or initiate tutor messages without parent authorization.
                                </span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Bell className="h-5 w-5 text-indigo-600" />
                        Notification Preferences
                    </h2>

                    <div className="space-y-3 text-xs text-slate-700">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={emailNotify}
                                onChange={(e) => setEmailNotify(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            Email alerts when a tutor accepts or rejects a match request
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={smsNotify}
                                onChange={(e) => setSmsNotify(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            SMS reminders for upcoming scheduled tutoring sessions
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-sm"
                >
                    <Save className="h-4 w-4" />
                    Save Settings & Preferences
                </button>
            </form>
        </main>
    );
}
