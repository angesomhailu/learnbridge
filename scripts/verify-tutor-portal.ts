import { sendAccountCreationNotifications } from "../src/lib/services/notificationService";

async function main() {
    console.log("🚀 Testing LearnBridge Tutor Account Creation Notification Service...");

    const tutorResult = await sendAccountCreationNotifications({
        email: "tutor.educator@gmail.com",
        phone: "+251922334455",
        role: "TUTOR",
    });

    console.log("Tutor Email Notification Result:", tutorResult.email);
    console.log("Tutor SMS Notification Result:", tutorResult.sms);

    if (tutorResult.email.sent && tutorResult.sms.sent) {
        console.log("✅ SUCCESS: Tutor account creation notifications verified!");
    } else {
        console.error("❌ FAILED: Tutor notification verification failed.");
        process.exit(1);
    }
}

main().catch((err) => {
    console.error("Unexpected error:", err);
    process.exit(1);
});
