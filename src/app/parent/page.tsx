import { requireRole } from "@/lib/auth-guards";

export default async function ParentDashboard() {
    const session = await requireRole("PARENT");

    return (
        <main>
            <h1>Parent Dashboard</h1>

            <p>Welcome, {session.user.email}</p>

            <p>Role: {session.user.role}</p>

            <p>Manage your children, tutor requests, and bookings.</p>
        </main>
    );
}