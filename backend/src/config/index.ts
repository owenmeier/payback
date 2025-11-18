import dotenv from "dotenv";

dotenv.config();

export const config = {
	nodeEnv: process.env.NODE_ENV || "development",
	port: parseInt(process.env.PORT || "5000", 10),
	openaiApiKey: process.env.OPENAI_API_KEY || "",
	sessionSecret: process.env.SESSION_SECRET || "dev_secret",
	frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
	maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760", 10),
	uploadDir: process.env.UPLOAD_DIR || "uploads/temp",
	rateLimitWindowMs: parseInt(
		process.env.RATE_LIMIT_WINDOW_MS || "3600000",
		10
	),
	rateLimitMaxRequests: parseInt(
		process.env.RATE_LIMIT_MAX_REQUESTS || "10",
		10
	),
};

// ===== backend/src/middleware/errorHandler.ts =====
import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
	statusCode: number;
	isOperational: boolean;

	constructor(message: string, statusCode: number = 500) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = true;
		Error.captureStackTrace(this, this.constructor);
	}
}

export const errorHandler = (
	err: Error | AppError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error("Error:", err);

	if (err instanceof AppError) {
		return res.status(err.statusCode).json({
			success: false,
			error: err.message,
		});
	}

	// Default error
	res.status(500).json({
		success: false,
		error: "Internal server error",
	});
};
