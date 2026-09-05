"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Send, Archive, Lock, CheckCircle2, User, ShieldCheck } from "lucide-react";

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

export default function TutorMessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        fetchConversations();
    }, []);

    async function fetchConversations() {
        try {
            setLoading(true);
            const res = await fetch("/api/conversations");
            const data = await res.json();
            if (res.ok && data.success) {
                setConversations(data.conversations || []);
                if (data.conversations?.length > 0 && !selectedConv) {
                    handleSelectConv(data.conversations[0]);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function handleSelectConv(conv: Conversation) {
        setSelectedConv(conv);
        setMessages([]);
        try {
            const res = await fetch(`/api/conversations/${conv.id}/messages`);
            const data = await res.json();
            if (res.ok && data.success) {
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
                body: JSON.stringify({ content: newMessage.trim() }),
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
        <main className="min-h-screen bg-slate-50 p-6 md:p-10 space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                    <MessageSquare className="h-8 w-8 text-emerald-600" />
                    Tutor Messages Inbox
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Communicate directly with your assigned students and their parents to coordinate tutoring sessions.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
                </div>
            ) : conversations.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm space-y-3">
                    <MessageSquare className="mx-auto h-12 w-12 text-slate-300" />
                    <h3 className="text-base font-bold text-slate-900">No active student conversations</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Once you accept student tutoring requests, active conversation threads will appear here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-slate-200 rounded-3xl p-4 shadow-sm h-[600px]">
                    {/* Conversations Sidebar */}
                    <div className="border-r border-slate-100 pr-4 space-y-2 overflow-y-auto">
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block px-2">
                            Active Student Threads ({conversations.length})
                        </span>
                        {conversations.map((conv) => {
                            const otherParticipant = conv.participants.find((p) => p.role !== "TUTOR");
                            const isSelected = selectedConv?.id === conv.id;

                            return (
                                <button
                                    key={conv.id}
                                    onClick={() => handleSelectConv(conv)}
                                    className={`w-full text-left p-3.5 rounded-2xl transition border ${isSelected
                                            ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                                            : "border-transparent hover:bg-slate-50 text-slate-700"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-xs truncate max-w-[130px]">
                                            {otherParticipant?.email || "Student"}
                                        </span>
                                        <span
                                            className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${otherParticipant?.role === "PARENT"
                                                    ? "bg-indigo-100 text-indigo-800"
                                                    : "bg-emerald-100 text-emerald-800"
                                                }`}
                                        >
                                            {otherParticipant?.role || "STUDENT"}
                                        </span>
                                    </div>
                                    {conv.latestMessage && (
                                        <p className="text-[11px] text-slate-500 truncate mt-1">
                                            {conv.latestMessage.content}
                                        </p>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Active Conversation Panel */}
                    <div className="md:col-span-2 flex flex-col justify-between h-full bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden">
                        {selectedConv ? (
                            <>
                                {/* Header */}
                                <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-xs text-slate-900">
                                            Thread with: {selectedConv.participants.find((p) => p.role !== "TUTOR")?.email || "Student"}
                                        </h3>
                                        <span className="text-[10px] text-slate-400">Status: {selectedConv.status}</span>
                                    </div>
                                </div>

                                {/* Messages Container */}
                                <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col">
                                    {messages.length === 0 ? (
                                        <p className="text-xs text-slate-400 text-center my-auto">
                                            Send a message to start communicating.
                                        </p>
                                    ) : (
                                        messages.map((m) => {
                                            const isTutorSender = m.sender.role === "TUTOR";

                                            return (
                                                <div
                                                    key={m.id}
                                                    className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${isTutorSender
                                                            ? "bg-emerald-600 text-white rounded-br-none self-end ml-auto shadow-xs"
                                                            : "bg-white border border-slate-200 text-slate-800 rounded-bl-none self-start mr-auto shadow-xs"
                                                        }`}
                                                >
                                                    {!isTutorSender && (
                                                        <span className="block text-[9px] font-bold text-indigo-600 mb-1 uppercase">
                                                            {m.sender.role} ({m.sender.email})
                                                        </span>
                                                    )}
                                                    <p>{m.content}</p>
                                                    <span
                                                        className={`block text-[8px] text-right mt-1 ${isTutorSender ? "text-emerald-200" : "text-slate-400"
                                                            }`}
                                                    >
                                                        {new Date(m.createdAt).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Input */}
                                <div className="p-3 bg-white border-t border-slate-100">
                                    <form onSubmit={handleSendMessage} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type your response to student/parent..."
                                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                        <button
                                            type="submit"
                                            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 font-bold text-xs text-white px-4 py-2 rounded-xl transition"
                                        >
                                            <Send className="h-3.5 w-3.5" />
                                            Send
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400 text-xs">
                                <MessageSquare className="h-10 w-10 text-slate-300 mb-2" />
                                Select a student or parent thread from the left list.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
