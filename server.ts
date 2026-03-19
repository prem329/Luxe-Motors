import express from "express";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/notify-booking", async (req, res) => {
    const { ownerEmail, bookingDetails } = req.body;
    
    try {
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
        to: ownerEmail,
        subject: `New Booking: ${bookingDetails.carName}`,
        text: `You have a new booking!\n\nCustomer: ${bookingDetails.name}\nEmail: ${bookingDetails.email}\nMobile: ${bookingDetails.mobile}\nVehicle: ${bookingDetails.carName}\nDate: ${bookingDetails.date}\nTime: ${bookingDetails.time}\n\nView details in your admin dashboard.`,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Booking Notification Error:", error);
      res.status(500).json({ success: false });
    }
  });

  app.post("/api/notify-new-car", async (req, res) => {
    const { emails, carName, carDetails, carImage } = req.body;
    
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.ethereal.email",
        port: parseInt(process.env.SMTP_PORT || "587"),
        auth: {
          user: process.env.SMTP_USER || "test",
          pass: process.env.SMTP_PASS || "test",
        },
      });

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
                  <a href="${process.env.APP_URL || 'http://localhost:3000'}/inventory" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Inventory</a>
                </div>
              </div>
            `,
          });
        } catch (e) {
          console.error(`Failed to notify ${email}:`, e);
        }
      }

      res.json({ success: true });
    } catch (error) {
      console.error("New Car Notification Error:", error);
      res.status(500).json({ success: false });
    }
  });

  app.post("/api/broadcast", async (req, res) => {
    const { emails, subject, message } = req.body;
    
    try {
      // In a real application, you would use real SMTP credentials from process.env
      // For this demo, we'll use ethereal email (a fake SMTP service for testing)
      // or just simulate success if no credentials are provided.
      
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.ethereal.email",
        port: parseInt(process.env.SMTP_PORT || "587"),
        auth: {
          user: process.env.SMTP_USER || "test",
          pass: process.env.SMTP_PASS || "test",
        },
      });

      // Send emails
      if (emails && emails.length > 0) {
        for (const email of emails) {
          try {
            await transporter.sendMail({
              from: '"LuxeMotors" <noreply@luxemotors.com>',
              to: email,
              subject: subject || "Update from LuxeMotors",
              text: message,
            });
          } catch (e) {
            console.error(`Failed to send to ${email}:`, e);
            // Continue with other emails even if one fails
          }
        }
      }

      res.json({ success: true, message: "Emails sent successfully" });
    } catch (error) {
      console.error("SMTP Error:", error);
      res.status(500).json({ success: false, error: "Failed to send emails" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
