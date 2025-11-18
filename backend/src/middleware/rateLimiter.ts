import { Request, Response, NextFunction } from "express";

interface RateLimitStore {
	[key: string]: {
		count: number;
		resetTime: number;
	};
}

const store: RateLimitStore = {};

export const rateLimiter = (windowMs: number, maxRequests: number) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const ip = req.ip || req.socket.remoteAddress || "unknown";
		const now = Date.now();

		// Clean up old entries
		if (store[ip] && store[ip].resetTime < now) {
			delete store[ip];
		}

		// Initialize or update counter
		if (!store[ip]) {
			store[ip] = {
				count: 1,
				resetTime: now + windowMs,
			};
			return next();
		}

		store[ip].count++;

		if (store[ip].count > maxRequests) {
			return res.status(429).json({
				success: false,
				error: "Too many requests, please try again later",
			});
		}

		next();
	};
};
