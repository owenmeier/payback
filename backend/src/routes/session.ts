import { Router } from "express";

const router = Router();

router.get("/:sessionId", async (req, res, next) => {
	try {
		// TODO: Implement session retrieval
		res.json({
			success: true,
			message: "Session endpoint - to be implemented",
		});
	} catch (error) {
		next(error);
	}
});

export default router;
