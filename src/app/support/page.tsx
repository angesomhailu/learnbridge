"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    HelpCircle,
    ArrowLeft,
    Search,
    MessageSquare,
    Mail,
    Shield,
    ChevronDown,
    ChevronUp,
    Send,
    CheckCircle2,
    Clock,
    FileText,
} from "lucide-react";

type FAQItem = {
    question: string;
    answer: string;
    category: "Students" | "Parents" | "Tutors" | "General";
};

const faqs: FAQItem[] = [
    {
        category: "Students",
        question: "How does the AI tutor matching score work?",
        answer: "LearnBridge evaluates tutor compatibility by analyzing subject alignment, hourly pricing vs budget, preferred calendar availability, and past student review ratings. You can click on the match percentage badge on any tutor card to view the exact calculation breakdown.",
    },
    {
        category: "Students",
        question: "Can I request any tutor directly?",
        answer: "If you are 16 or older, yes! If you are under 16, LearnBridge's minor safety policy requires authorization from your linked parent/guardian account before sending direct tutor match requests.",
    },
    {
        category: "Parents",
        question: "How do I manage my child's tutoring account?",
        answer: "Register a Parent account and add your student's email in the Parent Portal. From your dashboard, you can approve tutor requests, monitor active bookings, manage session payments, and track learning goals.",
    },
    {
        category: "Parents",
        question: "Are tutors background checked and verified?",
        answer: "Yes. All tutors must submit academic credentials, subject expertise proof, and identity documentation. Tutors receive a 'VERIFIED' badge only after administrative review.",
    },
    {
        category: "Tutors",
        question: "How do I set up my pricing and availability?",
        answer: "Log into your Tutor Dashboard and navigate to 'Availability & Pricing'. You can set custom hourly rates per currency and define specific days and times when you are available for tutoring.",
    },
    {
        category: "General",
        question: "What should I do if I need to cancel a booked session?",
        answer: "Navigate to 'My Bookings' in your dashboard and select the session. Cancellations made at least 24 hours in advance receive a full credit refund to your account balance.",
    },
];

export default function SupportPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<"All" | "Students" | "Parents" | "Tutors" | "General">("All");
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    // Contact Form state
    const [contactForm, setContactForm] = useState({
        name: "",
        email: "",
        role: "Student",
        subject: "General Inquiry",
        message: "",
    });
    const [formSubmitted, setFormSubmitted] = useState(false);

    const filteredFaqs = faqs.filter((faq) => {
        const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
        const matchesSearch =
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    function handleSubmitContact(e: React.FormEvent) {
        e.preventDefault();
        setFormSubmitted(true);
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-6 h-18 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative h-9 w-9 overflow-hidden rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md">
                            <Image
                                src="/learnbridge.png"
                                alt="LearnBridge Logo"
                                width={36}
                                height={36}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <span className="font-bold text-lg text-white">LearnBridge</span>
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12 md:py-16 space-y-12">
                {/* Hero Header */}
                <div className="space-y-4 text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-400">
                        <HelpCircle className="h-3.5 w-3.5" />
                        Support & Help Center
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                        How can we help you?
                    </h1>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Find answers to common questions about tutor matching, minor safety, bookings, and payments — or get in touch with our team.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-lg mx-auto pt-2">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search questions, booking rules, safety policy..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5 flex items-start gap-4">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                            <Mail className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Email Support</h3>
                            <p className="text-xs text-slate-400 mt-0.5">support@learnbridge.edu</p>
                            <span className="text-[10px] text-slate-500 mt-1 block">Mon-Fri 9:00 AM - 6:00 PM</span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5 flex items-start gap-4">
                        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Rapid Response SLA</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Under 24 hours guaranteed</p>
                            <span className="text-[10px] text-slate-500 mt-1 block">Priority queue for safety issues</span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5 flex items-start gap-4">
                        <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                            <Shield className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Parent Safety Line</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Direct minor protection support</p>
                            <span className="text-[10px] text-slate-500 mt-1 block">safety@learnbridge.edu</span>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="space-y-6 pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-indigo-400" />
                            Frequently Asked Questions
                        </h2>

                        {/* Category filter tabs */}
                        <div className="flex flex-wrap gap-2">
                            {(["All", "Students", "Parents", "Tutors", "General"] as const).map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${selectedCategory === cat
                                            ? "bg-indigo-600 text-white shadow-sm"
                                            : "bg-slate-900 text-slate-400 hover:text-white"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {filteredFaqs.length === 0 ? (
                        <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-8 text-center text-xs text-slate-400">
                            No FAQ questions matched your search query. Feel free to send us a direct message below!
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredFaqs.map((faq, index) => {
                                const isOpen = openFaqIndex === index;
                                return (
                                    <div
                                        key={index}
                                        className="rounded-2xl border border-slate-900 bg-slate-900/40 overflow-hidden transition"
                                    >
                                        <button
                                            onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                                            className="w-full text-left p-5 flex items-center justify-between gap-4 text-xs md:text-sm font-bold text-white hover:text-indigo-300 transition"
                                        >
                                            <span className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] uppercase tracking-wider font-semibold">
                                                    {faq.category}
                                                </span>
                                                {faq.question}
                                            </span>
                                            {isOpen ? (
                                                <ChevronUp className="h-4 w-4 text-indigo-400 shrink-0" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                                            )}
                                        </button>

                                        {isOpen && (
                                            <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-900/60 pt-3">
                                                {faq.answer}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Direct Contact Support Form */}
                <div className="rounded-3xl border border-slate-900 bg-slate-900/30 p-6 md:p-8 space-y-6">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-indigo-400" />
                            Send a Support Request
                        </h2>
                        <p className="text-xs text-slate-400">
                            Have a specific question or issue? Fill out the form below and our support team will reply within 24 hours.
                        </p>
                    </div>

                    {formSubmitted ? (
                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-8 text-center space-y-3">
                            <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                            <h3 className="text-base font-bold text-white">Support Request Received!</h3>
                            <p className="text-xs text-slate-300 max-w-md mx-auto">
                                Thank you for contacting LearnBridge Support. We have sent a confirmation copy to <strong>{contactForm.email}</strong>.
                            </p>
                            <button
                                onClick={() => {
                                    setFormSubmitted(false);
                                    setContactForm({ name: "", email: "", role: "Student", subject: "General Inquiry", message: "" });
                                }}
                                className="mt-2 inline-block rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition"
                            >
                                Send Another Message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmitContact} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-300">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={contactForm.name}
                                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                        placeholder="e.g. Alex Morgan"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-300">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={contactForm.email}
                                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                        placeholder="alex@example.com"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-300">I am a...</label>
                                    <select
                                        value={contactForm.role}
                                        onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                                    >
                                        <option value="Student">Student</option>
                                        <option value="Parent">Parent / Guardian</option>
                                        <option value="Tutor">Tutor</option>
                                        <option value="Visitor">Visitor</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-300">Inquiry Category</label>
                                    <select
                                        value={contactForm.subject}
                                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                                    >
                                        <option value="General Inquiry">General Inquiry</option>
                                        <option value="Tutor Match Help">Tutor Match Help</option>
                                        <option value="Minor Safety & Authorization">Minor Safety & Authorization</option>
                                        <option value="Bookings & Billing">Bookings & Billing</option>
                                        <option value="Technical Support">Technical Support</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={contactForm.message}
                                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                    placeholder="Please describe your question or issue in detail..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition"
                            >
                                <Send className="h-4 w-4" />
                                Submit Support Ticket
                            </button>
                        </form>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-600">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>© {new Date().getFullYear()} LearnBridge. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="text-slate-400 hover:text-white">Privacy</Link>
                        <Link href="/terms" className="text-slate-400 hover:text-white">Terms</Link>
                        <Link href="/support" className="text-slate-400 hover:text-white">Support</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
