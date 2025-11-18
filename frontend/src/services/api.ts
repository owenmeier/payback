import axios from "axios";
import type { ApiResponse, UploadResponse, ParseResponse } from "../types";
import { USE_MOCK_API, mockUploadReceipt, mockParseReceipt } from "./mockApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
	baseURL: `${API_URL}/api`,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

export const uploadReceipt = async (file: File): Promise<UploadResponse> => {
	// Use mock API in development
	if (USE_MOCK_API) {
		console.log("🎭 Using mock API for upload");
		return mockUploadReceipt(file);
	}

	const formData = new FormData();
	formData.append("receipt", file);

	const response = await api.post<ApiResponse<UploadResponse>>(
		"/upload",
		formData,
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}
	);

	if (!response.data.success || !response.data.data) {
		throw new Error(response.data.error || "Upload failed");
	}

	return response.data.data;
};

export const parseReceipt = async (
	sessionId: string,
	imageUrl: string
): Promise<ParseResponse> => {
	// Use mock API in development
	if (USE_MOCK_API) {
		console.log("🎭 Using mock API for parsing");
		return mockParseReceipt(sessionId, imageUrl);
	}

	const response = await api.post<ApiResponse<ParseResponse>>("/parse", {
		sessionId,
		imageUrl,
	});

	if (!response.data.success || !response.data.data) {
		throw new Error(response.data.error || "Parse failed");
	}

	return response.data.data;
};

export default api;
