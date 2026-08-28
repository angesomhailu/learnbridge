import TutorAvailability from "@/components/tutor/TutorAvailability";

export default function TutorAvailabilityPage() {
    return (
        <main className="min-h-screen p-6">
            <div className="mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold">
                    Availability
                </h1>

                <p className="mt-2 text-gray-600">
                    Tell students when you are available
                    for tutoring sessions.
                </p>

                <div className="mt-8">
                    <TutorAvailability />
                </div>
            </div>
        </main>
    );
}