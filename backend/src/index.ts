import express from "express";
import cors from "cors";
import session from "express-session";
import path from "path";
import { config } from "./config";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { rateLimiter } from "./middleware/rateLimiter";

const app = express();

// Middleware
app.use(
	cors({
		origin: config.frontendUrl,
		credentials: true,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
	session({
		secret: config.sessionSecret,
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: config.nodeEnv === "production",
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000, // 24 hours
		},
	})
);

// Rate limiting
app.use(
	"/api",
	rateLimiter(config.rateLimitWindowMs, config.rateLimitMaxRequests)
);

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api", routes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
	console.log(`🚀 Server running on http://localhost:${config.port}`);
	console.log(`📝 Environment: ${config.nodeEnv}`);
});
