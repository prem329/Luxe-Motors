import { Handler } from "@netlify/functions";
import nodemailer from "nodemailer";

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { emails, subject, message } = JSON.parse(event.body || "{}");

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    if (emails && emails.length > 0) {
      for (const email of emails) {
        try {
          await transporter.sendMail({
            from: `"LuxeMotors" <${process.env.SMTP_USER}>`,
            to: email,
            subject: subject || "Update from LuxeMotors",
            text: message,
          });
        } catch (e) {
          console.error(`Failed to send to ${email}:`, e);
        }
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Emails sent successfully" }),
    };
  } catch (error) {
    console.error("SMTP Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Failed to send emails" }),
    };
  }
};

export { handler };
