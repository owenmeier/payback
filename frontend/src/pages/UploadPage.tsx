import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { uploadReceipt, parseReceipt } from "../services/api";
import ImageDropzone from "../components/upload/ImageDropzone";
import Button from "../components/common/Button";

const UploadPage: React.FC = () => {
	const navigate = useNavigate();
	const { dispatch } = useApp();
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFileAccepted = (file: File) => {
		console.log("File accepted:", file.name);
		setSelectedFile(file);
		setError(null);
	};

	const handleUploadAndParse = async () => {
		if (!selectedFile) {
			setError("Please select a receipt image");
			return;
		}

		setIsUploading(true);
		setError(null);

		try {
			// Step 1: Upload the file
			dispatch({ type: "SET_LOADING", payload: true });
			const uploadResponse = await uploadReceipt(selectedFile);

			dispatch({ type: "SET_SESSION_ID", payload: uploadResponse.sessionId });

			// Step 2: Parse the receipt
			const parseResponse = await parseReceipt(
				uploadResponse.sessionId,
				uploadResponse.imageUrl
			);

			dispatch({ type: "SET_RECEIPT", payload: parseResponse.receipt });
			dispatch({ type: "SET_LOADING", payload: false });

			// Navigate to splitting page
			navigate("/split");
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "An error occurred";
			setError(errorMessage);
			dispatch({ type: "SET_ERROR", payload: errorMessage });
			dispatch({ type: "SET_LOADING", payload: false });
		} finally {
			setIsUploading(false);
		}
	};

	const handleUseMockData = () => {
		// Quick test button to skip upload and use mock data directly
		navigate("/split?mock=restaurant");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-4">
			<div className="max-w-2xl w-full">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-5xl font-bold text-gray-900 mb-3">
						Pay<span className="text-primary-600">Back</span>
					</h1>
					<p className="text-xl text-gray-600">
						Split bills fairly, settle up easily
					</p>
				</div>

				{/* Upload Card */}
				<div className="bg-white rounded-2xl shadow-xl p-8">
					<h2 className="text-2xl font-semibold text-gray-800 mb-6">
						Upload Your Receipt
					</h2>

					<ImageDropzone
						onFileAccepted={handleFileAccepted}
						isLoading={isUploading}
					/>

					{error && (
						<div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
							<p className="text-sm text-red-800">
								<span className="font-medium">Error:</span> {error}
							</p>
						</div>
					)}

					<div className="mt-6 flex flex-col sm:flex-row gap-3">
						<Button
							onClick={handleUploadAndParse}
							disabled={!selectedFile}
							isLoading={isUploading}
							className="flex-1"
						>
							Continue to Split
						</Button>

						{/* Development helper */}
						{import.meta.env.DEV && (
							<Button
								variant="outline"
								onClick={handleUseMockData}
								disabled={isUploading}
								className="flex-1"
							>
								Use Mock Data (Dev)
							</Button>
						)}
					</div>

					<div className="mt-6 pt-6 border-t border-gray-200">
						<h3 className="font-medium text-gray-700 mb-2">How it works:</h3>
						<ol className="space-y-2 text-sm text-gray-600">
							<li className="flex items-start gap-2">
								<span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">
									1
								</span>
								<span>Upload a photo of your receipt</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">
									2
								</span>
								<span>We'll extract all items and prices automatically</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">
									3
								</span>
								<span>Assign items to people who ordered them</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">
									4
								</span>
								<span>Get accurate split with tax and tip included</span>
							</li>
						</ol>
					</div>
				</div>

				{/* Footer */}
				<div className="text-center mt-8 text-sm text-gray-500">
					<p>Your receipt is processed securely and deleted after 24 hours</p>
				</div>
			</div>
		</div>
	);
};

export default UploadPage;
