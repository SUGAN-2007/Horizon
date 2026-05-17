import express from "express";
import { sendWelcomeEmail } from "../utils/mailer.js";

const router = express.Router();

router.post("/welcome", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    await sendWelcomeEmail(email);
    res.json({ message: "Welcome email sent successfully" });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    res.status(500).json({ error: "Failed to send welcome email" });
  }
});

export default router;
