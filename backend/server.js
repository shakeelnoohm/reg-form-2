import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import appRoutes from "./routes/applicationRoutes.js";

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api", appRoutes);

app.listen(5000, () => console.log("Server running on port 5000 🚀"));

