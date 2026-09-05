"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Send, User, RefreshCw } from "lucide-react";

type Participant = {
    id: string;
    email: string;
    role: string;
};

type Conversation = {
    id: string;
    status: string;
    createdAt: string;
    participants: Participant[];
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

export default function StudentMessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingConvs, setLoadingConvs] = useState(true);
    const [loadingMsgs, setLoadingMsgs] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        fetchCurrentUser();
        fetchConversations();
    }, []);

    async function fetchCurrentUser() {
        try {
            const res = await fetch("/api/student/profile");
            const data = await res.json();
            if (data.success && data.profile) {
                setCurrentUserId(data.profile.userId);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function fetchConversations() {
        try {
            setLoadingConvs(true);
            const res = await fetch("/api/conversations");
            const data = await res.json();
            if (res.ok && data.success) {
                setConversations(data.conversations || []);
                if (data.conversations?.length > 0 && !selectedConv) {
                    handleSelectConv(data.conversations[0]);
                }
            }
        } catch (e) {
            console.error("Error fetching conversations:", e);
        } finally {
            setLoadingConvs(false);
        }
    }

    async function handleSelectConv(conv: Conversation) {
        setSelectedConv(conv);
        setMessages([]);
        try {
            setLoadingMsgs(true);
            const res = await fetch(`/api/conversations/${conv.id}/messages`);
            const data = await res.json();
            if (res.ok && data.success) {
                setMessages(data.messages || []);
            }
        } catch (e) {
            console.error("Error fetching messages:", e);
        } finally {
            setLoadingMsgs(false);
        }
    }

    async function handleSendMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedConv || !newMessage.trim()) return;

        const content = newMessage.trim();
        setNewMessage("");

        try {
            const res = await fetch(`/api/conversations/${selectedConv.id}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setMessages((prev) => [...prev, data.messageDetails]);
                fetchConversations();
            }
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    }

    const tutorParticipant = selectedConv?.participants?.find((p) => p.role === "TUTOR");

    return (
        <main className="min-h-screen bg-slate-50 p-6 md:p-10">
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <MessageSquare className="h-8 w-8 text-blue-600" />
                            Tutor Messenger
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Direct messages with your connected tutors.
                        </p>
                    </div>

                    <button
                        onClick={fetchConversations}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
                    >
                        <RefreshCw className="h-4 w-4 text-slate-500" />
                        Refresh
                    </button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
                    {/* Left Sidebar: Conversation List */}
                    <div className="md:col-span-4 border-r border-slate-200 bg-slate-50/50 flex flex-col">
                        <div className="p-4 border-b border-slate-200 bg-white">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Conversations ({conversations.length})
                            </h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {loadingConvs ? (
                                <div className="p-4 text-center text-xs text-slate-400">Loading chats...</div>
                            ) : conversations.length === 0 ? (
                                <div className="p-6 text-center text-xs text-slate-500">
                                    No active conversations. Chats unlock automatically once a tutor accepts your request!
                                </div>
                            ) : (
                                conversations.map((conv) => {
                                    const tutor = conv.participants.find((p) => p.role === "TUTOR");
                                    const isSelected = selectedConv?.id === conv.id;
                                    return (
                                        <button
                                            key={conv.id}
                                            onClick={() => handleSelectConv(conv)}
                                            className={`w-full text-left p-3.5 rounded-xl border transition ${isSelected
                                                    ? "bg-blue-50 border-blue-200 shadow-sm"
                                                    : "bg-white border-slate-200/80 hover:bg-slate-100/80"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                                    {tutor?.email?.[0]?.toUpperCase() || "T"}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-baseline">
                                                        <p className="text-xs font-bold text-slate-900 truncate">
                                                            {tutor?.email || "Tutor"}
                                                        </p>
                                                        <span className="text-[10px] text-slate-400">
                                                            {conv.status}
                                                        </span>
                                                    </div>
                                                    {conv.latestMessage && (
                                                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                                            {conv.latestMessage.content}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Right Pane: Message Thread */}
                    <div className="md:col-span-8 flex flex-col h-full bg-white">
                        {selectedConv ? (
                            <>
                                {/* Header */}
                                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                                            {tutorParticipant?.email?.[0]?.toUpperCase() || "T"}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900">
                                                {tutorParticipant?.email || "Tutor"}
                                            </h3>
                                            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                                                Active Connection ({selectedConv.status})
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages View */}
                                <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-slate-50/30 min-h-[380px]">
                                    {loadingMsgs ? (
                                        <div className="text-center py-10 text-xs text-slate-400">Loading messages...</div>
                                    ) : messages.length === 0 ? (
                                        <div className="text-center py-12 text-xs text-slate-500">
                                            No messages exchanged yet. Send a friendly hello to introduce yourself!
                                        </div>
                                    ) : (
                                        messages.map((m) => {
                                            const isMe = m.sender?.role === "STUDENT" || m.sender?.id === currentUserId;
                                            return (
                                                <div
                                                    key={m.id}
                                                    className={`flex flex-col max-w-[75%] ${isMe ? "ml-auto items-end" : "mr-auto items-start"}`}
                                                >
                                                    <div
                                                        className={`p-3.5 rounded-2xl text-xs leading-relaxed ${isMe
                                                                ? "bg-blue-600 text-white rounded-br-none shadow-sm"
                                                                : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm"
                                                            }`}
                                                    >
                                                        {!isMe && (
                                                            <span className="block text-[10px] font-bold text-blue-600 mb-1 uppercase tracking-wider">
                                                                {m.sender?.role || "TUTOR"}
                                                            </span>
                                                        )}
                                                        <p>{m.content}</p>
                                                    </div>
                                                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                                                        {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Input */}
                                <div className="p-4 border-t border-slate-200 bg-white">
                                    {selectedConv.status === "OPEN" ? (
                                        <form onSubmit={handleSendMessage} className="flex gap-3">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Type your message here..."
                                                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!newMessage.trim()}
                                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition"
                                            >
                                                <Send className="h-4 w-4" />
                                                Send
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="text-center py-2 text-xs text-slate-500 bg-slate-100 rounded-xl">
                                            This conversation is closed.
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center p-12 text-slate-400 space-y-3">
                                <MessageSquare className="h-12 w-12 text-slate-300" />
                                <p className="text-sm font-semibold text-slate-600">Select a conversation</p>
                                <p className="text-xs text-slate-400 max-w-xs">
                                    Choose a tutor conversation from the list to view chat logs and exchange messages.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
