"use client";

import { useState } from "react";
import {
    Settings,
    Shield,
    Bell,
    User,
    Phone,
    MapPin,
    Briefcase,
    GraduationCap,
    BookOpen,
    Clock,
    DollarSign,
    CheckCircle2,
    Save,
} from "lucide-react";

export default function TutorSettingsPage() {
    const [phone, setPhone] = useState("+251 91 123 4567");
    const [occupation, setOccupation] = useState("Software Engineer");
    const [address, setAddress] = useState("Addis Ababa, Ethiopia");

    const [qualification, setQualification] = useState(
        "BSc in Software Engineering"
    );

    const [experience, setExperience] = useState("2 years");
    const [hourlyRate, setHourlyRate] = useState("300");

    const [sessionMode, setSessionMode] = useState("Online & In-Person");

    const [emailNotify, setEmailNotify] = useState(true);
    const [smsNotify, setSmsNotify] = useState(true);
    const [requestNotify, setRequestNotify] = useState(true);
    const [messageNotify, setMessageNotify] = useState(true);

    const [studentSafety, setStudentSafety] = useState(true);

    const [savedMsg, setSavedMsg] = useState("");

    function handleSaveSettings(e: React.FormEvent) {
        e.preventDefault();

        setSavedMsg(
            "Tutor account and teaching preferences updated successfully!"
        );

        setTimeout(() => setSavedMsg(""), 4000);
    }

    return (
        <main className="min-h-screen bg-slate-50 p-6 md:p-10 space-y-8 max-w-4xl">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                    <Settings className="h-8 w-8 text-indigo-600" />
                    Tutor Account & Teaching Settings
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Manage your professional information, teaching preferences,
                    notifications, and tutor safety settings.
                </p>
            </div>

            {/* Success Message */}
            {savedMsg && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {savedMsg}
                </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* Tutor Profile Information */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <User className="h-5 w-5 text-indigo-600" />
                        Tutor Profile Information
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Phone */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5 text-slate-400" />
                                Phone Number
                            </label>

                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Occupation */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                                Occupation / Profession
                            </label>

                            <input
                                type="text"
                                value={occupation}
                                onChange={(e) => setOccupation(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            Address / Location
                        </label>

                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Teaching & Professional Information */}
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6 space-y-4">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-indigo-600" />
                        Teaching & Professional Information
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Qualification */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                                Highest Qualification
                            </label>

                            <input
                                type="text"
                                value={qualification}
                                onChange={(e) =>
                                    setQualification(e.target.value)
                                }
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Experience */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                                Teaching Experience
                            </label>

                            <input
                                type="text"
                                value={experience}
                                onChange={(e) =>
                                    setExperience(e.target.value)
                                }
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <p className="text-[11px] text-slate-500">
                        Keep your professional information accurate so students
                        and parents can make informed tutor-matching decisions.
                    </p>
                </div>

                {/* Teaching Preferences */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-indigo-600" />
                        Teaching Preferences
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Session Mode */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-slate-400" />
                                Preferred Session Mode
                            </label>

                            <select
                                value={sessionMode}
                                onChange={(e) =>
                                    setSessionMode(e.target.value)
                                }
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option>Online & In-Person</option>
                                <option>Online Only</option>
                                <option>In-Person Only</option>
                            </select>
                        </div>

                        {/* Hourly Rate */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                                Hourly Rate (ETB)
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={hourlyRate}
                                onChange={(e) =>
                                    setHourlyRate(e.target.value)
                                }
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Tutor Safety & Communication */}
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6 space-y-4">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-indigo-600" />
                        Tutor Safety & Student Communication
                    </h2>

                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={studentSafety}
                            onChange={(e) =>
                                setStudentSafety(e.target.checked)
                            }
                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                        />

                        <div>
                            <span className="text-xs font-bold text-slate-900 block">
                                Follow LearnBridge Student Safety Guidelines
                            </span>

                            <span className="text-[11px] text-slate-500 block mt-0.5">
                                Keep tutoring communication and sessions within
                                the LearnBridge platform and follow the required
                                safety rules when working with students.
                            </span>
                        </div>
                    </label>
                </div>

                {/* Notification Settings */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Bell className="h-5 w-5 text-indigo-600" />
                        Notification Preferences
                    </h2>

                    <div className="space-y-3 text-xs text-slate-700">
                        {/* Match Requests */}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={requestNotify}
                                onChange={(e) =>
                                    setRequestNotify(e.target.checked)
                                }
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />

                            Receive notifications when a student or parent
                            sends a tutor request
                        </label>

                        {/* Messages */}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={messageNotify}
                                onChange={(e) =>
                                    setMessageNotify(e.target.checked)
                                }
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />

                            Receive notifications for new student and parent
                            messages
                        </label>

                        {/* Email */}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={emailNotify}
                                onChange={(e) =>
                                    setEmailNotify(e.target.checked)
                                }
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />

                            Receive important account and booking alerts by
                            email
                        </label>

                        {/* SMS */}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={smsNotify}
                                onChange={(e) =>
                                    setSmsNotify(e.target.checked)
                                }
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />

                            Receive SMS reminders for upcoming tutoring
                            sessions
                        </label>
                    </div>
                </div>

                {/* Save Button */}
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