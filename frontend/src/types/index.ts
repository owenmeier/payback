export interface Receipt {
	id: string;
	merchantName?: string;
	date?: string;
	items: ReceiptItem[];
	subtotal: number;
	tax: TaxItem[];
	tip: number;
	fees: FeeItem[];
	total: number;
	imageUrl?: string;
	createdAt: Date;
}

export interface ReceiptItem {
	id: string;
	description: string;
	price: number;
	quantity: number;
	assignedTo: string[]; // Array of person IDs
}

export interface TaxItem {
	description: string;
	amount: number;
}

export interface FeeItem {
	description: string;
	amount: number;
}

export interface Person {
	id: string;
	name: string;
	color?: string; // For UI visual distinction
}

export interface PersonSplit {
	personId: string;
	personName: string;
	items: AssignedItem[];
	subtotal: number;
	taxAmount: number;
	tipAmount: number;
	feeAmount: number;
	total: number;
}

export interface AssignedItem {
	itemId: string;
	description: string;
	quantity: number;
	fullPrice: number;
	splitAmount: number; // If shared among multiple people
	sharedWith: string[]; // Other person IDs
}

// API Response types
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export interface UploadResponse {
	sessionId: string;
	imageUrl: string;
}

export interface ParseResponse {
	receipt: Receipt;
	confidence: number;
}

export interface CalculateResponse {
	splits: PersonSplit[];
}

// Session data structure
export interface SessionData {
	sessionId: string;
	receipt?: Receipt;
	people: Person[];
	imageUrl?: string;
	createdAt: Date;
	updatedAt: Date;
}
