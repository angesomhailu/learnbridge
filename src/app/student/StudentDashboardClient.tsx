
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Search,
    Calendar,
    MessageSquare,
    Target,
    BookOpen,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    Star,
    ArrowRight,
    X,
    Filter,
    LayoutDashboard,
    Users,
    ClipboardList,
    UserCircle,
    Settings,
    Menu,
    Bell,
    ChevronRight,
    Clock3,
    CheckCircle2,
    CircleAlert,
} from "lucide-react";

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
    score?: number;
    explanation?: string;
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

export default function StudentDashboardClient({
    session,
}: {
    session: any;
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Profile / eligibility
    const [independentEligible, setIndependentEligible] = useState(true);

    // Tutor data
    const [tutors, setTutors] = useState<TutorListItem[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [loadingTutors, setLoadingTutors] = useState(true);
    const [explainTutor, setExplainTutor] =
        useState<TutorListItem | null>(null);

    // Dashboard data
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [requests, setRequests] = useState<TutorRequest[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [goalsCount, setGoalsCount] = useState(0);

    useEffect(() => {
        fetchProfile();
        loadSubjects();
        loadTutors("");
        fetchDashboardOverviewData();
    }, []);

    async function fetchProfile() {
        try {
            const res = await fetch("/api/student/profile");
            const data = await res.json();

            if (data.success && data.profile) {
                setIndependentEligible(
                    data.profile.independentRequestEligible
                );
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    }

    async function loadSubjects() {
        try {
            const res = await fetch("/api/subjects");
            const data = await res.json();

            if (res.ok) {
                setSubjects(data.subjects || []);
            }
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    }

    async function loadTutors(subject = "") {
        try {
            setLoadingTutors(true);

            const url = subject
                ? `/api/tutors?subject=${encodeURIComponent(subject)}`
                : "/api/tutors";

            const res = await fetch(url);
            const data = await res.json();

            if (res.ok) {
                setTutors(data.tutors || []);
            }
        } catch (error) {
            console.error("Error fetching tutors:", error);
        } finally {
            setLoadingTutors(false);
        }
    }

    async function fetchDashboardOverviewData() {
        try {
            const [bRes, rRes, cRes, gRes] = await Promise.all([
                fetch("/api/student/bookings"),
                fetch("/api/student/tutor-requests"),
                fetch("/api/conversations"),
                fetch("/api/student/goals"),
            ]);

            const bData = await bRes.json();
            const rData = await rRes.json();
            const cData = await cRes.json();
            const gData = await gRes.json();

            if (bRes.ok && bData.success) {
                setBookings(bData.bookings || []);
            }

            if (rRes.ok && rData.success) {
                setRequests(rData.requests || []);
            }

            if (cRes.ok && cData.success) {
                setConversations(cData.conversations || []);
            }

            if (gRes.ok && gData.success) {
                setGoalsCount((gData.goals || []).length);
            }
        } catch (error) {
            console.error(
                "Error fetching dashboard overview data:",
                error
            );
        }
    }

    async function sendRequest(tutorId: string) {
        if (!independentEligible) {
            alert(
                "Security Restriction: You are under 16. Your parent/guardian must submit tutor requests on your behalf."
            );
            return;
        }

        const msg = window.prompt(
            "Write a short message to this tutor (e.g. subjects needing help, timing preference):"
        );

        if (msg === null) return;

        try {
            const res = await fetch("/api/student/tutor-requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tutorId,
                    message: msg,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                alert(
                    "Tutor request sent successfully! Once accepted, messaging and scheduling unlock."
                );

                fetchDashboardOverviewData();
            } else {
                alert(data.message || "Failed to send request.");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong while sending request.");
        }
    }

    const pendingRequests = requests.filter(
        (request) => request.status === "PENDING"
    );

    const acceptedRequests = requests.filter(
        (request) => request.status === "ACCEPTED"
    );

    const upcomingBookings = bookings.filter(
        (booking) =>
            booking.status === "CONFIRMED" ||
            booking.status === "PENDING"
    );

    const studentName =
        session?.user?.email?.split("@")[0] || "Student";

    function formatDate(date: string) {
        try {
            return new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return date;
        }
    }

    function formatTime(date: string) {
        try {
            return new Date(date).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
            });
        } catch {
            return "";
        }
    }

    return (
        <div className="min-h-screen bg-[#e5e9ee] text-slate-800">

            <div className="flex min-h-screen">

                {/* =====================================================
                    MAIN APPLICATION
                ===================================================== */}
                <div className="min-w-0 flex-1">
                    {/* =================================================
                        PAGE CONTENT
                    ================================================= */}
                    <main className="p-4 sm:p-6 xl:p-8">

                        {/* Welcome heading */}
                        <section className="mb-6">
                            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                                <div>
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                                        Student Learning Center
                                    </p>

                                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                        Welcome back, {session?.user?.name || "Student"}
                                    </h2>

                                    <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                                        Find the right tutor, manage your
                                        learning requests, and keep track of
                                        your upcoming learning activities.
                                    </p>
                                </div>

                                <Link
                                    href="#tutor-matches"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-800"
                                >
                                    <Search className="h-4 w-4" />
                                    Find a Tutor
                                </Link>
                            </div>
                        </section>

                        {/* =================================================
                            SECURITY / ACCOUNT STATUS
                        ================================================= */}
                        <section className="mb-6">
                            {independentEligible ? (
                                <div className="flex flex-col gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 rounded-lg bg-emerald-100 p-2 text-emerald-700">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold text-emerald-900">
                                                Independent Learning Mode
                                                Active
                                            </p>

                                            <p className="mt-0.5 text-[11px] leading-5 text-emerald-800">
                                                You can submit tutor requests
                                                directly and communicate with
                                                tutors according to your
                                                account permissions.
                                            </p>
                                        </div>
                                    </div>

                                    <span className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-white px-3 py-1 text-[10px] font-bold text-emerald-700">
                                        Direct Requests Enabled
                                    </span>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 rounded-lg bg-amber-100 p-2 text-amber-700">
                                            <ShieldAlert className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold text-amber-900">
                                                Parent Request Mode
                                            </p>

                                            <p className="mt-0.5 text-[11px] leading-5 text-amber-800">
                                                Your account requires a
                                                parent to submit
                                                tutor requests on your behalf.
                                            </p>
                                        </div>
                                    </div>

                                    <span className="inline-flex w-fit items-center rounded-full border border-amber-200 bg-white px-3 py-1 text-[10px] font-bold text-amber-700">
                                        Parent Approval Required
                                    </span>
                                </div>
                            )}
                        </section>

                        {/* =================================================
                            STATISTICS
                        ================================================= */}
                        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <StatCard
                                title="Tutor Requests"
                                value={requests.length}
                                description={`${acceptedRequests.length} accepted • ${pendingRequests.length} pending`}
                                href="/student/requests"
                                icon={<Search className="h-5 w-5" />}
                                iconClass="bg-blue-50 text-blue-700"
                            />

                            <StatCard
                                title="Booked Sessions"
                                value={bookings.length}
                                description={`${upcomingBookings.length} upcoming classes`}
                                href="/student/bookings"
                                icon={<Calendar className="h-5 w-5" />}
                                iconClass="bg-emerald-50 text-emerald-700"
                            />

                            <StatCard
                                title="Conversations"
                                value={conversations.length}
                                description="Tutor messaging available"
                                href="/student/messages"
                                icon={
                                    <MessageSquare className="h-5 w-5" />
                                }
                                iconClass="bg-indigo-50 text-indigo-700"
                            />

                            <StatCard
                                title="Learning Goals"
                                value={goalsCount}
                                description="Milestones being tracked"
                                href="/student/goals"
                                icon={<Target className="h-5 w-5" />}
                                iconClass="bg-violet-50 text-violet-700"
                            />
                        </section>

                        {/* =================================================
                            MAIN GRID
                        ================================================= */}
                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                            {/* =================================================
                                TUTOR MATCHES
                            ================================================= */}
                            <section
                                id="tutor-matches"
                                className="min-w-0"
                            >
                                <div className="rounded-xl border border-slate-300 bg-[#f7f8fa]">
                                    {/* Section Header */}
                                    <div className="flex flex-col gap-4 border-b border-slate-300 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">


                                                <h3 className="text-sm font-bold text-slate-900">
                                                    Tutor Matches
                                                </h3>
                                            </div>

                                            <p className="mt-1 text-[11px] leading-5 text-slate-500">
                                                Tutors are ranked using your
                                                learning needs, subjects,
                                                availability, pricing, and
                                                matching criteria.
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2">
                                            <Filter className="h-4 w-4 text-slate-400" />

                                            <select
                                                value={selectedSubject}
                                                onChange={(event) => {
                                                    const value =
                                                        event.target.value;

                                                    setSelectedSubject(value);
                                                    loadTutors(value);
                                                }}
                                                className="max-w-[180px] bg-transparent text-xs font-semibold text-slate-700 outline-none"
                                            >
                                                <option value="">
                                                    All Subjects
                                                </option>

                                                {subjects.map((subject) => (
                                                    <option
                                                        key={subject.id}
                                                        value={subject.name}
                                                    >
                                                        {subject.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Tutor Cards */}
                                    <div className="p-5">
                                        {loadingTutors ? (
                                            <div className="flex min-h-[260px] items-center justify-center">
                                                <div className="text-center">
                                                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-700 border-t-transparent" />

                                                    <p className="mt-3 text-xs font-medium text-slate-500">
                                                        Finding suitable
                                                        tutors...
                                                    </p>
                                                </div>
                                            </div>
                                        ) : tutors.length === 0 ? (
                                            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
                                                <BookOpen className="h-10 w-10 text-slate-300" />

                                                <p className="mt-3 text-sm font-bold text-slate-700">
                                                    No tutors found
                                                </p>

                                                <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                                                    No tutors match the selected
                                                    subject. Try another
                                                    subject or clear the
                                                    filter.
                                                </p>

                                                {selectedSubject && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedSubject(
                                                                ""
                                                            );
                                                            loadTutors("");
                                                        }}
                                                        className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                                    >
                                                        Clear Filter
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="grid gap-4 md:grid-cols-2">
                                                {tutors.map((tutor) => (
                                                    <TutorCard
                                                        key={tutor.id}
                                                        tutor={tutor}
                                                        onExplain={() =>
                                                            setExplainTutor(
                                                                tutor
                                                            )
                                                        }
                                                        onRequest={() =>
                                                            sendRequest(
                                                                tutor.id
                                                            )
                                                        }
                                                        independentEligible={
                                                            independentEligible
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* =================================================
                                RIGHT COLUMN
                            ================================================= */}
                            <aside className="space-y-6">
                                {/* Quick Actions */}

                                {/* Upcoming Sessions */}
                                <section className="rounded-xl border border-slate-300 bg-[#f7f8fa]">
                                    <div className="flex items-center justify-between border-b border-slate-300 px-5 py-4">
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900">
                                                Upcoming Sessions
                                            </h3>

                                            <p className="mt-1 text-[10px] text-slate-500">
                                                Your scheduled learning
                                                activities
                                            </p>
                                        </div>

                                        <Calendar className="h-4 w-4 text-blue-700" />
                                    </div>

                                    <div className="p-4">
                                        {upcomingBookings.length === 0 ? (
                                            <div className="py-5 text-center">
                                                <Clock3 className="mx-auto h-7 w-7 text-slate-300" />

                                                <p className="mt-2 text-xs font-semibold text-slate-600">
                                                    No upcoming sessions
                                                </p>

                                                <p className="mt-1 text-[10px] text-slate-400">
                                                    Book a tutor session to see
                                                    it here.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {upcomingBookings
                                                    .slice(0, 3)
                                                    .map((booking) => (
                                                        <div
                                                            key={booking.id}
                                                            className="rounded-lg border border-slate-200 bg-white p-3"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                                                                    <Calendar className="h-4 w-4" />
                                                                </div>

                                                                <div className="min-w-0 flex-1">
                                                                    <p className="truncate text-xs font-bold text-slate-800">
                                                                        {booking
                                                                            .tutor
                                                                            ?.user
                                                                            ?.email ||
                                                                            "Tutor"}
                                                                    </p>

                                                                    <p className="mt-1 text-[10px] text-slate-500">
                                                                        {formatDate(
                                                                            booking.startTime
                                                                        )}
                                                                    </p>

                                                                    <p className="mt-0.5 text-[10px] font-semibold text-blue-700">
                                                                        {formatTime(
                                                                            booking.startTime
                                                                        )}{" "}
                                                                        –{" "}
                                                                        {formatTime(
                                                                            booking.endTime
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}

                                                <Link
                                                    href="/student/bookings"
                                                    className="flex items-center justify-center gap-1 pt-1 text-[11px] font-bold text-blue-700 hover:text-blue-800"
                                                >
                                                    View all bookings
                                                    <ArrowRight className="h-3 w-3" />
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </aside>
                        </div>

                        {/* =================================================
                            RECENT ACTIVITY
                        ================================================= */}
                        <section className="mt-6 rounded-xl border border-slate-300 bg-[#f7f8fa]">
                            <div className="flex items-center justify-between border-b border-slate-300 px-5 py-4">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Learning Activity
                                    </h3>

                                    <p className="mt-1 text-[10px] text-slate-500">
                                        Recent activity from your LearnBridge
                                        account
                                    </p>
                                </div>

                                <TrendingIcon />
                            </div>

                            <div className="grid grid-cols-1 divide-y divide-slate-200 md:grid-cols-3 md:divide-x md:divide-y-0">
                                <ActivityItem
                                    icon={
                                        <ClipboardList className="h-4 w-4" />
                                    }
                                    title="Tutor Requests"
                                    value={`${requests.length} total`}
                                    description={
                                        pendingRequests.length > 0
                                            ? `${pendingRequests.length} awaiting response`
                                            : "No pending requests"
                                    }
                                />

                                <ActivityItem
                                    icon={
                                        <MessageSquare className="h-4 w-4" />
                                    }
                                    title="Conversations"
                                    value={`${conversations.length} active`}
                                    description="Keep in touch with tutors"
                                />

                                <ActivityItem
                                    icon={
                                        <Target className="h-4 w-4" />
                                    }
                                    title="Learning Goals"
                                    value={`${goalsCount} goals`}
                                    description="Continue building your progress"
                                />
                            </div>
                        </section>


                    </main>
                </div>
            </div>

            {/* =============================================================
                MATCH SCORE MODAL
            ============================================================= */}
            {explainTutor && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-xl border border-slate-300 bg-[#f7f8fa] shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-300 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                                    <Sparkles className="h-5 w-5" />
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Match Score Explanation
                                    </h3>

                                    <p className="mt-0.5 text-[10px] text-slate-500">
                                        Transparent AI-assisted recommendation
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setExplainTutor(null)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="max-h-[65vh] overflow-y-auto p-5">
                            <div className="rounded-lg border border-slate-200 bg-white p-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                                            Recommended Tutor
                                        </p>

                                        <p className="mt-1 truncate text-sm font-bold text-slate-900">
                                            {explainTutor.user?.email}
                                        </p>
                                    </div>

                                    {explainTutor.score !== undefined && (
                                        <div className="flex-shrink-0 rounded-lg bg-blue-50 px-3 py-2 text-center">
                                            <p className="text-lg font-extrabold text-blue-700">
                                                {explainTutor.score}%
                                            </p>

                                            <p className="text-[9px] font-bold uppercase text-blue-600">
                                                Match
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    Calculation Breakdown
                                </p>

                                <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 font-mono text-[11px] leading-6 text-slate-700">
                                    {explainTutor.explanation ? (
                                        explainTutor.explanation
                                            .split("\n")
                                            .map((line, index) => (
                                                <p key={index}>{line}</p>
                                            ))
                                    ) : (
                                        <p className="text-slate-500">
                                            No detailed explanation is
                                            available for this recommendation.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end border-t border-slate-300 px-5 py-4">
                            <button
                                onClick={() => setExplainTutor(null)}
                                className="rounded-lg bg-blue-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-800"
                            >
                                Close Breakdown
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* =============================================================
   SIDEBAR NAVIGATION
============================================================= */

function SidebarNavigation({
    mobile = false,
    closeMenu,
}: {
    mobile?: boolean;
    closeMenu?: () => void;
}) {
    const mainItems = [
        {
            href: "/student",
            label: "Dashboard",
            icon: LayoutDashboard,
        },
        {
            href: "/student/tutors",
            label: "Find Tutors",
            icon: Users,
        },
        {
            href: "/student/requests",
            label: "Tutor Requests",
            icon: ClipboardList,
        },
        {
            href: "/student/bookings",
            label: "Bookings",
            icon: Calendar,
        },
        {
            href: "/student/messages",
            label: "Messages",
            icon: MessageSquare,
        },
        {
            href: "/student/goals",
            label: "Learning Goals",
            icon: Target,
        },
    ];

    const accountItems = [
        {
            href: "/student/profile",
            label: "My Profile",
            icon: UserCircle,
        },
        {
            href: "/student/settings",
            label: "Settings",
            icon: Settings,
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Learning
                </p>

                <nav className="space-y-1">
                    {mainItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeMenu}
                                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${item.href === "/student"
                                    ? "bg-blue-700 text-white shadow-sm"
                                    : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                                    }`}
                            >
                                <Icon
                                    className={`h-4 w-4 ${item.href === "/student"
                                        ? "text-white"
                                        : "text-slate-400 group-hover:text-blue-700"
                                        }`}
                                />

                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div>
                <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Account
                </p>

                <nav className="space-y-1">
                    {accountItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeMenu}
                                className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
                            >
                                <Icon className="h-4 w-4 text-slate-400 group-hover:text-blue-700" />

                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}

/* =============================================================
   STAT CARD
============================================================= */

function StatCard({
    title,
    value,
    description,
    href,
    icon,
    iconClass,
}: {
    title: string;
    value: number;
    description: string;
    href: string;
    icon: React.ReactNode;
    iconClass: string;
}) {
    return (
        <Link
            href={href}
            className="group rounded-xl border border-slate-300 bg-[#f7f8fa] p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                        {value}
                    </p>

                    <p className="mt-1 truncate text-[10px] font-medium text-slate-500">
                        {description}
                    </p>
                </div>

                <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${iconClass}`}
                >
                    {icon}
                </div>
            </div>
        </Link>
    );
}

/* =============================================================
   TUTOR CARD
============================================================= */

function TutorCard({
    tutor,
    onExplain,
    onRequest,
    independentEligible,
}: {
    tutor: TutorListItem;
    onExplain: () => void;
    onRequest: () => void;
    independentEligible: boolean;
}) {
    return (
        <article className="flex flex-col justify-between rounded-lg border border-slate-300 bg-white p-4 transition hover:border-blue-300 hover:shadow-md">
            <div>
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />

                            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                                Verified Tutor
                            </span>
                        </div>

                        <h4 className="mt-1 truncate text-sm font-bold text-slate-900">
                            {tutor.user?.email || "Tutor"}
                        </h4>
                    </div>

                    {tutor.score !== undefined && (
                        <button
                            onClick={onExplain}
                            className="flex-shrink-0 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700 hover:bg-blue-100"
                            title="View match calculation"
                        >
                            <span className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-blue-600 text-blue-600" />
                                {tutor.score}%
                            </span>
                        </button>
                    )}
                </div>

                <p className="mt-3 line-clamp-3 text-[11px] leading-5 text-slate-600">
                    {tutor.bio ||
                        "Experienced tutor ready to support your learning goals."}
                </p>

                {tutor.experienceYears !== undefined && (
                    <p className="mt-2 text-[10px] font-medium text-slate-500">
                        {tutor.experienceYears}{" "}
                        {tutor.experienceYears === 1
                            ? "year"
                            : "years"}{" "}
                        experience
                    </p>
                )}

                <div className="mt-3 flex flex-wrap gap-1.5">
                    {tutor.subjects.slice(0, 5).map((subject) => (
                        <span
                            key={subject.id}
                            className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-600"
                        >
                            {subject.subject.name}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mt-4 border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Starting Rate
                        </p>

                        <p className="mt-0.5 text-xs font-bold text-slate-800">
                            {tutor.pricing?.[0]
                                ? `${tutor.pricing[0].amount} ${tutor.pricing[0].currency}`
                                : "Standard Rate"}
                        </p>

                        {tutor.pricing?.[0] && (
                            <p className="text-[9px] text-slate-400">
                                / {tutor.pricing[0].durationMinutes} min
                            </p>
                        )}
                    </div>

                    <button
                        onClick={onRequest}
                        disabled={!independentEligible}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-bold transition ${independentEligible
                            ? "bg-blue-700 text-white hover:bg-blue-800"
                            : "cursor-not-allowed bg-slate-200 text-slate-400"
                            }`}
                        title={
                            independentEligible
                                ? "Request this tutor"
                                : "Your parent or guardian must submit this request"
                        }
                    >
                        {independentEligible
                            ? "Request Tutor"
                            : "Parent Required"}

                        <ArrowRight className="h-3 w-3" />
                    </button>
                </div>
            </div>
        </article>
    );
}

/* =============================================================
   QUICK ACTION
============================================================= */

function QuickAction({
    href,
    icon,
    title,
    description,
}: {
    href: string;
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <Link
            href={href}
            className="group flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 transition hover:border-slate-300 hover:bg-white"
        >
            <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                {icon}
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800">
                    {title}
                </p>

                <p className="mt-0.5 text-[10px] text-slate-500">
                    {description}
                </p>
            </div>

            <ArrowRight className="h-3.5 w-3.5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-700" />
        </Link>
    );
}

/* =============================================================
   ACTIVITY ITEM
============================================================= */

function ActivityItem({
    icon,
    title,
    value,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    value: string;
    description: string;
}) {
    return (
        <div className="flex items-center gap-3 px-5 py-4">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                {icon}
            </div>

            <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {title}
                </p>

                <p className="mt-0.5 text-xs font-bold text-slate-800">
                    {value}
                </p>

                <p className="mt-0.5 text-[10px] text-slate-500">
                    {description}
                </p>
            </div>
        </div>
    );
}

/* =============================================================
   SIMPLE TRENDING ICON
============================================================= */

function TrendingIcon() {
    return (
        <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
            <CheckCircle2 className="h-4 w-4" />
        </div>
    );
}

