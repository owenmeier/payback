import { Router } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { config } from "../config";
import { validateFileUpload } from "../middleware/validation";
import { AppError } from "../middleware/errorHandler";

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, config.uploadDir);
	},
	filename: (req, file, cb) => {
		const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
		cb(null, uniqueName);
	},
});

const upload = multer({
	storage,
	limits: {
		fileSize: config.maxFileSize,
	},
	fileFilter: (req, file, cb) => {
		const allowedMimeTypes = ["image/jpeg", "image/png", "image/heic"];
		if (allowedMimeTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new AppError("Invalid file type", 400));
		}
	},
});

router.post(
	"/",
	upload.single("receipt"),
	validateFileUpload,
	async (req, res, next) => {
		try {
			if (!req.file) {
				throw new AppError("No file uploaded", 400);
			}

			const sessionId = uuidv4();
			const imageUrl = `/uploads/${req.file.filename}`;

			// Store session data
			if (req.session) {
				req.session.sessionId = sessionId;
				req.session.imageUrl = imageUrl;
				req.session.people = [];
			}

			res.json({
				success: true,
				data: {
					sessionId,
					imageUrl,
				},
			});
		} catch (error) {
			next(error);
		}
	}
);

export default router;
