"use client";

import { useEffect, useState } from "react";

type Education = {
    id: string;
    institution: string;
    degree: string;
    department: string | null;
    graduationYear: number | null;
};

export default function TutorEducation() {
    const [education, setEducation] = useState<Education[]>([]);

    const [institution, setInstitution] = useState("");
    const [degree, setDegree] = useState("");
    const [department, setDepartment] = useState("");
    const [graduationYear, setGraduationYear] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    async function loadEducation() {
        try {
            const response = await fetch("/api/tutor/education");
            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to load education.");
                return;
            }

            setEducation(data.education || []);
        } catch (error) {
            console.error(error);
            setMessage("Failed to load education records.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadEducation();
    }, []);

    async function addEducation() {
        if (!institution || !degree) {
            setMessage("Institution and degree are required.");
            return;
        }

        setSaving(true);
        setMessage("");

        try {
            const response = await fetch("/api/tutor/education", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    institution,
                    degree,
                    department,
                    graduationYear,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to add education.");
                return;
            }

            setMessage("Education record added successfully.");

            setInstitution("");
            setDegree("");
            setDepartment("");
            setGraduationYear("");

            await loadEducation();
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong.");
        } finally {
            setSaving(false);
        }
    }

    async function deleteEducation(id: string) {
        try {
            const response = await fetch(
                `/api/tutor/education/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to delete record.");
                return;
            }

            setMessage("Education record deleted.");

            await loadEducation();
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong.");
        }
    }

    if (loading) {
        return <p>Loading education records...</p>;
    }

    return (
        <div className="space-y-8">
            {message && (
                <div className="rounded-lg border p-4">
                    {message}
                </div>
            )}

            {/* Add education */}
            <section className="rounded-xl border p-6">
                <h2 className="text-xl font-semibold">
                    Add Education
                </h2>

                <div className="mt-5 space-y-4">
                    <div>
                        <label className="mb-2 block font-medium">
                            Institution
                        </label>

                        <input
                            type="text"
                            value={institution}
                            onChange={(e) =>
                                setInstitution(e.target.value)
                            }
                            placeholder="Example: Mekelle University"
                            className="w-full rounded-lg border p-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Degree
                        </label>

                        <input
                            type="text"
                            value={degree}
                            onChange={(e) => setDegree(e.target.value)}
                            placeholder="Example: BSc Software Engineering"
                            className="w-full rounded-lg border p-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Department
                        </label>

                        <input
                            type="text"
                            value={department}
                            onChange={(e) =>
                                setDepartment(e.target.value)
                            }
                            placeholder="Example: Software Engineering"
                            className="w-full rounded-lg border p-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Graduation Year
                        </label>

                        <input
                            type="number"
                            min="1900"
                            max={new Date().getFullYear() + 10}
                            value={graduationYear}
                            onChange={(e) =>
                                setGraduationYear(e.target.value)
                            }
                            placeholder="Example: 2026"
                            className="w-full rounded-lg border p-3"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={addEducation}
                        disabled={saving}
                        className="rounded-lg bg-black px-6 py-3 font-medium text-white disabled:opacity-50"
                    >
                        {saving
                            ? "Adding..."
                            : "Add Education"}
                    </button>
                </div>
            </section>

            {/* Existing education */}
            <section>
                <h2 className="mb-4 text-xl font-semibold">
                    Education History
                </h2>

                {education.length === 0 ? (
                    <div className="rounded-xl border p-6 text-gray-600">
                        No education records added yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {education.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between rounded-xl border p-5"
                            >
                                <div>
                                    <h3 className="font-semibold">
                                        {item.degree}
                                    </h3>

                                    <p className="text-gray-600">
                                        {item.institution}
                                    </p>

                                    {item.department && (
                                        <p className="text-sm text-gray-500">
                                            {item.department}
                                        </p>
                                    )}

                                    {item.graduationYear && (
                                        <p className="mt-1 text-sm text-gray-500">
                                            Graduated: {item.graduationYear}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        deleteEducation(item.id)
                                    }
                                    className="rounded-lg border px-4 py-2 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}