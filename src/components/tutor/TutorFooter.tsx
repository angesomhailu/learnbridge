"use client";

import Image from "next/image";
import Link from "next/link";

export default function TutorFooter() {
    return (
        <footer className="border-t border-slate-200 bg-white pt-12 pb-8 text-slate-600">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Bottom Bar */}
                <div className=" border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src="/learnbridge.png"
                            alt="LearnBridge"
                            width={46}
                            height={46}
                            className="h-11 w-11 object-contain"
                            priority
                        />

                        <div>
                            <div className="text-xl font-bold tracking-tight text-slate-900">
                                Learn<span className="text-blue-600">Bridge</span>
                            </div>
                            <div className="hidden text-[7px] font-medium uppercase tracking-[0.18em] text-slate-500 sm:block">
                                Learn better. Grow further.
                            </div>
                        </div>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="hover:text-slate-900 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-slate-900 transition-colors">
                            Terms of Service
                        </Link>
                        <Link
                            href="/help"
                            className="hover:text-slate-900 transition-colors"
                        >
                            Help & Support
                        </Link>
                    </div>
                    <p>
                        &copy; {new Date().getFullYear()} LearnBridge Platform. All rights reserved.
                    </p>

                </div>
            </div>
        </footer>
    );
}