"use client";

import { useEffect, useState } from "react";
import { Star, CheckCircle2, MessageSquare, ThumbsUp, User } from "lucide-react";

type CompletedSession = {
    id: string;
    tutorName: string;
    tutorEmail: string;
    subject: string;
    childName: string;
    date: string;
    hasReviewed: boolean;
    rating?: number;
    comment?: string;
};

export default function ParentReviewsPage() {
    const [sessions, setSessions] = useState<CompletedSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSession, setSelectedSession] = useState<CompletedSession | null>(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submittedMsg, setSubmittedMsg] = useState("");

    useEffect(() => {
        // Fetch completed sessions or mock initial verified list
        setTimeout(() => {
            setSessions([
                {
                    id: "b-101",
                    tutorName: "Abebe Bikila",
                    tutorEmail: "abebe@learnbridge.edu",
                    subject: "Physics & Mechanics",
                    childName: "Kid Student",
                    date: "2026-08-28",
                    hasReviewed: false,
                },
                {
                    id: "b-102",
                    tutorName: "Tigist Assefa",
                    tutorEmail: "tigist@learnbridge.edu",
                    subject: "Algebra II",
                    childName: "Kid Student",
                    date: "2026-08-20",
                    hasReviewed: true,
                    rating: 5,
                    comment: "Fantastic tutor! Very patient and thorough with problem solving techniques.",
                },
            ]);
            setLoading(false);
        }, 300);
    }, []);

    function handleSubmitReview(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedSession) return;

        setSessions((prev) =>
            prev.map((s) =>
                s.id === selectedSession.id
                    ? { ...s, hasReviewed: true, rating, comment }
                    : s
            )
        );

        setSubmittedMsg("Thank you! Your tutor review and rating have been submitted successfully.");
        setSelectedSession(null);
        setComment("");
    }

    return (
        <main className="min-h-screen bg-slate-50 p-6 md:p-10 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                    <Star className="h-8 w-8 text-amber-500 fill-amber-500" />
                    Session Ratings & Feedback
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Review completed tutoring sessions, rate tutor performance, and help build a trusted community.
                </p>
            </div>

            {submittedMsg && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {submittedMsg}
                </div>
            )}

            {/* Sessions List */}
            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                </div>
            ) : sessions.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm space-y-3">
                    <Star className="mx-auto h-12 w-12 text-slate-300" />
                    <h3 className="text-base font-bold text-slate-900">No completed sessions available for review</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Once your child completes a tutoring session, you will be prompted here to leave rating feedback for the tutor.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {sessions.map((s) => (
                        <div
                            key={s.id}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
                        >
                            <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                                            {s.subject}
                                        </span>
                                        <h3 className="text-base font-bold text-slate-900 mt-0.5">Tutor: {s.tutorName}</h3>
                                        <p className="text-xs text-slate-400">{s.tutorEmail}</p>
                                    </div>

                                    {s.hasReviewed ? (
                                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                                            <CheckCircle2 className="h-3 w-3" /> Reviewed
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                                            <Star className="h-3 w-3 fill-amber-600" /> Pending Review
                                        </span>
                                    )}
                                </div>

                                <div className="text-xs text-slate-500 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <p>Student: <strong>{s.childName}</strong></p>
                                    <p>Completed Date: {s.date}</p>
                                </div>

                                {s.hasReviewed && (
                                    <div className="space-y-1.5 pt-2">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-4 w-4 ${star <= (s.rating || 5)
                                                            ? "text-amber-400 fill-amber-400"
                                                            : "text-slate-200"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        {s.comment && (
                                            <p className="text-xs text-slate-700 italic bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                                                "{s.comment}"
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {!s.hasReviewed && (
                                <button
                                    onClick={() => setSelectedSession(s)}
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-xs"
                                >
                                    <Star className="h-3.5 w-3.5 fill-white" />
                                    Write Session Review
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Review Form Modal */}
            {selectedSession && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-6 z-50 animate-fadeIn">
                    <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl max-w-md w-full space-y-6 shadow-2xl">
                        <div className="space-y-1">
                            <h3 className="font-bold text-slate-900 text-base">Rate Tutoring Session</h3>
                            <p className="text-xs text-slate-500">
                                How was the session with <strong>{selectedSession.tutorName}</strong> for {selectedSession.childName}?
                            </p>
                        </div>

                        <form onSubmit={handleSubmitReview} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 block">Rating (1 to 5 stars)</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="p-1 text-slate-300 hover:scale-110 transition-transform"
                                        >
                                            <Star
                                                className={`h-7 w-7 ${star <= rating
                                                        ? "text-amber-400 fill-amber-400"
                                                        : "text-slate-200"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-700 block">Written Feedback</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Describe tutor communication, teaching quality, and student engagement..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedSession(null)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
