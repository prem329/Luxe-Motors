import { Handler } from "@netlify/functions";
import nodemailer from "nodemailer";

const handler: Handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { emails, subject, message } = JSON.parse(event.body || "{}");

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No recipients provided" }),
      };
    }

    // SMTP configuration from environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.ethereal.email",
      port: parseInt(process.env.SMTP_PORT || "587"),
      auth: {
        user: process.env.SMTP_USER || "test",
        pass: process.env.SMTP_PASS || "test",
      },
    });

    const results = [];
    for (const email of emails) {
      try {
        await transporter.sendMail({
          from: '"LuxeMotors" <noreply@luxemotors.com>',
          to: email,
          subject: subject || "Update from LuxeMotors",
          text: message,
        });
        results.push({ email, status: "sent" });
      } catch (e) {
        console.error(`Failed to send to ${email}:`, e);
        results.push({ email, status: "failed", error: String(e) });
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, results }),
    };
  } catch (error) {
    console.error("Broadcast function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};

export { handler };
