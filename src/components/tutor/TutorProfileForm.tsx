"use client";

import { useEffect, useState } from "react";
import { User, Calendar, Award, Languages, BookOpen, CheckCircle2, Save } from "lucide-react";

export default function TutorProfileForm() {
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [gender, setGender] = useState("PREFER_NOT_TO_SAY");
    const [bio, setBio] = useState("");
    const [experienceYears, setExperienceYears] = useState("");
    const [languages, setLanguages] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function loadProfile() {
            try {
                const response = await fetch("/api/tutor/profile");
                const data = await response.json();

                if (response.ok && data.profile) {
                    const profile = data.profile;
                    setDateOfBirth(
                        profile.dateOfBirth
                            ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
                            : ""
                    );
                    setGender(profile.gender || "PREFER_NOT_TO_SAY");
                    setBio(profile.bio || "");
                    setExperienceYears(
                        profile.experienceYears !== null && profile.experienceYears !== undefined
                            ? String(profile.experienceYears)
                            : ""
                    );
                    setLanguages(
                        Array.isArray(profile.languages) ? profile.languages.join(", ") : ""
                    );
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, []);

    async function saveProfile() {
        setSaving(true);
        setMessage("");

        try {
            const response = await fetch("/api/tutor/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    dateOfBirth,
                    gender,
                    bio,
                    experienceYears,
                    languages: languages
                        .split(",")
                        .map((language) => language.trim())
                        .filter(Boolean),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Tutor profile updated successfully!");
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage(data.message || "Failed to save profile.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="h-7 w-7 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {message && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {message}
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        Gender
                    </label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                        <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Award className="h-3.5 w-3.5 text-slate-400" />
                        Teaching Experience (Years)
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        placeholder="e.g. 5"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Languages className="h-3.5 w-3.5 text-slate-400" />
                        Spoken Languages
                    </label>
                    <input
                        type="text"
                        value={languages}
                        onChange={(e) => setLanguages(e.target.value)}
                        placeholder="e.g. English, Amharic, Tigrinya"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                    Teaching Philosophy & Biography
                </label>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={5}
                    placeholder="Describe your academic methodology, tutoring background, and how you help students succeed..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
            </div>

            <div className="flex justify-end pt-2">
                <button
                    type="button"
                    onClick={saveProfile}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition shadow-xs"
                >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Tutor Profile"}
                </button>
            </div>
        </div>
    );
}