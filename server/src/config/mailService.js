import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import createHttpError from "http-errors";

export default async function mailService({
  from,
  to,
  subject,
  text,
  username,
  link,
  btnText,
  instructions,
}) {
  try {
    if (!to || !subject || !text) {
      throw createHttpError(500, "Email recipient, subject, and text are required");
    }

    // Initialize Mailgen
    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Instapics",
        link: process.env.CLIENT_URL || "https://instapics.vercel.app",
      },
    });

    // Email template configuration
    const email = {
      body: {
        name: username || "User",
        intro: text,
        action: {
          instructions: instructions || "To get started with Instapics, please click here:",
          button: {
            color: "#3182CE",
            text: btnText || "Visit",
            link: link || process.env.CLIENT_URL,
          },
        },
        outro: "Need help, or have questions? Reply to this email",
      },
    };

    // Generate email HTML
    const emailBody = mailGenerator.generate(email);

    // Validate SMTP configuration
    if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
      throw createHttpError(500, "Email service not properly configured");
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Verify transporter connection
    await transporter.verify().catch((error) => {
      throw createHttpError(500, `Failed to connect to email service: ${error.message}`);
    });

    // Send email
    const info = await transporter.sendMail({
      from: from || `Instapics <${process.env.EMAIL}>`,
      to: to,
      subject: subject,
      html: emailBody,
    });

    // Log success (only in development)
    if (process.env.NODE_ENV === "development") {
      console.log("✉️ Email sent successfully");
      console.log("Message ID:", info.messageId);
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    }

    return {
      success: true,
      messageId: info.messageId
    };

  } catch (error) {
    // Handle specific nodemailer errors
    if (error.code === 'EAUTH') {
      throw createHttpError(500, "Failed to authenticate with email service");
    }
    if (error.code === 'ESOCKET') {
      throw createHttpError(500, "Failed to connect to email service");
    }
    if (error.code === 'EENVELOPE') {
      throw createHttpError(400, "Invalid email address format");
    }
    
    // Rethrow HTTP errors
    if (error.status) {
      throw error;
    }

    // Handle unexpected errors
    console.error("❌ Email service error:", error);
    throw createHttpError(500, "Failed to send email. Please try again later.");
  }
}
