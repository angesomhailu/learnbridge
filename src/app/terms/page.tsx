import Link from "next/link";
import Image from "next/image";
import { FileText, ArrowLeft, CheckCircle2, ShieldCheck, AlertTriangle, Scale, UserCheck, CreditCard } from "lucide-react";

export const metadata = {
    title: "Terms of Service | LearnBridge",
    description: "LearnBridge Terms of Service, User Agreement, and Platform Guidelines",
};

export default function TermsPage() {
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

            <main className="max-w-4xl mx-auto px-6 py-12 md:py-16 space-y-12">
                {/* Hero Title */}
                <div className="space-y-4 text-center md:text-left border-b border-slate-900 pb-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-400">
                        <Scale className="h-3.5 w-3.5" />
                        User Agreement & Platform Rules
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                        Terms of Service
                    </h1>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                        These Terms of Service govern your access to and use of the LearnBridge tutor brokerage platform, smart matching services, and mobile/web applications.
                    </p>
                    <p className="text-xs text-slate-500">
                        Last Updated: September 2026 • Version 2.4
                    </p>
                </div>

                {/* Key Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5 space-y-2">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                            <UserCheck className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-bold text-white">Role Responsibilities</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Clear guidelines for Students, Parents, and Verified Tutors ensuring respectful, academic conduct.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5 space-y-2">
                        <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-bold text-white">Minor Safety Guard</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Parent authorization required for students under 16 prior to booking external tutoring sessions.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5 space-y-2">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                            <CreditCard className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-bold text-white">Transparent Billing</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Tutors set upfront rates. Payment transactions are securely verified before session confirmation.
                        </p>
                    </div>
                </div>

                {/* Terms Content */}
                <div className="space-y-10 text-sm text-slate-300 leading-relaxed">
                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <FileText className="h-5 w-5 text-indigo-400" />
                            1. Acceptance of Terms
                        </h2>
                        <p>
                            By creating an account, browsing tutor profiles, or utilizing the LearnBridge platform, you agree to be legally bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you may not register or access our services.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <UserCheck className="h-5 w-5 text-indigo-400" />
                            2. Account Eligibility & Role Rules
                        </h2>
                        <ul className="list-disc list-inside space-y-2 pl-2 text-slate-400 text-xs">
                            <li>
                                <strong>Student Accounts (Age 16+):</strong> Students aged 16 and older may independently search, request, and message tutors on the platform.
                            </li>
                            <li>
                                <strong>Minor Students (Under 16):</strong> Students under 16 years of age require linked Parent/Guardian account setup. Tutor match requests initiated by minors must be authorized by a linked parent account before connection establishment.
                            </li>
                            <li>
                                <strong>Verified Tutors:</strong> Tutors must provide accurate academic credentials, background details, and subject qualifications. Misrepresentation of identity or credentials results in immediate permanent ban.
                            </li>
                            <li>
                                <strong>Parent/Guardian Accounts:</strong> Parents have full authority to request tutors, view session logs, process payments, and oversee communication for their enrolled dependents.
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-indigo-400" />
                            3. Code of Conduct & Safety Guidelines
                        </h2>
                        <p>
                            LearnBridge enforces zero tolerance for harassment, discrimination, inappropriate communication, or academic dishonesty. All user interactions (messages, session bookings, reviews) are subject to automated safety auditing and admin review.
                        </p>
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-300 flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold block">Off-Platform Bypass Prohibition</span>
                                Violations involving attempting to solicit unverified direct off-platform payments or unmonitored minor meetings outside LearnBridge protections will lead to account termination.
                            </div>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-indigo-400" />
                            4. Bookings, Payments & Cancellations
                        </h2>
                        <ul className="list-disc list-inside space-y-2 pl-2 text-slate-400 text-xs">
                            <li><strong>Rates & Fees:</strong> Tutors explicitly state hourly or session pricing on their profiles. Rates cannot be altered retroactively once a booking is confirmed.</li>
                            <li><strong>Cancellations:</strong> Session cancellations made at least 24 hours prior to the scheduled start time qualify for a full credit refund. Cancellations under 24 hours are subject to standard tutor compensation rules.</li>
                            <li><strong>Ratings & Reviews:</strong> Only students or parents with completed session bookings may submit reviews for a tutor.</li>
                        </ul>
                    </section>

                    <section className="space-y-3 border-t border-slate-900 pt-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Scale className="h-5 w-5 text-indigo-400" />
                            5. Amendments & Governing Law
                        </h2>
                        <p className="text-slate-400 text-xs">
                            LearnBridge reserves the right to modify these Terms at any time. Continued use of the service following notice of updates constitutes full acceptance of the revised Terms.
                        </p>
                    </section>
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
