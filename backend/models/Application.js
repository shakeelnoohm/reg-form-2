import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  gender: String,
  dob: String,
  bio: String,
  resume: String,
  paymentId: String,
  paymentStatus: { type: String, default: "pending" },
}, { timestamps: true });

export default mongoose.model("Application", ApplicationSchema);
