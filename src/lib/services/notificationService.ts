import nodemailer from "nodemailer";

interface WelcomeNotificationOptions {
    email: string;
    phone?: string;
    role: string;
}

/**
 * Creates nodemailer transporter based on environment variables or returns null if not configured.
 */
function getEmailTransporter() {
    const host = process.env.SMTP_HOST || process.env.GMAIL_SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER || process.env.GMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
        return null;
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });
}

/**
 * Sends a welcome email to the newly registered user's Gmail/Email account.
 */
export async function sendWelcomeEmail({ email, role }: WelcomeNotificationOptions) {
    const portalName = role === "STUDENT" ? "Student Portal" : role === "TUTOR" ? "Educator Portal" : "Parent Portal";
    const portalUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login`;

    const subject = role === "TUTOR"
        ? "Welcome Educator! Your LearnBridge Tutor Account is Ready"
        : role === "PARENT"
            ? "Welcome Parent! Your LearnBridge Family Account is Ready"
            : `Welcome to LearnBridge - Your ${portalName} Account is Ready!`;

    const roleDescription = role === "TUTOR"
        ? "With your Educator Portal, you can manage student booking requests, set teaching availability, configure hourly rates, upload verification documents, and message students directly."
        : role === "PARENT"
            ? "With your Parent Portal, you can manage your children's profiles, request expert tutor matches, schedule family bookings, monitor academic progress, and chat directly with verified educators."
            : `With your ${portalName}, you can explore available tutors, manage bookings, track progress, communicate securely via direct messaging, and receive instant updates.`;

    const accentColor = role === "TUTOR" ? "#059669" : role === "PARENT" ? "#4f46e5" : "#2563eb";
    const cardBg = role === "TUTOR" ? "#ecfdf5" : role === "PARENT" ? "#eef2ff" : "#eff6ff";
    const cardBorder = role === "TUTOR" ? "#10b981" : role === "PARENT" ? "#6366f1" : "#2563eb";
    const badgeBg = role === "TUTOR" ? "#d1fae5" : role === "PARENT" ? "#e0e7ff" : "#e0e7ff";
    const badgeColor = role === "TUTOR" ? "#065f46" : role === "PARENT" ? "#3730a3" : "#3730a3";

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
            .header { text-align: center; padding-bottom: 24px; border-bottom: 1px solid #f1f5f9; }
            .logo-icon { width: 48px; height: 48px; background: ${accentColor}; border-radius: 50%; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-bottom: 12px; }
            .title { color: #0f172a; font-size: 24px; font-weight: 700; margin: 0; }
            .subtitle { color: #64748b; font-weight: 500; font-size: 14px; margin-top: 4px; }
            .content { padding: 24px 0; line-height: 1.6; }
            .welcome-card { background: ${cardBg}; border-left: 4px solid ${cardBorder}; padding: 16px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; background: ${accentColor}; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 15px; margin-top: 16px; text-align: center; }
            .footer { text-align: center; padding-top: 24px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; }
            .badge { display: inline-block; padding: 4px 12px; background-color: ${badgeBg}; color: ${badgeColor}; font-size: 12px; font-weight: 600; border-radius: 9999px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo-icon">L</div>
                <h1 class="title">Welcome to LearnBridge</h1>
                <p class="subtitle">${role === "PARENT" ? "Empowering Families & Child Learning Success" : "Empowering Education & Personal Growth"}</p>
            </div>
            
            <div class="content">
                <p>Hello ${role === "PARENT" ? "Parent" : role === "TUTOR" ? "Educator" : ""},</p>
                <p>Thank you for registering your account on <strong>LearnBridge</strong>! We are thrilled to welcome you to our platform.</p>
                
                <div class="welcome-card">
                    <span class="badge">${role} ACCOUNT ACTIVE</span>
                    <p style="margin: 8px 0 0 0; color: #1e1b4b; font-size: 14px;">
                        Your account has been registered with email <strong>${email}</strong>.
                    </p>
                </div>

                <p>${roleDescription}</p>

                <div style="text-align: center;">
                    <a href="${portalUrl}" class="button">Log In to ${portalName}</a>
                </div>
            </div>

            <div class="footer">
                <p>Need assistance? Contact LearnBridge Support at support@learnbridge.com</p>
                <p>&copy; ${new Date().getFullYear()} LearnBridge Inc. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const textContent = role === "TUTOR"
        ? `Welcome Educator! Your LearnBridge TUTOR account (${email}) has been created successfully. Log in at ${portalUrl} to set your availability & accept student requests.`
        : role === "PARENT"
            ? `Welcome Parent! Your LearnBridge PARENT account (${email}) has been created successfully. Log in at ${portalUrl} to manage your children's learning & bookings.`
            : `Welcome to LearnBridge! Your ${role} account (${email}) has been successfully created. Log in at ${portalUrl} to get started.`;

    try {
        const transporter = getEmailTransporter();
        if (transporter) {
            const senderEmail = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@learnbridge.com";
            await transporter.sendMail({
                from: `"LearnBridge Platform" <${senderEmail}>`,
                to: email,
                subject,
                text: textContent,
                html: htmlContent,
            });
            console.log(`[EMAIL DISPATCHED] Welcome email successfully sent to ${email}`);
            return { sent: true, provider: "smtp" };
        } else {
            console.log("=================================================");
            console.log(`[SIMULATED EMAIL NOTIFICATION]`);
            console.log(`TO: ${email}`);
            console.log(`SUBJECT: ${subject}`);
            console.log(`BODY (text): ${textContent}`);
            console.log("=================================================");
            return { sent: true, provider: "console_fallback" };
        }
    } catch (error) {
        console.error(`[EMAIL ERROR] Failed to send email to ${email}:`, error);
        return { sent: false, error: String(error) };
    }
}

/**
 * Sends a welcome direct SMS to the user's phone number.
 */
export async function sendWelcomeSMS({ phone, role }: { phone?: string; role: string; email?: string }) {
    if (!phone) {
        console.log("[SMS SKIPPED] No phone number provided for user registration.");
        return { sent: false, reason: "no_phone_provided" };
    }

    const cleanPhone = phone.trim();
    const smsMessage = role === "TUTOR"
        ? `[LearnBridge] Welcome Educator! Your TUTOR account has been created. Set up your availability & subjects to receive student booking requests!`
        : role === "PARENT"
            ? `[LearnBridge] Welcome Parent! Your PARENT account has been created successfully. Monitor your children's learning, bookings & notifications anytime.`
            : `[LearnBridge] Welcome! Your ${role} account has been created successfully. Access your dashboard & notifications anytime. Happy learning!`;

    try {
        const smsApiKey = process.env.SMS_API_KEY;
        const smsApiUrl = process.env.SMS_API_URL;

        if (smsApiKey && smsApiUrl) {
            const response = await fetch(smsApiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${smsApiKey}`,
                },
                body: JSON.stringify({
                    to: cleanPhone,
                    message: smsMessage,
                }),
            });

            if (response.ok) {
                console.log(`[SMS DISPATCHED] Welcome SMS sent to ${cleanPhone}`);
                return { sent: true, provider: "sms_gateway" };
            } else {
                console.warn(`[SMS WARNING] SMS gateway status ${response.status} for ${cleanPhone}`);
            }
        }

        // Fallback logging for development / when SMS provider key is not yet configured
        console.log("=================================================");
        console.log(`[SIMULATED DIRECT SMS NOTIFICATION]`);
        console.log(`RECIPIENT PHONE: ${cleanPhone}`);
        console.log(`MESSAGE CONTENT: ${smsMessage}`);
        console.log("=================================================");
        return { sent: true, provider: "console_fallback" };
    } catch (error) {
        console.error(`[SMS ERROR] Failed to send SMS to ${cleanPhone}:`, error);
        return { sent: false, error: String(error) };
    }
}

/**
 * Sends both Email and SMS notifications for user account creation.
 */
export async function sendAccountCreationNotifications({ email, phone, role }: WelcomeNotificationOptions) {
    const [emailResult, smsResult] = await Promise.all([
        sendWelcomeEmail({ email, role }),
        sendWelcomeSMS({ phone, role }),
    ]);

    return {
        email: emailResult,
        sms: smsResult,
    };
}
