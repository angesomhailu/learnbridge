"use client";

import { useEffect, useState } from "react";
import {
    CheckCircle2,
    XCircle,
    RotateCcw,
    GraduationCap,
    BookOpen,
    FileText,
    ExternalLink,
    AlertCircle,
    UserCheck,
    Clock,
} from "lucide-react";

type Tutor = {
    id: string;

    user: {
        id: string;
        email: string;
        status: string;
        createdAt: string;
    };

    bio?: string | null;
    experienceYears?: number | null;

    verificationStatus: string;

    educationRecords: {
        id: string;
        degree: string;
        department?: string | null;
        institution: string;
        graduationYear?: number | null;
    }[];

    documents: {
        id: string;
        type: string;
        title: string;
        fileUrl: string;
        fileName: string;
        verificationStatus: string;
    }[];

    subjects: {
        id: string;
        proficiencyLevel?: string | null;
        subject: {
            name: string;
        };
    }[];
};

export default function AdminTutorsPage() {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    async function loadTutors() {
        try {
            const response = await fetch("/api/admin/tutors/pending");
            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to load tutors.");
                return;
            }

            setTutors(data.tutors || []);
        } catch (error) {
            console.error(error);
            setMessage("Failed to load pending tutors.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTutors();
    }, []);

    async function updateVerification(tutorId: string, verificationStatus: string) {
        try {
            const response = await fetch(`/api/admin/tutors/${tutorId}/verification`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    verificationStatus,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to update tutor.");
                return;
            }

            setMessage(data.message);
            await loadTutors();
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong.");
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[300px] text-slate-500 text-sm font-semibold">
                <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 animate-spin text-blue-600" />
                    <span>Loading tutor verification queue...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider">
                    <UserCheck className="h-3.5 w-3.5 text-rose-600" />
                    Credential Auditing
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Tutor Approvals Console
                </h1>
                <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                    Review educator profiles, submitted degree records, subject proficiencies, and official credentials before issuing verified tutor badges on LearnBridge.
                </p>
            </div>

            {message && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs font-semibold text-blue-800 shadow-xs flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        {message}
                    </span>
                    <button
                        onClick={() => setMessage("")}
                        className="text-xs text-blue-600 hover:text-blue-800 font-bold"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {tutors.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-3 shadow-sm">
                    <div className="mx-auto h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">
                        All Tutors Reviewed
                    </h2>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                        There are no pending educator profiles awaiting credential verification right now.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {tutors.map((tutor) => (
                        <div
                            key={tutor.id}
                            className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6"
                        >
                            {/* Card Top Info & Quick Actions */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                                            {tutor.user.email[0]?.toUpperCase() || "T"}
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900">
                                                {tutor.user.email}
                                            </h2>
                                            <p className="text-xs text-slate-500">
                                                Submitted: {new Date(tutor.user.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => updateVerification(tutor.id, "VERIFIED")}
                                        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 shadow-sm transition"
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span>Approve</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => updateVerification(tutor.id, "REJECTED")}
                                        className="flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 shadow-sm transition"
                                    >
                                        <XCircle className="h-4 w-4" />
                                        <span>Reject</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => updateVerification(tutor.id, "RESUBMISSION_REQUIRED")}
                                        className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 transition"
                                    >
                                        <RotateCcw className="h-4 w-4 text-slate-500" />
                                        <span>Request Resubmission</span>
                                    </button>
                                </div>
                            </div>

                            {/* Bio */}
                            {tutor.bio && (
                                <div className="space-y-1.5">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Biography & Statement
                                    </h3>
                                    <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                                        {tutor.bio}
                                    </p>
                                </div>
                            )}

                            {/* Two-Column Detail Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Education Records */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                                        <GraduationCap className="h-4 w-4 text-blue-600" />
                                        Education Records
                                    </div>
                                    <div className="space-y-2">
                                        {tutor.educationRecords.length === 0 ? (
                                            <p className="text-xs text-slate-400 italic">No education records specified.</p>
                                        ) : (
                                            tutor.educationRecords.map((education) => (
                                                <div
                                                    key={education.id}
                                                    className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-1"
                                                >
                                                    <p className="font-bold text-xs text-slate-800">
                                                        {education.degree}
                                                    </p>
                                                    <p className="text-xs text-slate-600">
                                                        {education.institution}
                                                        {education.department ? ` — ${education.department}` : ""}
                                                    </p>
                                                    {education.graduationYear && (
                                                        <p className="text-[10px] text-slate-500 font-medium">
                                                            Graduated: {education.graduationYear}
                                                        </p>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Subjects */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                                        <BookOpen className="h-4 w-4 text-emerald-600" />
                                        Subject Offerings
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {tutor.subjects.length === 0 ? (
                                            <p className="text-xs text-slate-400 italic">No subjects selected.</p>
                                        ) : (
                                            tutor.subjects.map((subject) => (
                                                <span
                                                    key={subject.id}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800"
                                                >
                                                    <span>{subject.subject.name}</span>
                                                    {subject.proficiencyLevel && (
                                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                                                            {subject.proficiencyLevel}
                                                        </span>
                                                    )}
                                                </span>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Documents Section */}
                            <div className="space-y-3 pt-2 border-t border-slate-100">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    <FileText className="h-4 w-4 text-indigo-600" />
                                    Submitted Verification Documents
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {tutor.documents.length === 0 ? (
                                        <p className="text-xs text-slate-400 italic">No documents attached.</p>
                                    ) : (
                                        tutor.documents.map((document) => (
                                            <div
                                                key={document.id}
                                                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5"
                                            >
                                                <div className="space-y-0.5 overflow-hidden">
                                                    <p className="font-bold text-xs text-slate-800 truncate">
                                                        {document.title}
                                                    </p>
                                                    <p className="text-[10px] uppercase font-semibold text-slate-500">
                                                        {document.type}
                                                    </p>
                                                </div>

                                                <a
                                                    href={document.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs px-3 py-2 transition shrink-0"
                                                >
                                                    <span>View</span>
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                </a>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
