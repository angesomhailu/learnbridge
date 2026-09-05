import { requireRole } from "@/lib/auth-guards";
import TutorDashboardClient from "./TutorDashboardClient";

export default async function TutorDashboard() {
    const session = await requireRole("TUTOR");

    return <TutorDashboardClient session={session} />;
}