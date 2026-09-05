"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Plus, Trash2, CheckCircle2, Building, Calendar, Award } from "lucide-react";

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
            if (response.ok && data.success) {
                setEducation(data.education || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadEducation();
    }, []);

    async function addEducation() {
        if (!institution || !degree) {
            setMessage("Institution name and degree are required.");
            return;
        }

        setSaving(true);
        setMessage("");

        try {
            const response = await fetch("/api/tutor/education", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    institution,
                    degree,
                    department,
                    graduationYear,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Academic qualification record added successfully!");
                setInstitution("");
                setDegree("");
                setDepartment("");
                setGraduationYear("");
                await loadEducation();
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage(data.message || "Failed to add education.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    }

    async function deleteEducation(id: string) {
        try {
            const response = await fetch(`/api/tutor/education/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setMessage("Education record deleted.");
                await loadEducation();
                setTimeout(() => setMessage(""), 3000);
            }
        } catch (error) {
            console.error(error);
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
        <div className="space-y-8">
            {message && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {message}
                </div>
            )}

            {/* Form */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Plus className="h-5 w-5 text-emerald-600" />
                    Add Degree or Certification
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Institution Name</label>
                        <input
                            type="text"
                            value={institution}
                            onChange={(e) => setInstitution(e.target.value)}
                            placeholder="e.g. Mekelle University / Addis Ababa University"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Degree / Diploma Title</label>
                        <input
                            type="text"
                            value={degree}
                            onChange={(e) => setDegree(e.target.value)}
                            placeholder="e.g. BSc Computer Science / Bed Mathematics"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Department / Major</label>
                        <input
                            type="text"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            placeholder="e.g. Electrical Engineering & Computing"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Graduation Year</label>
                        <input
                            type="number"
                            min="1900"
                            max={new Date().getFullYear() + 10}
                            value={graduationYear}
                            onChange={(e) => setGraduationYear(e.target.value)}
                            placeholder="e.g. 2024"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="button"
                        onClick={addEducation}
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition shadow-xs"
                    >
                        <Plus className="h-4 w-4" />
                        {saving ? "Saving..." : "Add Education Record"}
                    </button>
                </div>
            </section>

            {/* List */}
            <section className="space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-emerald-600" />
                    Academic Credentials & Degrees
                </h2>

                {education.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-2">
                        <GraduationCap className="h-10 w-10 text-slate-300 mx-auto" />
                        <h3 className="text-sm font-bold text-slate-900">No education records added yet</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            Add your university degrees, diplomas, or teaching credentials above.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {education.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-0.5">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                                                Degree / Certificate
                                            </span>
                                            <h3 className="font-bold text-sm text-slate-900">{item.degree}</h3>
                                        </div>
                                        {item.graduationYear && (
                                            <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                                                {item.graduationYear}
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-1 text-xs text-slate-600">
                                        <p className="flex items-center gap-1.5 font-semibold text-slate-800">
                                            <Building className="h-3.5 w-3.5 text-slate-400" />
                                            {item.institution}
                                        </p>
                                        {item.department && (
                                            <p className="text-slate-500 text-[11px] pl-5">{item.department}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => deleteEducation(item.id)}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-1 rounded-lg transition"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Remove Record
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}