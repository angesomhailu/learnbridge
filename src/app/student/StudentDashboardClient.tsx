"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Subject = {
    id: string;
    name: string;
};

type TutorPricing = {
    id: string;
    amount: string;
    currency: string;
    durationMinutes: number;
};

type TutorAvailability = {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
};

type TutorListItem = {
    id: string;
    bio?: string;
    experienceYears?: number;
    user: {
        email: string;
    };
    subjects: {
        id: string;
        subject: {
            name: string;
        };
    }[];
    pricing: TutorPricing[];
    availability: TutorAvailability[];
    score?: number;
    explanation?: string;
    breakdown?: Record<string, number>;
};

type Booking = {
    id: string;
    tutorId: string;
    startTime: string;
    endTime: string;
    status: string;
    tutor: {
        user: {
            email: string;
        };
    };
};

type TutorRequest = {
    id: string;
    tutorId: string;
    status: string;
    createdAt: string;
    tutor: {
        user: {
            email: string;
        };
    };
};

type Conversation = {
    id: string;
    status: string;
    createdAt: string;
    participants: {
        id: string;
        email: string;
        role: string;
    }[];
    latestMessage?: {
        content: string;
        createdAt: string;
    } | null;
};

type Message = {
    id: string;
    content: string;
    createdAt: string;
    sender: {
        id: string;
        email: string;
        role: string;
    };
};

export default function StudentDashboardClient({ session }: { session: any }) {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<"tutors" | "bookings" | "chat">("tutors");

    // Profile states
    const [profileAge, setProfileAge] = useState<number | null>(null);
    const [independentEligible, setIndependentEligible] = useState(false);

    // Tutor recommendations states
    const [tutors, setTutors] = useState<TutorListItem[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [loadingTutors, setLoadingTutors] = useState(true);
    const [tutorQueryMsg, setTutorQueryMsg] = useState("");
    const [explainTutor, setExplainTutor] = useState<TutorListItem | null>(null);

    // Booking states
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [acceptedRequests, setAcceptedRequests] = useState<TutorRequest[]>([]);

    // Book a class form
    const [selectedRequest, setSelectedRequest] = useState<TutorRequest | null>(null);
    const [bookDate, setBookDate] = useState("");
    const [bookStartTime, setBookStartTime] = useState("09:00");
    const [bookEndTime, setBookEndTime] = useState("10:00");
    const [bookingError, setBookingError] = useState("");

    // Review states
    const [reviewTutor, setReviewTutor] = useState<TutorListItem | null>(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [reviewMsg, setReviewMsg] = useState("");

    // Conversations states
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingChats, setLoadingChats] = useState(true);
    const [newMessage, setNewMessage] = useState("");

    // Load initial datasets
    useEffect(() => {
        fetchProfile();
        loadSubjects();
        loadTutors("");
        fetchBookings();
        fetchConversations();
    }, []);

    async function fetchProfile() {
        try {
            const res = await fetch("/api/student/profile");
            const data = await res.json();
            if (data.success && data.profile) {
                setIndependentEligible(data.profile.independentRequestEligible);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function loadSubjects() {
        try {
            const res = await fetch("/api/subjects");
            const data = await res.json();
            if (res.ok) {
                setSubjects(data.subjects || []);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function loadTutors(subject = "") {
        try {
            setLoadingTutors(true);
            setTutorQueryMsg("");
            const url = subject ? `/api/tutors?subject=${encodeURIComponent(subject)}` : "/api/tutors";
            const res = await fetch(url);
            const data = await res.json();
            if (res.ok) {
                setTutors(data.tutors || []);
            } else {
                setTutorQueryMsg(data.message || "Failed to load tutor list.");
            }
        } catch (e) {
            console.error(e);
            setTutorQueryMsg("Failed to load tutors.");
        } finally {
            setLoadingTutors(false);
        }
    }

    async function fetchBookings() {
        try {
            setLoadingBookings(true);
            const res = await fetch("/api/student/bookings");
            const data = await res.json();
            if (res.ok && data.success) {
                setBookings(data.bookings || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingBookings(false);
        }

        // Also fetch accepted requests to fuel the booking scheduling dropdown
        try {
            const res = await fetch("/api/tutor/requests"); // lists tutor requests
            const data = await res.json();
            if (data.success) {
                const accepted = (data.requests || []).filter((r: any) => r.status === "ACCEPTED");
                setAcceptedRequests(accepted);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function fetchConversations() {
        try {
            setLoadingChats(true);
            const res = await fetch("/api/conversations");
            const data = await res.json();
            if (data.success) {
                setConversations(data.conversations || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingChats(false);
        }
    }

    async function handleSubjectChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const subject = event.target.value;
        setSelectedSubject(subject);
        await loadTutors(subject);
    }

    async function sendRequest(tutorId: string) {
        if (!independentEligible) {
            alert("Security Alert: You are under age 16 and cannot send independent requests. Your parent must submit the tutor request on your behalf.");
            return;
        }

        const msg = window.prompt("Write a short message to this tutor (e.g. subjects needing help, timing):");
        if (msg === null) return;

        try {
            const res = await fetch("/api/student/tutor-requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tutorId, message: msg })
            });
            const data = await res.json();
            if (res.ok) {
                alert("Request sent successfully! A chat channel will unlock once the tutor accepts.");
            } else {
                alert(data.message || "Failed to send request.");
            }
        } catch (e) {
            console.error(e);
            alert("Something went wrong while sending request.");
        }
    }

    async function handleScheduleBooking(e: React.FormEvent) {
        e.preventDefault();
        setBookingError("");
        if (!selectedRequest || !bookDate) {
            setBookingError("Please select a request record and a session date.");
            return;
        }

        const startTime = new Date(`${bookDate}T${bookStartTime}:00`);
        const endTime = new Date(`${bookDate}T${bookEndTime}:00`);

        try {
            const res = await fetch("/api/student/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    requestId: selectedRequest.id,
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                alert("Tutoring class scheduled successfully!");
                setSelectedRequest(null);
                fetchBookings();
            } else {
                setBookingError(data.message || "Failed to schedule session.");
            }
        } catch (err) {
            console.error(err);
            setBookingError("Failed to book session.");
        }
    }

    async function submitTutorReview(e: React.FormEvent) {
        e.preventDefault();
        setReviewMsg("");
        if (!reviewTutor) return;

        try {
            const res = await fetch("/api/student/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tutorId: reviewTutor.id,
                    studentId: session?.user?.id, // Handled automatically by session logic API
                    rating: reviewRating,
                    comment: reviewComment,
                })
            });
            const data = await res.json();
            if (res.ok) {
                setReviewMsg("Thank you! Review submitted and published.");
                setTimeout(() => {
                    setReviewTutor(null);
                    setReviewComment("");
                }, 1500);
            } else {
                setReviewMsg(data.message || "Failed to submit review.");
            }
        } catch (err) {
            console.error(err);
            setReviewMsg("Failed to submit rating.");
        }
    }

    // Chats logic identical to parent
    async function handleSelectConv(conv: Conversation) {
        setSelectedConv(conv);
        setMessages([]);
        try {
            const res = await fetch(`/api/conversations/${conv.id}/messages`);
            const data = await res.json();
            if (data.success) {
                setMessages(data.messages || []);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function handleSendMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedConv || !newMessage.trim()) return;

        try {
            const res = await fetch(`/api/conversations/${selectedConv.id}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newMessage.trim() })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setMessages((prev) => [...prev, data.messageDetails]);
                setNewMessage("");
                fetchConversations();
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            {/* Header Nav */}
            <div className="border-b border-slate-900 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white">
                        L
                    </div>
                    <span className="font-bold text-lg text-white">LearnBridge Student Suite</span>
                </div>
                <div className="flex items-center gap-6">
                    <span className="text-xs text-slate-400">Student: {session?.user?.email}</span>
                    <button
                        onClick={() => router.push("/api/auth/signout")}
                        className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Content grid */}
            <div className="flex flex-1 flex-col md:flex-row max-w-7xl w-full mx-auto p-6 gap-6">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex flex-col gap-2">
                    <button
                        onClick={() => setActiveTab("tutors")}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${activeTab === "tutors"
                                ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10"
                                : "bg-slate-900/30 border-slate-900 text-slate-400 hover:text-white hover:bg-slate-900/50"
                            }`}
                    >
                        🔍 AI-Powered Tutor Matches
                    </button>
                    <button
                        onClick={() => setActiveTab("bookings")}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${activeTab === "bookings"
                                ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10"
                                : "bg-slate-900/30 border-slate-900 text-slate-400 hover:text-white hover:bg-slate-900/50"
                            }`}
                    >
                        🗓️ My Bookings & Schedule
                    </button>
                    <button
                        onClick={() => setActiveTab("chat")}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${activeTab === "chat"
                                ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10"
                                : "bg-slate-900/30 border-slate-900 text-slate-400 hover:text-white hover:bg-slate-900/50"
                            }`}
                    >
                        💬 Tutors Messenger
                    </button>

                    {/* Age Alert */}
                    <div className="mt-4 p-4 rounded-xl bg-slate-900/20 border border-slate-900 text-[11px] text-slate-400 leading-relaxed">
                        {!independentEligible ? (
                            <span>⚠️ <strong>Minor Guard Active:</strong> You are under age 16. You can review recommendations, but submitting requests requires a parent account request.</span>
                        ) : (
                            <span>✓ <strong>Independent Mode:</strong> You are 16+ and eligible to submit direct tutoring requests independently.</span>
                        )}
                    </div>
                </div>

                {/* Main Content Pane */}
                <div className="flex-1 bg-slate-900/30 border border-slate-900 rounded-2xl p-6 relative">
                    {/* Tab 1: AI Recommendation Matches */}
                    {activeTab === "tutors" && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-white font-sans">Find Your Tutor Match</h2>
                                    <p className="text-slate-400 text-xs mt-1">Weighted matching scores calculate compatibility out of 100%</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <label htmlFor="subject-filter" className="text-xs text-slate-400">Subject</label>
                                    <select
                                        id="subject-filter"
                                        value={selectedSubject}
                                        onChange={handleSubjectChange}
                                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                                    >
                                        <option value="">All Subjects</option>
                                        {subjects.map((sub) => (
                                            <option key={sub.id} value={sub.name}>{sub.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {tutorQueryMsg && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-700 p-4 rounded-xl text-xs">{tutorQueryMsg}</div>
                            )}

                            {loadingTutors ? (
                                <p className="text-slate-500 text-xs">Matching tutors...</p>
                            ) : tutors.length === 0 ? (
                                <div className="text-center py-10 bg-slate-900/10 border border-dashed border-slate-900 rounded-xl">
                                    <p className="text-slate-500 text-xs">No tutors found corresponding to criteria.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {tutors.map((tutor) => (
                                        <div key={tutor.id} className="p-5 rounded-xl border border-slate-900 bg-slate-900/25 flex flex-col justify-between space-y-4">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className="font-bold text-sm text-white">Tutor Profile</span>
                                                        <p className="text-[10px] text-slate-500">{tutor.user?.email}</p>
                                                    </div>
                                                    {tutor.score !== undefined && (
                                                        <button
                                                            onClick={() => setExplainTutor(tutor)}
                                                            className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 border border-indigo-500/20 px-2 py-1 rounded text-[10px] font-bold text-indigo-400 cursor-pointer"
                                                            title="Click to view transparent score explanation"
                                                        >
                                                            ⭐ {tutor.score}% Match
                                                        </button>
                                                    )}
                                                </div>

                                                <p className="text-xs text-slate-400 line-clamp-3 mt-3">{tutor.bio || "No summary biography provided."}</p>

                                                <div className="flex flex-wrap gap-1.5 mt-3">
                                                    {tutor.subjects.map((sub) => (
                                                        <span key={sub.id} className="px-2 py-0.5 rounded-full border border-slate-800 bg-slate-950 text-[10px] text-slate-400">{sub.subject.name}</span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
                                                <div>
                                                    <span className="block text-[8px] uppercase text-slate-500">Hourly Rate</span>
                                                    <span className="text-xs font-bold text-white">
                                                        {tutor.pricing?.[0] ? `${tutor.pricing[0].amount} ${tutor.pricing[0].currency}` : "N/A"}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => sendRequest(tutor.id)}
                                                    className="bg-indigo-650 hover:bg-slate-950 font-bold text-xs text-white px-3.5 py-1.5 rounded-lg active:scale-95 transition-transform"
                                                >
                                                    Request Match
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Score Explanation Modal */}
                            {explainTutor && (
                                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50 animate-fadeIn">
                                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
                                        <h3 className="font-bold text-white">Transparent Match Breakdown</h3>
                                        <p className="text-xs text-slate-400">Understand how LearnBridge calculated the {explainTutor.score}% score:</p>

                                        <div className="space-y-2.5 max-h-60 overflow-y-auto text-xs bg-slate-950 p-4 rounded-xl border border-slate-900">
                                            {explainTutor.explanation?.split("\n").map((line, idx) => (
                                                <p key={idx} className="leading-relaxed text-slate-300 font-mono text-[11px]">{line}</p>
                                            ))}
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <button
                                                onClick={() => setExplainTutor(null)}
                                                className="bg-indigo-650 hover:bg-slate-950 font-bold text-xs text-white px-4 py-2 rounded-lg"
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 2: Bookies and review completed slots */}
                    {activeTab === "bookings" && (
                        <div className="space-y-8 animate-fadeIn">
                            {/* Schedule form (only if student has accepted requests) */}
                            {acceptedRequests.length > 0 && (
                                <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-900 space-y-4">
                                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Schedule Tutoring Class Session</h3>
                                    <form onSubmit={handleScheduleBooking} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="col-span-1 md:col-span-2">
                                                <label className="block text-[10px] font-semibold text-slate-400 mb-1">Approved Request Connection</label>
                                                <select
                                                    value={selectedRequest?.id || ""}
                                                    onChange={(e) => {
                                                        const req = acceptedRequests.find(r => r.id === e.target.value);
                                                        setSelectedRequest(req || null);
                                                    }}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                                                >
                                                    <option value="">-- Choose Accepted Tutor --</option>
                                                    {acceptedRequests.map((r) => (
                                                        <option key={r.id} value={r.id}>{r.tutor?.user?.email} (Accepted)</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-slate-400 mb-1">Class Date</label>
                                                <input
                                                    type="date"
                                                    value={bookDate}
                                                    onChange={(e) => setBookDate(e.target.value)}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white scheme-dark"
                                                />
                                            </div>
                                            <div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="block text-[9px] font-semibold text-slate-405 mb-1">Start</label>
                                                        <input
                                                            type="text"
                                                            value={bookStartTime}
                                                            onChange={(e) => setBookStartTime(e.target.value)}
                                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                                                            placeholder="09:00"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[9px] font-semibold text-slate-405 mb-1">End</label>
                                                        <input
                                                            type="text"
                                                            value={bookEndTime}
                                                            onChange={(e) => setBookEndTime(e.target.value)}
                                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                                                            placeholder="10:00"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {bookingError && (
                                            <p className="text-xs text-red-400 font-semibold">{bookingError}</p>
                                        )}

                                        <button
                                            type="submit"
                                            className="bg-indigo-600 hover:bg-slate-950 font-bold text-xs text-white px-4 py-2 rounded-lg active:scale-95 transition-transform"
                                        >
                                            Book Confirm Slot
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Bookings listings */}
                            <div>
                                <h3 className="text-sm font-bold text-white mb-3">Your Booked Classes</h3>
                                {loadingBookings ? (
                                    <p className="text-slate-500 text-xs">Loading schedules...</p>
                                ) : bookings.length === 0 ? (
                                    <p className="text-slate-500 text-xs italic">No book slots created. Coordinate accepted request times with your tutor.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {bookings.map((booking) => (
                                            <div key={booking.id} className="p-4 rounded-xl border border-slate-900 bg-slate-900/15 flex items-center justify-between">
                                                <div>
                                                    <span className="font-bold text-xs text-white block">Session with {booking.tutor?.user?.email}</span>
                                                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                                                        Start: {new Date(booking.startTime).toLocaleString()} — End: {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${booking.status === "COMPLETED"
                                                            ? "bg-green-500/10 text-green-400"
                                                            : booking.status === "CONFIRMED"
                                                                ? "bg-blue-500/10 text-blue-400"
                                                                : "bg-slate-800 text-slate-500"
                                                        }`}>
                                                        {booking.status}
                                                    </span>

                                                    {/* If Booking is COMPLETED, allow review submission */}
                                                    {booking.status === "COMPLETED" && (
                                                        <button
                                                            onClick={() => {
                                                                setReviewTutor({
                                                                    id: booking.tutorId,
                                                                    user: { email: booking.tutor?.user?.email }
                                                                } as any);
                                                                setReviewRating(5);
                                                                setReviewMsg("");
                                                            }}
                                                            className="text-xs bg-indigo-600/20 hover:bg-indigo-650 px-2.5 py-1 rounded text-indigo-400 hover:text-white font-semibold transition-colors"
                                                        >
                                                            Rate Tutor
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Write Review Modal */}
                            {reviewTutor && (
                                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50 animate-fadeIn">
                                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl">
                                        <h3 className="font-bold text-white">Rate Your Tutors</h3>
                                        <p className="text-xs text-slate-400">Provide direct feedback for completed classes with {reviewTutor.user?.email}</p>

                                        <form onSubmit={submitTutorReview} className="space-y-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Rating (1 to 5 Stars)</label>
                                                <div className="flex gap-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            type="button"
                                                            key={star}
                                                            onClick={() => setReviewRating(star)}
                                                            className={`text-xl focus:outline-none transition-colors ${star <= reviewRating ? "text-yellow-400" : "text-slate-600"
                                                                }`}
                                                        >
                                                            ★
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Feedback Comment</label>
                                                <textarea
                                                    value={reviewComment}
                                                    onChange={(e) => setReviewComment(e.target.value)}
                                                    placeholder="Tutor was patient and explained trigonometry clearly..."
                                                    rows={3}
                                                    required
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-650"
                                                />
                                            </div>

                                            {reviewMsg && (
                                                <p className="text-xs text-indigo-400 font-semibold">{reviewMsg}</p>
                                            )}

                                            <div className="flex gap-3 justify-end pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setReviewTutor(null)}
                                                    className="px-4 py-2 border border-slate-800 font-semibold text-xs rounded-lg text-slate-400 hover:text-white"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="bg-indigo-600 hover:bg-slate-950 font-semibold text-xs text-white px-4 py-2 rounded-lg"
                                                >
                                                    Submit Review
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 3: Messenger (Inbox) */}
                    {activeTab === "chat" && (
                        <div className="h-[550px] flex flex-col md:flex-row gap-6 animate-fadeIn">
                            {/* Conversations Side Scroll panel */}
                            <div className="w-full md:w-64 border-r border-slate-900 pr-5 flex flex-col gap-3 overflow-y-auto">
                                <h3 className="font-bold text-xs text-indigo-400 uppercase tracking-widest mb-1">My Class Charts</h3>
                                {loadingChats ? (
                                    <p className="text-slate-500 text-xs">Loading conversations...</p>
                                ) : conversations.length === 0 ? (
                                    <p className="text-slate-500 text-xs italic">No active conversations found. Chats unlock once a tutor accepts your request invitation.</p>
                                ) : (
                                    conversations.map((conv) => (
                                        <div
                                            key={conv.id}
                                            onClick={() => handleSelectConv(conv)}
                                            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${selectedConv?.id === conv.id
                                                    ? "bg-slate-900 border-indigo-500/80 text-white"
                                                    : "bg-slate-900/10 border-slate-900 hover:border-slate-800 text-slate-400 hover:text-white"
                                                }`}
                                        >
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold truncate max-w-[120px]">
                                                    Chat with {conv.participants.find(p => p.role === "TUTOR")?.email || "Tutor"}
                                                </span>
                                                <span className={`text-[9px] px-1 py-0.2 rounded font-semibold ${conv.status === "OPEN" ? "bg-green-500/10 text-green-400" : "bg-slate-850 text-slate-550"
                                                    }`}>
                                                    {conv.status}
                                                </span>
                                            </div>
                                            {conv.latestMessage && (
                                                <p className="text-[11px] text-slate-500 truncate mt-1">{conv.latestMessage.content}</p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Active Message Board */}
                            <div className="flex-1 flex flex-col justify-between h-full bg-slate-950/20 rounded-xl overflow-hidden border border-slate-900">
                                {selectedConv ? (
                                    <>
                                        {/* Chat bar header */}
                                        <div className="p-4 border-b border-slate-900 bg-slate-900/20">
                                            <p className="text-xs font-bold text-white">
                                                Chat with {selectedConv.participants.find(p => p.role === "TUTOR")?.email || "Tutor"}
                                            </p>
                                            <p className="text-[10px] text-slate-500 mt-0.5">Status: {selectedConv.status}</p>
                                        </div>

                                        {/* Scroll Panel */}
                                        <div className="flex-grow p-4 overflow-y-auto space-y-3 flex flex-col">
                                            {messages.length === 0 ? (
                                                <p className="text-slate-500 text-xs text-center my-auto">Start the conversation below.</p>
                                            ) : (
                                                messages.map((m) => {
                                                    const isMe = m.sender?.id === session?.user?.id;
                                                    return (
                                                        <div
                                                            key={m.id}
                                                            className={`max-w-[70%] p-3 rounded-2xl text-xs leading-relaxed ${isMe
                                                                    ? "bg-indigo-650 text-white rounded-br-none self-end ml-auto"
                                                                    : "bg-slate-900 border border-slate-800 text-slate-300 rounded-bl-none self-start mr-auto"
                                                                }`}
                                                        >
                                                            {!isMe && (
                                                                <span className="block text-[9px] text-slate-500 font-semibold mb-1 uppercase">
                                                                    {m.sender.role}
                                                                </span>
                                                            )}
                                                            <p>{m.content}</p>
                                                            <span className="block text-[8px] text-right text-slate-500/80 mt-1">
                                                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>

                                        {/* Input sender */}
                                        <div className="p-3 border-t border-slate-900 bg-slate-900/15">
                                            {selectedConv.status === "OPEN" ? (
                                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={newMessage}
                                                        onChange={(e) => setNewMessage(e.target.value)}
                                                        placeholder="Write a message to tutor..."
                                                        className="flex-grow bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="bg-indigo-600 hover:bg-slate-950 font-bold text-xs text-white px-4 py-2 rounded-lg"
                                                    >
                                                        Send
                                                    </button>
                                                </form>
                                            ) : (
                                                <div className="text-center py-2 bg-slate-955/20 text-[10px] text-slate-500">
                                                    🔒 This conversation is archived/closed and is read-only.
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-500 text-xs">
                                        <span>💬</span>
                                        <span className="mt-2">Select an active chat log from the list to start exchanging messages.</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
