import { requireRole } from "@/lib/auth-guards";
import StudentDashboardClient from "./StudentDashboardClient";

export default async function StudentDashboard() {
    const session = await requireRole("STUDENT");

    return <StudentDashboardClient session={session} />;
}