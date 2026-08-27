import StudentAvailability from "@/components/student/StudentAvailability";

export default function StudentAvailabilityPage() {
    return (
        <main className="min-h-screen p-6">
            <div className="mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold">My Availability</h1>

                <p className="mt-2 text-gray-600">
                    Add the days and times you're available for tutoring.
                </p>

                <div className="mt-8">
                    <StudentAvailability />
                </div>
            </div>
        </main>
    );
}