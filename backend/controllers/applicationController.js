import Razorpay from "razorpay";
import crypto from "crypto";
import Application from "../models/Application.js";
import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🧾 Create Razorpay Order
export const createOrder = async (req, res) => {
  const options = {
    amount: 50 * 100, // ₹50
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  };
  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Order creation failed" });
  }
};

// 🧩 Verify Payment and Submit Application
export const submitApplication = async (req, res) => {
  const {
    fullName,
    email,
    phone,
    gender,
    dob,
    bio,
    paymentId,
    orderId,
    signature,
  } = req.body;
  const resume = req.file ? req.file.filename : null;

  if (!resume) return res.status(400).json({ message: "Resume required" });

  try {
    // ✅ Step 1: Verify Razorpay Signature
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // ✅ Step 2: Save to DB after successful verification
    const newApp = new Application({
      fullName,
      email,
      phone,
      gender,
      dob,
      bio,
      resume,
      paymentId,
      paymentStatus: "success",
    });

    await newApp.save();
    res.json({ message: "Payment verified. Application submitted successfully!" });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ message: "Submission failed" });
  }
};

// 📋 Get all applications (for Admin)
export const getApplications = async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};
