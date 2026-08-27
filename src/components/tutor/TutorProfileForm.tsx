"use client";

import { useEffect, useState } from "react";

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

                if (!response.ok) {
                    setMessage(data.message || "Failed to load profile.");
                    return;
                }

                if (data.profile) {
                    const profile = data.profile;

                    setDateOfBirth(
                        profile.dateOfBirth
                            ? new Date(profile.dateOfBirth)
                                .toISOString()
                                .split("T")[0]
                            : ""
                    );

                    setGender(profile.gender || "PREFER_NOT_TO_SAY");
                    setBio(profile.bio || "");

                    setExperienceYears(
                        profile.experienceYears !== null &&
                            profile.experienceYears !== undefined
                            ? String(profile.experienceYears)
                            : ""
                    );

                    setLanguages(
                        Array.isArray(profile.languages)
                            ? profile.languages.join(", ")
                            : ""
                    );
                }
            } catch (error) {
                console.error(error);
                setMessage("Failed to load tutor profile.");
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
                headers: {
                    "Content-Type": "application/json",
                },
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

            if (!response.ok) {
                setMessage(data.message || "Failed to save profile.");
                return;
            }

            setMessage("Tutor profile saved successfully.");
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <p>Loading tutor profile...</p>;
    }

    return (
        <div className="space-y-6">
            {message && (
                <div className="rounded-lg border p-4">
                    {message}
                </div>
            )}

            <div>
                <label className="mb-2 block font-medium">
                    Date of Birth
                </label>

                <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full rounded-lg border p-3"
                />
            </div>

            <div>
                <label className="mb-2 block font-medium">
                    Gender
                </label>

                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full rounded-lg border p-3"
                >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                    <option value="PREFER_NOT_TO_SAY">
                        Prefer not to say
                    </option>
                </select>
            </div>

            <div>
                <label className="mb-2 block font-medium">
                    Teaching Experience
                </label>

                <input
                    type="number"
                    min="0"
                    value={experienceYears}
                    onChange={(e) =>
                        setExperienceYears(e.target.value)
                    }
                    placeholder="Example: 3"
                    className="w-full rounded-lg border p-3"
                />

                <p className="mt-1 text-sm text-gray-500">
                    Number of years you have been teaching.
                </p>
            </div>

            <div>
                <label className="mb-2 block font-medium">
                    Languages
                </label>

                <input
                    type="text"
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    placeholder="Example: English, Amharic, Tigrinya"
                    className="w-full rounded-lg border p-3"
                />

                <p className="mt-1 text-sm text-gray-500">
                    Separate multiple languages with commas.
                </p>
            </div>

            <div>
                <label className="mb-2 block font-medium">
                    About You
                </label>

                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={6}
                    placeholder="Tell students about your teaching experience and approach..."
                    className="w-full rounded-lg border p-3"
                />
            </div>

            <button
                type="button"
                onClick={saveProfile}
                disabled={saving}
                className="rounded-lg bg-black px-6 py-3 font-medium text-white disabled:opacity-50"
            >
                {saving ? "Saving..." : "Save Tutor Profile"}
            </button>
        </div>
    );
}