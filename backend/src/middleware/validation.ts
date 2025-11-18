import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";

export const validateFileUpload = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.file) {
		throw new AppError("No file uploaded", 400);
	}

	const allowedMimeTypes = ["image/jpeg", "image/png", "image/heic"];
	if (!allowedMimeTypes.includes(req.file.mimetype)) {
		throw new AppError(
			"Invalid file type. Only JPG, PNG, and HEIC are allowed",
			400
		);
	}

	next();
};
