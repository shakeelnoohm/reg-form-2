import express from "express";
import multer from "multer";
import { createOrder, submitApplication, getApplications } from "../controllers/applicationController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

router.post("/create-order", createOrder);
router.post("/submit", upload.single("resume"), submitApplication);
router.get("/applications", getApplications);

export default router;
