import Link from "next/link";
import Image from "next/image";
import { Shield, ArrowLeft, Lock, Eye, FileText, UserCheck, Bell, Mail } from "lucide-react";

export const metadata = {
    title: "Privacy Policy | LearnBridge",
    description: "LearnBridge Privacy Policy and Youth Data Protection Standards",
};

export default function PrivacyPage() {
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
                        <Shield className="h-3.5 w-3.5" />
                        Privacy Policy & Youth Protection
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                        Privacy Policy
                    </h1>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                        At LearnBridge, protecting your personal information and creating a safe educational environment for students, parents, and tutors is our top priority.
                    </p>
                    <p className="text-xs text-slate-500">
                        Last Updated: September 2026 • Effective Immediately
                    </p>
                </div>

                {/* Key Pillars Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5 space-y-2">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                            <Lock className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-bold text-white">Data Encryption</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            All user credentials, chat messages, and session details are encrypted in transit and at rest.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5 space-y-2">
                        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                            <UserCheck className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-bold text-white">Child Safety (Under 16)</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Strict minor safety rules require parental authorization for tutoring requests for users under 16.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5 space-y-2">
                        <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                            <Eye className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-bold text-white">Transparent Matching</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Matching score metrics are computed purely on subject alignment, budget, and availability without selling data.
                        </p>
                    </div>
                </div>

                {/* Full Legal Policy Content */}
                <div className="space-y-10 text-sm text-slate-300 leading-relaxed">
                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <FileText className="h-5 w-5 text-indigo-400" />
                            1. Information We Collect
                        </h2>
                        <p>
                            We collect personal information necessary to deliver tutoring connections, verify tutor credentials, and enforce youth safety standards:
                        </p>
                        <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400 text-xs">
                            <li><strong>Account Credentials:</strong> Email addresses, hashed passwords, user role (Student, Parent, Tutor).</li>
                            <li><strong>Student & Parent Profiles:</strong> Student age, grade level, learning goals, preferred subjects, budget constraints, and linked parent profiles.</li>
                            <li><strong>Tutor Credentials:</strong> Biography, experience years, subject competencies, pricing rates, and verification identity documentation submitted for admin review.</li>
                            <li><strong>Platform Activity:</strong> Tutor requests, session bookings, ratings and review commentary, and in-platform messaging logs.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Shield className="h-5 w-5 text-indigo-400" />
                            2. How We Use Your Information
                        </h2>
                        <p>
                            LearnBridge uses collected data exclusively for the following legitimate educational purposes:
                        </p>
                        <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400 text-xs">
                            <li>To calculate transparent AI-assisted tutor compatibility match percentages.</li>
                            <li>To process tutor requests, session scheduling, and payment transaction receipts.</li>
                            <li>To enforce minor protection controls: Students under age 16 cannot independently initiate tutor match requests without parent account authorization.</li>
                            <li>To facilitate secure messaging between accepted tutoring partners.</li>
                            <li>To maintain platform security, prevent fraud, and comply with legal requirements.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Lock className="h-5 w-5 text-indigo-400" />
                            3. Data Sharing & Third Parties
                        </h2>
                        <p>
                            <strong>We do not sell, rent, or trade your personal data to third parties.</strong> Data is shared only under strict operational circumstances:
                        </p>
                        <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400 text-xs">
                            <li><strong>Between Matched Participants:</strong> Basic contact details (email and role) are shared between a student/parent and an accepted tutor to facilitate learning.</li>
                            <li><strong>Service Providers:</strong> Secure payment processors and hosting infrastructure providers bound by strict confidentiality obligations.</li>
                            <li><strong>Legal & Compliance:</strong> When required by valid legal process, court orders, or to protect the physical safety of minor students.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Bell className="h-5 w-5 text-indigo-400" />
                            4. Your Privacy Rights & Choices
                        </h2>
                        <p>
                            Every LearnBridge user maintains control over their personal information:
                        </p>
                        <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400 text-xs">
                            <li><strong>Access & Correction:</strong> You can review and edit profile parameters, budget settings, and subject choices via your dashboard at any time.</li>
                            <li><strong>Account Deletion:</strong> You may request complete account deletion and data removal by contacting privacy@learnbridge.edu.</li>
                            <li><strong>Notification Settings:</strong> Opt-in or out of email notifications and class reminders in your portal settings.</li>
                        </ul>
                    </section>

                    <section className="space-y-3 border-t border-slate-900 pt-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Mail className="h-5 w-5 text-indigo-400" />
                            5. Contact Privacy Office
                        </h2>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            If you have questions, concerns, or parental consent inquiries regarding this Privacy Policy, reach out to our privacy officer:
                        </p>
                        <div className="rounded-xl border border-slate-900 bg-slate-900/30 p-4 text-xs font-mono text-slate-300">
                            LearnBridge Privacy & Protection Office<br />
                            Email: privacy@learnbridge.edu<br />
                            Support Portal: <Link href="/support" className="text-indigo-400 underline">learnbridge.edu/support</Link>
                        </div>
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
