import { sendAccountCreationNotifications } from "../src/lib/services/notificationService";

async function main() {
    console.log("🚀 Testing LearnBridge Account Creation Notification Service...");

    const studentResult = await sendAccountCreationNotifications({
        email: "student.test@gmail.com",
        phone: "+251911223344",
        role: "STUDENT",
    });

    console.log("Email Notification Result:", studentResult.email);
    console.log("SMS Notification Result:", studentResult.sms);

    if (studentResult.email.sent && studentResult.sms.sent) {
        console.log("✅ SUCCESS: Account creation notifications verified!");
    } else {
        console.error("❌ FAILED: Notification verification failed.");
        process.exit(1);
    }
}

main().catch((err) => {
    console.error("Unexpected error:", err);
    process.exit(1);
});
