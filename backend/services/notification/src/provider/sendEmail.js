import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to, subject, text, replyTo = null) => {
  try {
    const mailOptions = {
      from: `"Job Portal" <${process.env.EMAIL_USER}>`, 
      to,
      subject,
      text,
      ...(replyTo && { replyTo }), // optional
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.response);

  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw error; 
  }
};