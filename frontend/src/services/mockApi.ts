import { UploadResponse, ParseResponse } from "../types";
import { mockReceipts, MockReceiptType } from "../data/mockReceipts";

// Export the type for use in other files
export type { MockReceiptType };

// Flag to enable/disable mock mode
export const USE_MOCK_API = true; // Set to false when ready for real API

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockUploadReceipt = async (
	file: File
): Promise<UploadResponse> => {
	// Simulate network delay
	await delay(1000);

	// Validate file type
	const allowedTypes = ["image/jpeg", "image/png", "image/heic"];
	if (!allowedTypes.includes(file.type)) {
		throw new Error("Invalid file type. Only JPG, PNG, and HEIC are allowed");
	}

	// Validate file size (10MB)
	const maxSize = 10 * 1024 * 1024;
	if (file.size > maxSize) {
		throw new Error("File too large. Maximum size is 10MB");
	}

	const sessionId = `mock-session-${Date.now()}`;
	const imageUrl = URL.createObjectURL(file);

	return {
		sessionId,
		imageUrl,
	};
};

export const mockParseReceipt = async (
	sessionId: string,
	imageUrl: string
): Promise<ParseResponse> => {
	// Simulate GPT-4o processing time
	await delay(3000);

	// Randomly select a mock receipt for testing
	const receiptKeys = Object.keys(mockReceipts);
	const randomKey = receiptKeys[Math.floor(Math.random() * receiptKeys.length)];
	const receipt = mockReceipts[randomKey];

	// Add the image URL to the receipt
	const receiptWithImage = {
		...receipt,
		imageUrl,
		id: sessionId,
	};

	return {
		receipt: receiptWithImage,
		confidence: 0.95,
	};
};

// Helper to select specific mock receipt
export const getMockReceipt = (type: MockReceiptType) => {
	return mockReceipts[type];
};
