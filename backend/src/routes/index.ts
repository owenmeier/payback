import { Router } from "express";
import uploadRouter from "./upload";
import parseRouter from "./parse";
import sessionRouter from "./session";

const router = Router();

router.use("/upload", uploadRouter);
router.use("/parse", parseRouter);
router.use("/session", sessionRouter);

// Health check
router.get("/health", (req, res) => {
	res.json({ success: true, message: "API is running" });
});

export default router;
