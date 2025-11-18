import { Router } from "express";

const router = Router();

router.post("/", async (req, res, next) => {
	try {
		// TODO: Implement GPT-4o parsing
		res.json({
			success: true,
			message: "Parse endpoint - to be implemented",
		});
	} catch (error) {
		next(error);
	}
});

export default router;
