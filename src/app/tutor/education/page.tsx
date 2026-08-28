import TutorEducation from "@/components/tutor/TutorEducation";

export default function TutorEducationPage() {
    return (
        <main className="min-h-screen p-6">
            <div className="mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold">
                    Education
                </h1>

                <p className="mt-2 text-gray-600">
                    Add your educational background so students can
                    understand your qualifications.
                </p>

                <div className="mt-8">
                    <TutorEducation />
                </div>
            </div>
        </main>
    );
}