import { sendAccountCreationNotifications } from "../src/lib/services/notificationService";

async function main() {
    console.log("🚀 Testing LearnBridge Parent Account Creation Notification Service...");

    const parentResult = await sendAccountCreationNotifications({
        email: "parent.family@gmail.com",
        phone: "+251911223344",
        role: "PARENT",
    });

    console.log("Parent Email Notification Result:", parentResult.email);
    console.log("Parent SMS Notification Result:", parentResult.sms);

    if (parentResult.email.sent && parentResult.sms.sent) {
        console.log("✅ SUCCESS: Parent account creation notifications verified!");
    } else {
        console.error("❌ FAILED: Parent notification verification failed.");
        process.exit(1);
    }
}

main().catch((err) => {
    console.error("Unexpected error:", err);
    process.exit(1);
});
