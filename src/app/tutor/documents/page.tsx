import TutorDocuments from "@/components/tutor/TutorDocuments";

export default function TutorDocumentsPage() {
    return (
        <main className="min-h-screen p-6">
            <div className="mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold">
                    Documents & Certificates
                </h1>

                <p className="mt-2 text-gray-600">
                    Upload your qualifications and documents for
                    LearnBridge verification.
                </p>

                <div className="mt-8">
                    <TutorDocuments />
                </div>
            </div>
        </main>
    );
}