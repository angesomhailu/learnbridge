"use client";

import { useEffect, useState } from "react";
import {
    Users,
    Search,
    Shield,
    UserCheck,
    UserX,
    Trash2,
    Clock,
    AlertCircle,
    ChevronRight,
    X,
    Filter,
} from "lucide-react";

interface UserItem {
    id: string;
    email: string;
    phone?: string | null;
    role: "STUDENT" | "PARENT" | "TUTOR" | "ADMIN";
    status: "PENDING" | "ACTIVE" | "SUSPENDED" | "DEACTIVATED";
    authProvider: string;
    createdAt: string;
    student?: { id: string; grade: string; gender: string } | null;
    parent?: { id: string; occupation: string } | null;
    tutor?: { id: string; verificationStatus: string; experienceYears: number } | null;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

    async function loadUsers() {
        setLoading(true);
        try {
            const url = `/api/admin/users?query=${encodeURIComponent(searchQuery)}&role=${roleFilter}&status=${statusFilter}`;
            const res = await fetch(url);
            const data = await res.json();
            if (!res.ok) {
                setMessage(data.message || "Failed to load user directory");
                return;
            }
            setUsers(data.users || []);
        } catch (error) {
            console.error(error);
            setMessage("Failed to fetch users.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUsers();
    }, [roleFilter, statusFilter]);

    const handleUpdateUserStatus = async (userId: string, newStatus: string) => {
        try {
            const res = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, status: newStatus }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMessage(data.message || "Failed to update user status.");
                return;
            }
            setMessage(data.message);
            await loadUsers();
            if (selectedUser?.id === userId) {
                setSelectedUser((prev) => prev ? { ...prev, status: newStatus as any } : null);
            }
        } catch (error) {
            console.error(error);
            setMessage("Error updating user status.");
        }
    };

    const handleUpdateUserRole = async (userId: string, newRole: string) => {
        try {
            const res = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, role: newRole }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMessage(data.message || "Failed to update user role.");
                return;
            }
            setMessage(data.message);
            await loadUsers();
            if (selectedUser?.id === userId) {
                setSelectedUser((prev) => prev ? { ...prev, role: newRole as any } : null);
            }
        } catch (error) {
            console.error(error);
            setMessage("Error updating user role.");
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to permanently delete this user account?")) return;
        try {
            const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) {
                setMessage(data.message || "Failed to delete user.");
                return;
            }
            setMessage(data.message);
            if (selectedUser?.id === userId) setSelectedUser(null);
            await loadUsers();
        } catch (error) {
            console.error(error);
            setMessage("Error deleting user.");
        }
    };

    const roleTabs = [
        { id: "ALL", label: "All Roles" },
        { id: "STUDENT", label: "Students" },
        { id: "PARENT", label: "Parents" },
        { id: "TUTOR", label: "Tutors" },
        { id: "ADMIN", label: "Admins" },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-extrabold uppercase tracking-wider">
                    <Users className="h-3.5 w-3.5 text-blue-600" />
                    Platform User Management
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    User Directory Console
                </h1>
                <p className="text-sm text-slate-600 max-w-2xl leading-relaxed font-medium">
                    Search, filter, inspect profiles, manage account status, and assign system administrative roles across LearnBridge accounts.
                </p>
            </div>

            {message && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs font-bold text-blue-800 shadow-xs flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        {message}
                    </span>
                    <button onClick={() => setMessage("")} className="text-blue-800 underline font-bold">Dismiss</button>
                </div>
            )}

            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
                <div className="flex flex-wrap items-center gap-1.5">
                    {roleTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setRoleFilter(tab.id)}
                            className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${roleFilter === tab.id
                                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                                : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-2xl outline-none"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="PENDING">PENDING</option>
                        <option value="SUSPENDED">SUSPENDED</option>
                        <option value="DEACTIVATED">DEACTIVATED</option>
                    </select>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            loadUsers();
                        }}
                        className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-2xl text-xs"
                    >
                        <Search className="h-4 w-4 text-slate-400 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search email/phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent text-slate-800 font-medium placeholder-slate-400 outline-none w-full md:w-44"
                        />
                        <button type="submit" className="px-3 py-1 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition">
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* User List Table */}
            <div className="rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
                {loading ? (
                    <div className="flex items-center justify-center p-12 text-slate-500 text-xs font-bold">
                        <Clock className="h-5 w-5 animate-spin text-blue-600 mr-2" />
                        <span>Fetching directory...</span>
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-xs font-medium">
                        No users match the current filter criteria.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                                    <th className="p-4 pl-6">User Account</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Auth Provider</th>
                                    <th className="p-4">Registered Date</th>
                                    <th className="p-4 pr-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                                {users.map((u) => {
                                    const roleBadgeClass =
                                        u.role === "TUTOR"
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                            : u.role === "PARENT"
                                                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                                : u.role === "ADMIN"
                                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                                    : "bg-blue-50 text-blue-700 border-blue-200";

                                    const statusBadgeClass =
                                        u.status === "ACTIVE"
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                            : u.status === "SUSPENDED"
                                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                                : "bg-amber-50 text-amber-700 border-amber-200";

                                    return (
                                        <tr key={u.id} className="hover:bg-slate-50/80 transition">
                                            <td className="p-4 pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                                                        {u.email[0]?.toUpperCase() || "U"}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800">{u.email}</p>
                                                        <p className="text-[10px] text-slate-400">{u.phone || "No Phone"}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase ${roleBadgeClass}`}>
                                                    {u.role}
                                                </span>
                                            </td>

                                            <td className="p-4">
                                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase ${statusBadgeClass}`}>
                                                    {u.status}
                                                </span>
                                            </td>

                                            <td className="p-4 text-slate-500 font-mono text-[11px]">
                                                {u.authProvider}
                                            </td>

                                            <td className="p-4 text-slate-500">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>

                                            <td className="p-4 pr-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedUser(u)}
                                                        className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold transition text-[11px]"
                                                    >
                                                        Inspect
                                                    </button>

                                                    {u.status === "ACTIVE" ? (
                                                        <button
                                                            onClick={() => handleUpdateUserStatus(u.id, "SUSPENDED")}
                                                            className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold border border-amber-200 transition text-[11px]"
                                                        >
                                                            Suspend
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleUpdateUserStatus(u.id, "ACTIVE")}
                                                            className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 transition text-[11px]"
                                                        >
                                                            Activate
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => handleDeleteUser(u.id)}
                                                        className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-600 transition"
                                                        title="Delete Account"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Inspect User Drawer Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs">
                    <div className="relative w-full max-w-md h-full bg-white p-6 shadow-2xl overflow-y-auto space-y-6 border-l border-slate-200">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <h2 className="text-base font-extrabold text-slate-900">User Account Inspector</h2>
                            <button onClick={() => setSelectedUser(null)} className="p-1 text-slate-400 hover:text-slate-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                                <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-lg">
                                    {selectedUser.email[0]?.toUpperCase() || "U"}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-extrabold text-sm text-slate-900 truncate">{selectedUser.email}</p>
                                    <p className="text-xs text-slate-500 font-mono">ID: {selectedUser.id}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role & Status Controls</h3>
                                <div className="flex gap-2">
                                    <select
                                        value={selectedUser.role}
                                        onChange={(e) => handleUpdateUserRole(selectedUser.id, e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-800"
                                    >
                                        <option value="STUDENT">STUDENT</option>
                                        <option value="PARENT">PARENT</option>
                                        <option value="TUTOR">TUTOR</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>

                                    <select
                                        value={selectedUser.status}
                                        onChange={(e) => handleUpdateUserStatus(selectedUser.id, e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-800"
                                    >
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="PENDING">PENDING</option>
                                        <option value="SUSPENDED">SUSPENDED</option>
                                        <option value="DEACTIVATED">DEACTIVATED</option>
                                    </select>
                                </div>
                            </div>

                            {selectedUser.tutor && (
                                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-1">
                                    <h4 className="font-bold text-xs text-emerald-900">Tutor Profile Attached</h4>
                                    <p className="text-xs text-emerald-700">Verification: {selectedUser.tutor.verificationStatus}</p>
                                    <p className="text-xs text-emerald-700">Experience: {selectedUser.tutor.experienceYears} Years</p>
                                </div>
                            )}

                            {selectedUser.student && (
                                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-1">
                                    <h4 className="font-bold text-xs text-blue-900">Student Profile Attached</h4>
                                    <p className="text-xs text-blue-700">Grade: {selectedUser.student.grade}</p>
                                    <p className="text-xs text-blue-700">Gender: {selectedUser.student.gender}</p>
                                </div>
                            )}

                            <div className="pt-4 border-t border-slate-100 flex gap-3">
                                <button
                                    onClick={() => handleDeleteUser(selectedUser.id)}
                                    className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition"
                                >
                                    Delete User Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
