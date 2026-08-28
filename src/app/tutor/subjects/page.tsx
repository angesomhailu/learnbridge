import TutorSubjects from "@/components/tutor/TutorSubjects";

export default function TutorSubjectsPage() {
    return (
        <main className="min-h-screen p-6">
            <div className="mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold">
                    My Subjects
                </h1>

                <p className="mt-2 text-gray-600">
                    Choose the subjects you are qualified to teach.
                </p>

                <div className="mt-8">
                    <TutorSubjects />
                </div>
            </div>
        </main>
    );
}