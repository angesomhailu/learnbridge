"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const profileSchema = z.object({
    dateOfBirth: z.string().min(1, "Date of birth is required"),

    gender: z.enum([
        "MALE",
        "FEMALE",
        "OTHER",
        "PREFER_NOT_TO_SAY",
    ]),

    grade: z.string().min(1, "Grade is required"),

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

    const {
        register,
        handleSubmit,
        reset,
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

    useEffect(() => {
        async function loadProfile() {
            try {
                const response = await fetch("/api/student/profile");

                const data = await response.json();

                if (!response.ok) {
                    setMessage(data.message || "Failed to load profile");
                    return;
                }

                const profile = data.profile;

                reset({
                    dateOfBirth: profile.dateOfBirth
                        ? new Date(profile.dateOfBirth)
                            .toISOString()
                            .split("T")[0]
                        : "",

                    gender: profile.gender,

                    grade: profile.grade ?? "",

                    schoolName: profile.schoolName ?? "",

                    bio: profile.bio ?? "",

                    learningNeeds: profile.learningNeeds ?? "",

                    languages: profile.languages ?? [],
                });
            } catch (error) {
                console.error(error);
                setMessage("Failed to load profile");
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [reset]);

    async function onSubmit(values: ProfileFormData) {
        setSaving(true);
        setMessage("");

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
                return;
            }

            setMessage("Profile updated successfully.");

            const profile = data.profile;

            reset({
                dateOfBirth: profile.dateOfBirth
                    ? new Date(profile.dateOfBirth)
                        .toISOString()
                        .split("T")[0]
                    : "",

                gender: profile.gender,

                grade: profile.grade ?? "",

                schoolName: profile.schoolName ?? "",

                bio: profile.bio ?? "",

                learningNeeds: profile.learningNeeds ?? "",

                languages: profile.languages ?? [],
            });
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <p>Loading profile...</p>;
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 rounded-xl border p-6"
        >
            {message && (
                <div className="rounded-lg border p-3">
                    {message}
                </div>
            )}

            {/* Date of birth */}

            <div>
                <label
                    htmlFor="dateOfBirth"
                    className="mb-2 block font-medium"
                >
                    Date of Birth
                </label>

                <input
                    id="dateOfBirth"
                    type="date"
                    {...register("dateOfBirth")}
                    className="w-full rounded-lg border p-3"
                />

                {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.dateOfBirth.message}
                    </p>
                )}
            </div>

            {/* Gender */}

            <div>
                <label
                    htmlFor="gender"
                    className="mb-2 block font-medium"
                >
                    Gender
                </label>

                <select
                    id="gender"
                    {...register("gender")}
                    className="w-full rounded-lg border p-3"
                >
                    <option value="PREFER_NOT_TO_SAY">
                        Prefer not to say
                    </option>

                    <option value="MALE">Male</option>

                    <option value="FEMALE">Female</option>

                    <option value="OTHER">Other</option>
                </select>
            </div>

            {/* Grade */}

            <div>
                <label
                    htmlFor="grade"
                    className="mb-2 block font-medium"
                >
                    Grade / Education Level
                </label>

                <input
                    id="grade"
                    {...register("grade")}
                    placeholder="e.g. Grade 12, University"
                    className="w-full rounded-lg border p-3"
                />

                {errors.grade && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.grade.message}
                    </p>
                )}
            </div>

            {/* School */}

            <div>
                <label
                    htmlFor="schoolName"
                    className="mb-2 block font-medium"
                >
                    School / University
                </label>

                <input
                    id="schoolName"
                    {...register("schoolName")}
                    placeholder="Enter your school or university"
                    className="w-full rounded-lg border p-3"
                />
            </div>

            {/* Languages */}

            <div>
                <label
                    htmlFor="languages"
                    className="mb-2 block font-medium"
                >
                    Languages
                </label>

                <input
                    id="languages"
                    placeholder="English, Amharic, Tigrinya"
                    className="w-full rounded-lg border p-3"
                    onChange={(event) => {
                        const languages = event.target.value
                            .split(",")
                            .map((language) => language.trim())
                            .filter(Boolean);

                        reset((current) => ({
                            ...current,
                            languages,
                        }));
                    }}
                />

                <p className="mt-1 text-sm text-gray-500">
                    Separate languages with commas.
                </p>
            </div>

            {/* Bio */}

            <div>
                <label
                    htmlFor="bio"
                    className="mb-2 block font-medium"
                >
                    About You
                </label>

                <textarea
                    id="bio"
                    {...register("bio")}
                    rows={4}
                    placeholder="Tell us a little about yourself..."
                    className="w-full rounded-lg border p-3"
                />

                {errors.bio && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.bio.message}
                    </p>
                )}
            </div>

            {/* Learning needs */}

            <div>
                <label
                    htmlFor="learningNeeds"
                    className="mb-2 block font-medium"
                >
                    Learning Needs
                </label>

                <textarea
                    id="learningNeeds"
                    {...register("learningNeeds")}
                    rows={5}
                    placeholder="What would you like help with?"
                    className="w-full rounded-lg border p-3"
                />

                {errors.learningNeeds && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.learningNeeds.message}
                    </p>
                )}
            </div>

            {/* Submit */}

            <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-black px-6 py-3 font-medium text-white disabled:opacity-50"
            >
                {saving ? "Saving..." : "Save Profile"}
            </button>
        </form>
    );
}