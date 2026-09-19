"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    User,
    Calendar,
    GraduationCap,
    School,
    Globe,
    FileText,
    BookOpen,
    Save,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    ShieldAlert,
} from "lucide-react";

const profileSchema = z.object({
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]),
    grade: z.string().min(1, "Grade / level is required"),
    schoolName: z.string().optional(),
    bio: z.string().max(1000).optional(),
    learningNeeds: z.string().max(2000).optional(),
    languages: z.array(z.string()),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function StudentProfileForm() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isIndependent, setIsIndependent] = useState(true);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            dateOfBirth: "",
            gender: "PREFER_NOT_TO_SAY",
            grade: "",
            schoolName: "",
            bio: "",
            learningNeeds: "",
            languages: [],
        },
    });

    const dateOfBirthValue = watch("dateOfBirth");

    useEffect(() => {
        if (dateOfBirthValue) {
            const birthDate = new Date(dateOfBirthValue);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            setIsIndependent(age >= 16);
        }
    }, [dateOfBirthValue]);

    useEffect(() => {
        async function loadProfile() {
            try {
                const response = await fetch("/api/student/profile");
                const data = await response.json();

                if (!response.ok) {
                    setMessage(data.message || "Failed to load profile");
                    setIsSuccess(false);
                    return;
                }

                const profile = data.profile;
                reset({
                    dateOfBirth: profile.dateOfBirth
                        ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
                        : "",
                    gender: profile.gender || "PREFER_NOT_TO_SAY",
                    grade: profile.grade ?? "",
                    schoolName: profile.schoolName ?? "",
                    bio: profile.bio ?? "",
                    learningNeeds: profile.learningNeeds ?? "",
                    languages: profile.languages ?? [],
                });
            } catch (error) {
                console.error(error);
                setMessage("Failed to load profile");
                setIsSuccess(false);
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [reset]);

    async function onSubmit(values: ProfileFormData) {
        setSaving(true);
        setMessage("");
        setIsSuccess(false);

        try {
            const response = await fetch("/api/student/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to update profile");
                setIsSuccess(false);
                return;
            }

            setMessage("Profile information updated successfully.");
            setIsSuccess(true);
            const profile = data.profile;
            reset({
                dateOfBirth: profile.dateOfBirth
                    ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
                    : "",
                gender: profile.gender || "PREFER_NOT_TO_SAY",
                grade: profile.grade ?? "",
                schoolName: profile.schoolName ?? "",
                bio: profile.bio ?? "",
                learningNeeds: profile.learningNeeds ?? "",
                languages: profile.languages ?? [],
            });
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong while saving profile.");
            setIsSuccess(false);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0070ad] border-t-transparent" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {message && (
                <div
                    className={`rounded-xl border p-4 text-xs font-bold flex items-center gap-2.5 ${isSuccess
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-red-200 bg-red-50 text-red-700"
                        }`}
                >
                    {isSuccess ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : (
                        <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                    )}
                    {message}
                </div>
            )}

            {/* Profile Info Form */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <User className="h-5 w-5 text-[#0070ad]" />
                            Student Profile & Personal Details
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Update your academic background and learning profile preferences.
                        </p>
                    </div>

                    {isIndependent ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-800">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                            Direct Tutor Requests Eligible (16+)
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-800">
                            <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
                            Minor Safety Guard (Under 16)
                        </span>
                    )}
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    {/* Date of Birth */}
                    <div>
                        <label htmlFor="dateOfBirth" className="block text-xs font-bold text-slate-700 mb-1">
                            Date of Birth
                        </label>
                        <div className="relative">
                            <input
                                id="dateOfBirth"
                                type="date"
                                {...register("dateOfBirth")}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#0070ad]"
                            />
                        </div>
                        {errors.dateOfBirth && (
                            <p className="mt-1 text-xs text-red-600 font-medium">{errors.dateOfBirth.message}</p>
                        )}
                    </div>

                    {/* Gender */}
                    <div>
                        <label htmlFor="gender" className="block text-xs font-bold text-slate-700 mb-1">
                            Gender
                        </label>
                        <select
                            id="gender"
                            {...register("gender")}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-[#0070ad]"
                        >
                            <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    {/* Grade */}
                    <div>
                        <label htmlFor="grade" className="block text-xs font-bold text-slate-700 mb-1">
                            Grade / Education Level
                        </label>
                        <input
                            id="grade"
                            {...register("grade")}
                            placeholder="e.g. Grade 12, High School Senior, University"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#0070ad]"
                        />
                        {errors.grade && (
                            <p className="mt-1 text-xs text-red-600 font-medium">{errors.grade.message}</p>
                        )}
                    </div>

                    {/* School Name */}
                    <div>
                        <label htmlFor="schoolName" className="block text-xs font-bold text-slate-700 mb-1">
                            School or Institution
                        </label>
                        <input
                            id="schoolName"
                            {...register("schoolName")}
                            placeholder="Enter school or university name"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#0070ad]"
                        />
                    </div>
                </div>

                {/* Languages */}
                <div>
                    <label htmlFor="languages" className="block text-xs font-bold text-slate-700 mb-1">
                        Spoken Languages (Comma Separated)
                    </label>
                    <input
                        id="languages"
                        placeholder="English, Amharic, Tigrinya, Afaan Oromoo"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#0070ad]"
                        onChange={(event) => {
                            const languages = event.target.value
                                .split(",")
                                .map((lang) => lang.trim())
                                .filter(Boolean);
                            reset((current) => ({
                                ...current,
                                languages,
                            }));
                        }}
                    />
                </div>

                {/* Bio */}
                <div>
                    <label htmlFor="bio" className="block text-xs font-bold text-slate-700 mb-1">
                        About You / Introduction
                    </label>
                    <textarea
                        id="bio"
                        {...register("bio")}
                        rows={3}
                        placeholder="Share a short introduction about your academic interests..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#0070ad]"
                    />
                </div>

                {/* Learning Needs */}
                <div>
                    <label htmlFor="learningNeeds" className="block text-xs font-bold text-slate-700 mb-1">
                        Learning Needs & Preferred Tutor Style
                    </label>
                    <textarea
                        id="learningNeeds"
                        {...register("learningNeeds")}
                        rows={3}
                        placeholder="Describe any specific learning preferences, exam targets, or assistance requirements..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#0070ad]"
                    />
                </div>

                {/* Submit */}
                <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#002b49] px-6 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-[#0070ad] transition disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        {saving ? "Saving Changes..." : "Save Profile Details"}
                    </button>
                </div>
            </div>
        </form>
    );
}