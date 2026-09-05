"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Send, ShieldAlert, Archive, Lock, Clock, CheckCircle2 } from "lucide-react";

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

export default function ParentMessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState("");
    const [currentUserId, setCurrentUserId] = useState<string>("");

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

    async function handleArchiveConv(convId: string) {
        if (!confirm("Are you sure you want to archive this conversation? It will become read-only.")) return;
        try {
            const res = await fetch(`/api/conversations/${convId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "CLOSED" }),
            });
            if (res.ok) {
                fetchConversations();
                if (selectedConv?.id === convId) {
                    setSelectedConv((prev) => (prev ? { ...prev, status: "CLOSED" } : null));
                }
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 p-6 md:p-10 space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                    <MessageSquare className="h-8 w-8 text-indigo-600" />
                    Parent Tutor Messenger
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Communicate directly with verified tutors assigned to your linked dependent children.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                </div>
            ) : conversations.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm space-y-3">
                    <MessageSquare className="mx-auto h-12 w-12 text-slate-300" />
                    <h3 className="text-base font-bold text-slate-900">No active tutor conversations</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Conversations are automatically opened once a tutor accepts a match request for your student child.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-slate-200 rounded-3xl p-4 shadow-sm h-[600px]">
                    {/* Sidebar Conversations List */}
                    <div className="border-r border-slate-100 pr-4 space-y-2 overflow-y-auto">
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block px-2">
                            Tutor Threads ({conversations.length})
                        </span>
                        {conversations.map((conv) => {
                            const tutorParticipant = conv.participants.find((p) => p.role === "TUTOR");
                            const isSelected = selectedConv?.id === conv.id;

                            return (
                                <button
                                    key={conv.id}
                                    onClick={() => handleSelectConv(conv)}
                                    className={`w-full text-left p-3.5 rounded-2xl transition border ${isSelected
                                            ? "bg-indigo-50 border-indigo-200 text-indigo-950"
                                            : "border-transparent hover:bg-slate-50 text-slate-700"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-xs truncate max-w-[130px]">
                                            {tutorParticipant?.email || "Academic Tutor"}
                                        </span>
                                        <span
                                            className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${conv.status === "OPEN" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                                                }`}
                                        >
                                            {conv.status}
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

                    {/* Chat Panel */}
                    <div className="md:col-span-2 flex flex-col justify-between h-full bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden">
                        {selectedConv ? (
                            <>
                                {/* Header */}
                                <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-xs text-slate-900">
                                            Tutor: {selectedConv.participants.find((p) => p.role === "TUTOR")?.email || "Academic Tutor"}
                                        </h3>
                                        <span className="text-[10px] text-slate-400">Status: {selectedConv.status}</span>
                                    </div>

                                    {selectedConv.status === "OPEN" && (
                                        <button
                                            onClick={() => handleArchiveConv(selectedConv.id)}
                                            className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition"
                                        >
                                            <Archive className="h-3.5 w-3.5" />
                                            Archive Thread
                                        </button>
                                    )}
                                </div>

                                {/* Messages Scroll */}
                                <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col">
                                    {messages.length === 0 ? (
                                        <p className="text-xs text-slate-400 text-center my-auto">
                                            Send a message below to start communicating with the tutor.
                                        </p>
                                    ) : (
                                        messages.map((m) => {
                                            const isParentSender = m.sender.role === "PARENT";

                                            return (
                                                <div
                                                    key={m.id}
                                                    className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${isParentSender
                                                            ? "bg-indigo-600 text-white rounded-br-none self-end ml-auto shadow-xs"
                                                            : "bg-white border border-slate-200 text-slate-800 rounded-bl-none self-start mr-auto shadow-xs"
                                                        }`}
                                                >
                                                    {!isParentSender && (
                                                        <span className="block text-[9px] font-bold text-indigo-600 mb-1 uppercase">
                                                            {m.sender.role}
                                                        </span>
                                                    )}
                                                    <p>{m.content}</p>
                                                    <span
                                                        className={`block text-[8px] text-right mt-1 ${isParentSender ? "text-indigo-200" : "text-slate-400"
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

                                {/* Message Input */}
                                <div className="p-3 bg-white border-t border-slate-100">
                                    {selectedConv.status === "OPEN" ? (
                                        <form onSubmit={handleSendMessage} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Type your message to tutor..."
                                                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                            <button
                                                type="submit"
                                                className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 font-bold text-xs text-white px-4 py-2 rounded-xl transition"
                                            >
                                                <Send className="h-3.5 w-3.5" />
                                                Send
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="text-center py-2 text-xs text-slate-400 flex items-center justify-center gap-2">
                                            <Lock className="h-4 w-4 text-slate-400" />
                                            This thread is archived and read-only.
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400 text-xs">
                                <MessageSquare className="h-10 w-10 text-slate-300 mb-2" />
                                Select a tutor thread from the left to view messages.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
