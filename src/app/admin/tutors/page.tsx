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
    Search,
    User,
    Filter,
} from "lucide-react";

type Tutor = {
    id: string;

    user: {
        id: string;
        email: string;
        phone?: string | null;
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

    pricing: {
        amount: number;
        currency: string;
        durationMinutes: number;
    }[];
};

export default function AdminTutorsPage() {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState<string>("PENDING");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);

    async function loadTutors() {
        setLoading(true);
        try {
            const url = activeTab === "ALL"
                ? `/api/admin/tutors?query=${encodeURIComponent(searchQuery)}`
                : `/api/admin/tutors?status=${activeTab}&query=${encodeURIComponent(searchQuery)}`;

            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to load tutors.");
                return;
            }

            setTutors(data.tutors || []);
        } catch (error) {
            console.error(error);
            setMessage("Failed to load tutor verification queue.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTutors();
    }, [activeTab]);

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
                setMessage(data.message || "Failed to update tutor status.");
                return;
            }

            setMessage(data.message);
            if (selectedTutor?.id === tutorId) {
                setSelectedTutor(null);
            }
            await loadTutors();
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong updating verification.");
        }
    }

    const tabs = [
        { id: "PENDING", label: "Pending Review" },
        { id: "VERIFIED", label: "Verified Tutors" },
        { id: "REJECTED", label: "Rejected" },
        { id: "RESUBMISSION_REQUIRED", label: "Resubmission Req." },
        { id: "ALL", label: "All Educators" },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold uppercase tracking-wider">
                    <UserCheck className="h-3.5 w-3.5 text-rose-600" />
                    Educator Credentials Console
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Tutor Approvals & Auditing
                </h1>
                <p className="text-sm text-slate-600 max-w-2xl leading-relaxed font-medium">
                    Audit educator profiles, degree qualifications, attached official documents, and subject proficiencies before granting verified tutor badges on LearnBridge.
                </p>
            </div>

            {message && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs font-bold text-blue-800 shadow-xs flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        {message}
                    </span>
                    <button
                        onClick={() => setMessage("")}
                        className="text-xs text-blue-600 hover:text-blue-800 font-bold underline"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Controls Bar: Tabs & Search */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
                <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${activeTab === tab.id
                                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                                : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        loadTutors();
                    }}
                    className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-2xl text-xs"
                >
                    <Search className="h-4 w-4 text-slate-400 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search tutor by email or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent text-slate-800 font-medium placeholder-slate-400 outline-none w-full md:w-56"
                    />
                    <button
                        type="submit"
                        className="px-3 py-1 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Tutors Stream */}
            {loading ? (
                <div className="flex items-center justify-center min-h-[300px] text-slate-500 text-xs font-bold">
                    <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 animate-spin text-blue-600" />
                        <span>Loading educator queue...</span>
                    </div>
                </div>
            ) : tutors.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-3 shadow-2xs">
                    <div className="mx-auto h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">
                        No Educators Found
                    </h2>
                    <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                        There are no tutor profiles matching your current tab filter ({activeTab}) or search query.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {tutors.map((tutor) => (
                        <div
                            key={tutor.id}
                            className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-6 hover:shadow-md transition"
                        >
                            {/* Header Info & Actions */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 border border-slate-200 flex items-center justify-center font-black text-blue-700 text-base">
                                            {tutor.user.email[0]?.toUpperCase() || "T"}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-lg font-extrabold text-slate-900">
                                                    {tutor.user.email}
                                                </h2>
                                                <span
                                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase ${tutor.verificationStatus === "VERIFIED"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        : tutor.verificationStatus === "PENDING"
                                                            ? "bg-amber-50 text-amber-700 border-amber-200"
                                                            : "bg-rose-50 text-rose-700 border-rose-200"
                                                        }`}
                                                >
                                                    {tutor.verificationStatus}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium">
                                                Phone: {tutor.user.phone || "Not specified"} • Registered: {new Date(tutor.user.createdAt).toLocaleDateString()}
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
                                        <span>Approve Verification</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => updateVerification(tutor.id, "REJECTED")}
                                        className="flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 shadow-sm transition"
                                    >
                                        <XCircle className="h-4 w-4" />
                                        <span>Reject Profile</span>
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
                                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Educator Biography & Statement
                                    </h3>
                                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60 font-medium">
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
                                        Education Credentials
                                    </div>
                                    <div className="space-y-2">
                                        {tutor.educationRecords.length === 0 ? (
                                            <p className="text-xs text-slate-400 italic">No education records provided.</p>
                                        ) : (
                                            tutor.educationRecords.map((education) => (
                                                <div
                                                    key={education.id}
                                                    className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5 space-y-1"
                                                >
                                                    <p className="font-bold text-xs text-slate-800">
                                                        {education.degree}
                                                    </p>
                                                    <p className="text-xs text-slate-600 font-medium">
                                                        {education.institution}
                                                        {education.department ? ` — ${education.department}` : ""}
                                                    </p>
                                                    {education.graduationYear && (
                                                        <p className="text-[10px] text-slate-500 font-medium">
                                                            Graduated Year: {education.graduationYear}
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
                                            <p className="text-xs text-slate-400 italic">No subjects registered.</p>
                                        ) : (
                                            tutor.subjects.map((subject) => (
                                                <span
                                                    key={subject.id}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800"
                                                >
                                                    <span>{subject.subject.name}</span>
                                                    {subject.proficiencyLevel && (
                                                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md">
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
                                    Verification Documents & Attachments
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {tutor.documents.length === 0 ? (
                                        <p className="text-xs text-slate-400 italic">No uploaded documents attached.</p>
                                    ) : (
                                        tutor.documents.map((document) => (
                                            <div
                                                key={document.id}
                                                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5"
                                            >
                                                <div className="space-y-0.5 overflow-hidden">
                                                    <p className="font-bold text-xs text-slate-800 truncate">
                                                        {document.title}
                                                    </p>
                                                    <p className="text-[10px] uppercase font-bold text-slate-500">
                                                        {document.type}
                                                    </p>
                                                </div>

                                                <a
                                                    href={document.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs px-3 py-2 transition shrink-0"
                                                >
                                                    <span>View Document</span>
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
