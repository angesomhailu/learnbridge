"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type ParentProfile = {
    phone?: string;
    occupation?: string;
    address?: string;
};

type ChildStudent = {
    id: string;
    name?: string;
    dateOfBirth: string;
    grade?: string;
    learningNeeds?: string;
    independentRequestEligible: boolean;
    user: {
        id: string;
        email: string;
    };
    budget?: {
        id: string;
        maxAmount: number;
        currency: string;
        period: string;
        isFlexible: boolean;
    } | null;
};

type TutorRequest = {
    id: string;
    studentId: string;
    tutorId: string;
    status: string;
    createdAt: string;
    tutor: {
        id: string;
        bio?: string;
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

export default function ParentDashboardClient({ session }: { session: any }) {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<"children" | "requests" | "chat">("children");

    // Children states
    const [children, setChildren] = useState<ChildStudent[]>([]);
    const [loadingChildren, setLoadingChildren] = useState(true);

    // Register child form
    const [childEmail, setChildEmail] = useState("");
    const [childPassword, setChildPassword] = useState("");
    const [childDOB, setChildDOB] = useState("");
    const [childGrade, setChildGrade] = useState("Grade 1");
    const [childNeeds, setChildNeeds] = useState("");
    const [childMaxBudget, setChildMaxBudget] = useState(250);
    const [childBudgetFlexible, setChildBudgetFlexible] = useState(true);
    const [childMessage, setChildMessage] = useState("");

    // Edit budget state
    const [editingChild, setEditingChild] = useState<ChildStudent | null>(null);
    const [editMaxBudget, setEditMaxBudget] = useState(250);
    const [editFlexible, setEditFlexible] = useState(true);

    // Requests states
    const [requests, setRequests] = useState<TutorRequest[]>([]);
    const [loadingRequests, setLoadingRequests] = useState(true);

    // Conversation states
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingChats, setLoadingChats] = useState(true);
    const [newMessage, setNewMessage] = useState("");

    // Load initial children lists
    useEffect(() => {
        fetchChildren();
        fetchRequests();
        fetchConversations();
    }, []);

    async function fetchChildren() {
        try {
            setLoadingChildren(true);
            const res = await fetch("/api/parent/children");
            const data = await res.json();
            if (data.success) {
                setChildren(data.children || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingChildren(false);
        }
    }

    async function fetchRequests() {
        try {
            setLoadingRequests(true);
            const res = await fetch("/api/tutor/requests"); // fetch request logs
            const data = await res.json();
            if (data.success) {
                // Tutors can list, let's see if parent can also list
                // If endpoint handles parent listing, we populate. Otherwise mock
                setRequests(data.requests || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingRequests(false);
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

    async function handleAddChild(e: React.FormEvent) {
        e.preventDefault();
        setChildMessage("");

        if (!childEmail || !childPassword || !childDOB) {
            setChildMessage("Email, Password and Date of Birth are mandatory.");
            return;
        }

        try {
            const res = await fetch("/api/parent/children", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: childEmail,
                    password: childPassword,
                    dateOfBirth: childDOB,
                    grade: childGrade,
                    learningNeeds: childNeeds,
                    budget: {
                        maxAmount: childMaxBudget,
                        currency: "ETB",
                        period: "MONTHLY",
                        isFlexible: childBudgetFlexible
                    }
                })
            });
            const data = await res.json();
            if (res.ok) {
                setChildMessage("Child account added successfully!");
                setChildEmail("");
                setChildPassword("");
                setChildDOB("");
                setChildNeeds("");
                fetchChildren();
            } else {
                setChildMessage(data.message || "Failed to add child.");
            }
        } catch (err) {
            console.error(err);
            setChildMessage("Failed to register child profile.");
        }
    }

    async function handleUpdateBudget(e: React.FormEvent) {
        e.preventDefault();
        if (!editingChild) return;

        try {
            const res = await fetch(`/api/parent/children/${editingChild.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    budget: {
                        maxAmount: editMaxBudget,
                        currency: "ETB",
                        period: "MONTHLY",
                        isFlexible: editFlexible
                    }
                })
            });
            if (res.ok) {
                setEditingChild(null);
                fetchChildren();
            }
        } catch (err) {
            console.error(err);
        }
    }

    // Select discussion logs
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

    // Send a message
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
                // Refresh list snippet
                fetchConversations();
            }
        } catch (err) {
            console.error(err);
        }
    }

    // Close conversation
    async function handleCloseConv(convId: string) {
        if (!confirm("Are you sure you want to archive/close this conversation? It will become read-only.")) return;
        try {
            const res = await fetch(`/api/conversations/${convId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "CLOSED" })
            });
            if (res.ok) {
                fetchConversations();
                if (selectedConv?.id === convId) {
                    setSelectedConv((prev) => prev ? { ...prev, status: "CLOSED" } : null);
                }
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            {/* Nav */}
            <div className="border-b border-slate-900 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white">
                        L
                    </div>
                    <span className="font-bold text-lg text-white">LearnBridge Parent Hub</span>
                </div>
                <div className="flex items-center gap-6">
                    <span className="text-xs text-slate-400">Signed in as: {session?.user?.email}</span>
                    <button
                        onClick={() => router.push("/api/auth/signout")}
                        className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Dashboard grid */}
            <div className="flex flex-1 flex-col md:flex-row max-w-7xl w-full mx-auto p-6 gap-6">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex flex-col gap-2">
                    <button
                        onClick={() => setActiveTab("children")}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${activeTab === "children"
                                ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10"
                                : "bg-slate-900/30 border-slate-900 text-slate-400 hover:text-white hover:bg-slate-900/50"
                            }`}
                    >
                        👥 Children Profiles ({children.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("requests")}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${activeTab === "requests"
                                ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10"
                                : "bg-slate-900/30 border-slate-900 text-slate-400 hover:text-white hover:bg-slate-900/50"
                            }`}
                    >
                        📬 Tutor Requests
                    </button>
                    <button
                        onClick={() => setActiveTab("chat")}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${activeTab === "chat"
                                ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10"
                                : "bg-slate-900/30 border-slate-900 text-slate-400 hover:text-white hover:bg-slate-900/50"
                            }`}
                    >
                        💬 Inbox Messages
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-slate-900/30 border border-slate-900 rounded-2xl p-6 relative">
                    {/* Tab 1: Children list and budget */}
                    {activeTab === "children" && (
                        <div className="space-y-8 animate-fadeIn">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-white">My Children Students</h2>
                                    <p className="text-slate-400 text-xs mt-1">Configure academic constraints and individual monthly limits</p>
                                </div>
                            </div>

                            {/* Register Child */}
                            <form onSubmit={handleAddChild} className="bg-slate-900/40 p-5 rounded-xl border border-slate-900 space-y-4">
                                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Register New Student Account</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={childEmail}
                                            onChange={(e) => setChildEmail(e.target.value)}
                                            placeholder="child@learning.com"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={childPassword}
                                            onChange={(e) => setChildPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Date of Birth</label>
                                        <input
                                            type="date"
                                            required
                                            value={childDOB}
                                            onChange={(e) => setChildDOB(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 scheme-dark"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Grade Level</label>
                                        <select
                                            value={childGrade}
                                            onChange={(e) => setChildGrade(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                                        >
                                            <option value="Grade 1">Grade 1</option>
                                            <option value="Grade 5">Grade 5</option>
                                            <option value="Grade 8">Grade 8</option>
                                            <option value="Grade 10">Grade 10</option>
                                            <option value="Grade 12">Grade 12</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Max Hourly Budget (ETB)</label>
                                        <input
                                            type="number"
                                            value={childMaxBudget}
                                            onChange={(e) => setChildMaxBudget(Number(e.target.value))}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                                        />
                                    </div>
                                    <div className="flex items-center pt-5">
                                        <input
                                            id="flexible"
                                            type="checkbox"
                                            checked={childBudgetFlexible}
                                            onChange={(e) => setChildBudgetFlexible(e.target.checked)}
                                            className="w-4 h-4 rounded text-indigo-650 bg-slate-950 border-slate-800 focus:outline-none"
                                        />
                                        <label htmlFor="flexible" className="ml-2 text-xs text-slate-300">Allow 20% recommendation flexibility</label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Learning Needs / Topics</label>
                                    <textarea
                                        value={childNeeds}
                                        onChange={(e) => setChildNeeds(e.target.value)}
                                        placeholder="Algebra, prep calculus basics, reading exercises..."
                                        rows={2}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none"
                                    />
                                </div>

                                {childMessage && (
                                    <p className="text-xs text-indigo-400 font-semibold">{childMessage}</p>
                                )}

                                <button
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs text-white px-5 py-2.5 rounded-lg active:scale-95 transition-transform"
                                >
                                    Add Child Account
                                </button>
                            </form>

                            {/* Registered Kids List */}
                            {loadingChildren ? (
                                <p className="text-slate-500 text-xs">Loading children data...</p>
                            ) : children.length === 0 ? (
                                <div className="text-center py-8 bg-slate-900/10 border border-slate-900 border-dashed rounded-xl">
                                    <p className="text-slate-500 text-xs">No children accounts registered yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {children.map((child) => (
                                        <div key={child.id} className="p-5 rounded-xl border border-slate-900 bg-slate-900/20 flex flex-col justify-between">
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <span className="font-bold text-sm text-white">{child.user?.email}</span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${child.independentRequestEligible
                                                            ? "bg-green-500/10 text-green-400"
                                                            : "bg-orange-500/10 text-orange-400"
                                                        }`}>
                                                        {child.independentRequestEligible ? "Independent (16+)" : "Requires Parent Guard"}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-400">DOB: {new Date(child.dateOfBirth).toLocaleDateString()}</p>
                                                <p className="text-xs text-slate-400 font-semibold">Grade: {child.grade || "Unassigned"}</p>
                                                {child.learningNeeds && (
                                                    <p className="text-xs text-slate-500 italic mt-1">&quot;{child.learningNeeds}&quot;</p>
                                                )}

                                                <div className="pt-3 border-t border-slate-900 flex justify-between items-center text-xs">
                                                    <div>
                                                        <span className="text-slate-400 font-semibold block text-[10px] uppercase">Tutoring budget</span>
                                                        <span className="text-indigo-400 font-bold">
                                                            {child.budget ? `${child.budget.maxAmount} ${child.budget.currency} (${child.budget.isFlexible ? "Flexible" : "Strict"})` : "None"}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setEditingChild(child);
                                                            setEditMaxBudget(child.budget?.maxAmount || 250);
                                                            setEditFlexible(child.budget?.isFlexible ?? true);
                                                        }}
                                                        className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                                                    >
                                                        Edit Budget
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Edit Budget Modal Overlay */}
                            {editingChild && (
                                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50 animate-fadeIn">
                                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl">
                                        <h3 className="font-bold text-white">Adjust Tutoring Budget</h3>
                                        <p className="text-xs text-slate-400">Modify maximum hourly payment criteria for {editingChild.user?.email}</p>
                                        <form onSubmit={handleUpdateBudget} className="space-y-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Max Hourly (ETB)</label>
                                                <input
                                                    type="number"
                                                    value={editMaxBudget}
                                                    onChange={(e) => setEditMaxBudget(Number(e.target.value))}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                                                />
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    id="editFlex"
                                                    type="checkbox"
                                                    checked={editFlexible}
                                                    onChange={(e) => setEditFlexible(e.target.checked)}
                                                    className="w-4 h-4 rounded text-indigo-650 bg-slate-950 border-slate-800"
                                                />
                                                <label htmlFor="editFlex" className="ml-2 text-xs text-slate-300">Allow budget overrun flexibility (+20%)</label>
                                            </div>
                                            <div className="flex gap-3 justify-end pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingChild(null)}
                                                    className="px-4 py-2 border border-slate-800 font-semibold text-xs rounded-lg text-slate-400 hover:text-white"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="bg-indigo-600 hover:bg-slate-950 font-semibold text-xs text-white px-4 py-2 rounded-lg"
                                                >
                                                    Save Budget
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 2: Tutor Requests */}
                    {activeTab === "requests" && (
                        <div className="space-y-6 animate-fadeIn">
                            <div>
                                <h2 className="text-xl font-bold text-white">Tutoring Request Statuses</h2>
                                <p className="text-slate-400 text-xs mt-1">Review validation and acceptances for parent-delegated requests</p>
                            </div>

                            {loadingRequests ? (
                                <p className="text-slate-500 text-xs">Loading request histories...</p>
                            ) : requests.length === 0 ? (
                                <div className="text-center py-10 bg-slate-900/10 border border-slate-900 border-dashed rounded-xl">
                                    <p className="text-slate-500 text-xs">No tutor requests submitted yet. Go request a tutor via children recommendations.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {requests.map((r) => (
                                        <div key={r.id} className="p-4 rounded-xl border border-slate-900 bg-slate-900/15 flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-xs text-white">Tutor Profile: {r.tutor?.user?.email}</span>
                                                    <span className="text-[10px] text-slate-500">· Created {new Date(r.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-xs text-slate-400 mt-1 max-w-md truncate">Bio: {r.tutor?.bio || "No summary provided."}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${r.status === "ACCEPTED"
                                                        ? "bg-green-500/10 text-green-400"
                                                        : r.status === "PENDING"
                                                            ? "bg-yellow-500/10 text-yellow-400"
                                                            : "bg-red-500/10 text-red-400"
                                                    }`}>
                                                    {r.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 3: Inbox Messages / Chat */}
                    {activeTab === "chat" && (
                        <div className="h-[550px] flex flex-col md:flex-row gap-6 animate-fadeIn">
                            {/* Conversations Side Column */}
                            <div className="w-full md:w-64 border-r border-slate-900 pr-5 flex flex-col gap-3 overflow-y-auto">
                                <h3 className="font-bold text-xs text-indigo-400 uppercase tracking-widest mb-1">Student Chats</h3>
                                {loadingChats ? (
                                    <p className="text-slate-500 text-xs">Loading conversations...</p>
                                ) : conversations.length === 0 ? (
                                    <p className="text-slate-500 text-xs italic">No active conversations found. Conversation initiates once a tutor accepts your request.</p>
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
                                                <span className={`text-[9px] px-1 py-0.2 rounded font-semibold ${conv.status === "OPEN" ? "bg-green-500/10 text-green-400" : "bg-slate-800 text-slate-500"
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

                            {/* Active Chat Log panel */}
                            <div className="flex-1 flex flex-col justify-between h-full bg-slate-950/20 rounded-xl overflow-hidden border border-slate-900">
                                {selectedConv ? (
                                    <>
                                        {/* Chat bar header */}
                                        <div className="p-4 border-b border-slate-900 bg-slate-900/20 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-bold text-white">
                                                    Chat with {selectedConv.participants.find(p => p.role === "TUTOR")?.email || "Tutor"}
                                                </p>
                                                <p className="text-[10px] text-slate-500">Status: {selectedConv.status}</p>
                                            </div>
                                            {selectedConv.status === "OPEN" && (
                                                <button
                                                    onClick={() => handleCloseConv(selectedConv.id)}
                                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-1 rounded"
                                                >
                                                    Archive Chat
                                                </button>
                                            )}
                                        </div>

                                        {/* Messages Scroll Area */}
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

                                        {/* Input Box */}
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
                                                <div className="text-center py-2 bg-slate-950/20 text-[10px] text-slate-500">
                                                    🔒 This conversation is archived/closed and is read-only.
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-500 text-xs">
                                        <span>💬</span>
                                        <span className="mt-2">Select a chat conversation from the list to start messaging.</span>
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
