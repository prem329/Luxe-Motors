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
    const { ownerEmail, bookingDetails } = JSON.parse(event.body || "{}");
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.ethereal.email",
      port: parseInt(process.env.SMTP_PORT || "587"),
      auth: {
        user: process.env.SMTP_USER || "test",
        pass: process.env.SMTP_PASS || "test",
      },
    });

    await transporter.sendMail({
      from: '"LuxeMotors" <noreply@luxemotors.com>',
      to: ownerEmail || "premsai58008@gmail.com",
      subject: `New Booking: ${bookingDetails.carName}`,
      text: `You have a new booking!\n\nCustomer: ${bookingDetails.name}\nEmail: ${bookingDetails.email}\nMobile: ${bookingDetails.mobile}\nVehicle: ${bookingDetails.carName}\nDate: ${bookingDetails.date}\nTime: ${bookingDetails.time}\n\nView details in your admin dashboard.`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("Booking Notification Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: String(error) }),
    };
  }
};

export { handler };
