import TutorProfileForm from "@/components/tutor/TutorProfileForm";

export default function TutorProfilePage() {
    return (
        <main className="min-h-screen p-6">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-3xl font-bold">
                    Tutor Profile
                </h1>

                <p className="mt-2 text-gray-600">
                    Complete your tutor profile so students can
                    understand your experience and teaching background.
                </p>

                <div className="mt-8 rounded-xl border p-6">
                    <TutorProfileForm />
                </div>
            </div>
        </main>
    );
}