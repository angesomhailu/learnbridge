"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    UserCheck,
    Users,
    BookOpen,
    CalendarDays,
    ShieldAlert,
    LogOut,
    Menu,
    X,
    Bell,
    ChevronRight,
    ChevronDown,
    User,
    AlertTriangle,
    History,
    Search,
    Command,
} from "lucide-react";
import AdminFooter from "@/components/admin/AdminFooter";

const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, badgeKey: null },
    { name: "Tutor Approvals", href: "/admin/tutors", icon: UserCheck, badgeKey: "pendingTutors" },
    { name: "User Directory", href: "/admin/users", icon: Users, badgeKey: null },
    { name: "Subject Catalog", href: "/admin/subjects", icon: BookOpen, badgeKey: null },
    { name: "Bookings Audit", href: "/admin/bookings", icon: CalendarDays, badgeKey: null },
    { name: "Reports & Safety", href: "/admin/reports", icon: AlertTriangle, badgeKey: "openReports" },
    { name: "System Audit Logs", href: "/admin/audit", icon: History, badgeKey: null },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();

    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [counts, setCounts] = useState({ pendingTutors: 0, openReports: 0 });

    const fetchBadgeCounts = async () => {
        try {
            const res = await fetch("/api/admin/stats");
            if (res.ok) {
                const data = await res.json();
                setCounts({
                    pendingTutors: data.stats?.tutors?.pending || 0,
                    openReports: data.stats?.openReportsCount || 0,
                });
            }
        } catch (error) {
            console.error("Failed to fetch admin layout badge counts", error);
        }
    };

    useEffect(() => {
        fetchBadgeCounts();
        const interval = setInterval(fetchBadgeCounts, 30000);
        return () => clearInterval(interval);
    }, [pathname]);

    // Keyboard shortcut for command palette (Ctrl+K or Cmd+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsSearchOpen((prev) => !prev);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut({ callbackUrl: "/login" });
        } catch {
            window.location.href = "/login";
        }
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const currentRoute = navItems.find(
        (item) =>
            item.href === pathname ||
            (item.href !== "/admin" && pathname.startsWith(item.href))
    );

    const filteredNavItems = navItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex min-h-screen flex-col bg-[#f1f5f9] font-sans text-slate-800">
            {/* Sidebar Backdrop Overlay */}
            {isSidebarOpen && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={closeSidebar}
                    className="fixed inset-0 z-40 cursor-default bg-slate-900/50 backdrop-blur-xs transition-opacity"
                />
            )}

            {/* Slide-in Drawer Navigation */}
            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col justify-between border-r border-slate-200 bg-white p-5 text-slate-700 shadow-2xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="space-y-6">
                    {/* Brand Header */}
                    <div className="flex items-center justify-between">
                        <Link
                            href="/admin"
                            onClick={closeSidebar}
                            className="flex items-center gap-3 px-1 pt-1"
                        >
                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md">
                                <img
                                    src="/learnbridge.png"
                                    alt="LearnBridge"
                                    className="h-full w-full object-contain p-1"
                                />
                            </div>
                            <div>
                                <span className="font-extrabold text-base text-slate-900 tracking-tight block">
                                    LearnBridge
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block -mt-1">
                                    Admin Console
                                </span>
                            </div>
                        </Link>

                        <button
                            type="button"
                            onClick={closeSidebar}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                            aria-label="Close navigation menu"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Admin Access Badge Card */}
                    <div className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-orange-50/40 p-3.5 space-y-1 shadow-2xs">
                        <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                            <ShieldAlert className="h-4 w-4 text-rose-600" />
                            Command Privileges Active
                        </div>
                        <p className="text-[11px] text-rose-700/80 leading-snug">
                            System control, credentials verification, security, and catalog auditing active.
                        </p>
                    </div>

                    {/* Navigation Items */}
                    <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-290px)] pr-1">
                        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Platform Management
                        </div>

                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active =
                                pathname === item.href ||
                                (item.href !== "/admin" && pathname.startsWith(item.href));

                            const badgeCount = item.badgeKey ? counts[item.badgeKey as keyof typeof counts] : 0;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={closeSidebar}
                                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition group ${active
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon
                                            className={`h-4 w-4 transition-colors ${active ? "text-white" : "text-slate-400 group-hover:text-blue-600"
                                                }`}
                                        />
                                        <span>{item.name}</span>
                                    </div>

                                    {badgeCount > 0 && (
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${active
                                                ? "bg-white text-blue-700"
                                                : "bg-rose-500 text-white"
                                                }`}
                                        >
                                            {badgeCount}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Drawer Sign Out */}
                <div className="pt-4 border-t border-slate-100">
                    <button
                        onClick={() => {
                            closeSidebar();
                            handleSignOut();
                        }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Top Header Navbar */}
            <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-4 sm:px-6 shadow-2xs">
                <div className="flex items-center gap-3">
                    {/* Hamburger Button */}
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(true)}
                        aria-label="Open navigation menu"
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    {/* Logo */}
                    <Link
                        href="/admin"
                        className="flex items-center gap-2"
                        onClick={closeSidebar}
                    >
                        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-blue-600 text-white shadow-xs">
                            <img
                                src="/learnbridge.png"
                                alt="LearnBridge"
                                className="h-full w-full object-contain p-0.5"
                            />
                        </div>

                        <div className="hidden sm:block">
                            <p className="text-sm font-extrabold text-slate-900 leading-tight">
                                LearnBridge
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                                Admin Console
                            </p>
                        </div>
                    </Link>

                    {/* Quick Command Palette Button */}
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="hidden md:flex items-center gap-2 ml-4 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-400 text-xs transition"
                    >
                        <Search className="h-3.5 w-3.5 text-slate-400" />
                        <span>Quick Navigate...</span>
                        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-white rounded border border-slate-200 text-slate-500 shadow-2xs">
                            <Command className="h-2.5 w-2.5" /> K
                        </kbd>
                    </button>
                </div>

                {/* Right Utilities */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Breadcrumb */}
                    <div className="hidden items-center gap-2 text-xs text-slate-500 md:flex">
                        <span className="font-semibold text-slate-400">Admin</span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                        <span className="font-bold text-slate-800">
                            {currentRoute?.name ?? "Dashboard"}
                        </span>
                    </div>

                    {/* Verification Notification Bell */}
                    <Link
                        href="/admin/tutors"
                        aria-label="Notifications"
                        className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
                        title={`${counts.pendingTutors} Pending Educator Verifications`}
                    >
                        <Bell className="h-5 w-5" />
                        {counts.pendingTutors > 0 && (
                            <span className="absolute right-2 top-2 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                            </span>
                        )}
                    </Link>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                            className="flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-100"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-700 font-bold text-xs shadow-2xs">
                                <User className="h-4 w-4" />
                            </div>

                            <div className="hidden text-left lg:block">
                                <p className="max-w-[140px] truncate text-xs font-bold text-slate-800">
                                    {session?.user?.name || "Administrator"}
                                </p>
                                <p className="text-[10px] text-slate-500 font-medium">
                                    Platform Admin
                                </p>
                            </div>

                            <ChevronDown className="hidden h-4 w-4 text-slate-400 lg:block" />
                        </button>

                        {isProfileMenuOpen && (
                            <>
                                <button
                                    type="button"
                                    aria-label="Close profile menu"
                                    onClick={() => setIsProfileMenuOpen(false)}
                                    className="fixed inset-0 z-40 cursor-default"
                                />

                                <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
                                    <div className="border-b border-slate-100 px-4 py-3 bg-slate-50/50">
                                        <p className="truncate text-xs font-bold text-slate-900">
                                            {session?.user?.name || "Administrator"}
                                        </p>
                                        <p className="truncate text-[11px] text-slate-500 font-mono">
                                            {session?.user?.email || "admin@learnbridge.com"}
                                        </p>
                                    </div>

                                    <div className="p-2 space-y-1">
                                        <Link
                                            href="/admin"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                                        >
                                            <LayoutDashboard className="h-4 w-4 text-blue-600" />
                                            <span>Admin Overview</span>
                                        </Link>

                                        <button
                                            onClick={() => {
                                                setIsProfileMenuOpen(false);
                                                handleSignOut();
                                            }}
                                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Command Palette / Quick Navigation Modal */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-xs">
                    <div
                        className="fixed inset-0"
                        onClick={() => setIsSearchOpen(false)}
                    />
                    <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200">
                        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
                            <Search className="h-4 w-4 text-slate-400 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search admin section or jump to console page..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                className="w-full text-xs font-medium text-slate-800 placeholder-slate-400 outline-none bg-transparent"
                            />
                            <button
                                onClick={() => setIsSearchOpen(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="max-h-72 overflow-y-auto p-2">
                            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Navigation Jump
                            </div>
                            {filteredNavItems.length === 0 ? (
                                <p className="text-xs text-slate-400 p-4 text-center">
                                    No matching admin section found.
                                </p>
                            ) : (
                                filteredNavItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.href}
                                            onClick={() => {
                                                router.push(item.href);
                                                setIsSearchOpen(false);
                                                setSearchQuery("");
                                            }}
                                            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-blue-50 text-left transition group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-xl bg-slate-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition">
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700">
                                                    {item.name}
                                                </span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500" />
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 flex flex-col min-h-[calc(100vh-64px)]">
                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </div>

                <AdminFooter />
            </main>
        </div>
    );
}
