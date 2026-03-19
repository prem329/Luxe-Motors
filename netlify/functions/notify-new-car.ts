import { Handler } from "@netlify/functions";
import nodemailer from "nodemailer";

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { emails, carName, carDetails, carImage } = JSON.parse(event.body || "{}");
    
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
          subject: `New Arrival: ${carName}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #10b981;">New Vehicle Alert!</h2>
              <p>We just added a new <strong>${carName}</strong> to our inventory.</p>
              <img src="${carImage}" alt="${carName}" style="width: 100%; border-radius: 10px; margin: 20px 0;">
              <p>${carDetails}</p>
              <div style="margin-top: 30px; text-align: center;">
                <a href="${process.env.APP_URL || 'https://luxemotors.netlify.app'}/inventory" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Inventory</a>
              </div>
            </div>
          `,
        });
        results.push({ email, status: "sent" });
      } catch (e) {
        console.error(`Failed to notify ${email}:`, e);
        results.push({ email, status: "failed", error: String(e) });
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, results }),
    };
  } catch (error) {
    console.error("New Car Notification Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: String(error) }),
    };
  }
};

export { handler };
