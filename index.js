import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://keerthy-portfolio-work.netlify.app"],
    credentials: true,
  })
);
app.use(express.json());

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  console.log("Received:", { name, email, message });

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_RECEIVER,
    subject: `Message from ${name}`,
    html: `
        <h3>New Message from Portfolio</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result);
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ error: "Failed to send message",  details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
