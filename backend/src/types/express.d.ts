import { SessionData } from "./index";

declare module "express-session" {
	interface SessionData {
		sessionId: string;
		receipt?: Receipt;
		people: Person[];
		imageUrl?: string;
	}
}
