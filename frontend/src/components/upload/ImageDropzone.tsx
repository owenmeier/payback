import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface ImageDropzoneProps {
	onFileAccepted: (file: File) => void;
	isLoading?: boolean;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({
	onFileAccepted,
	isLoading,
}) => {
	const [preview, setPreview] = useState<string | null>(null);

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			if (acceptedFiles.length > 0) {
				const file = acceptedFiles[0];

				// Create preview
				const reader = new FileReader();
				reader.onload = () => {
					setPreview(reader.result as string);
				};
				reader.readAsDataURL(file);

				// Pass file to parent
				onFileAccepted(file);
			}
		},
		[onFileAccepted]
	);

	const { getRootProps, getInputProps, isDragActive, fileRejections } =
		useDropzone({
			onDrop,
			accept: {
				"image/jpeg": [".jpg", ".jpeg"],
				"image/png": [".png"],
				"image/heic": [".heic"],
			},
			maxSize: 10 * 1024 * 1024, // 10MB
			maxFiles: 1,
			disabled: isLoading,
		});

	const hasError = fileRejections.length > 0;
	const errorMessage = fileRejections[0]?.errors[0]?.message;

	return (
		<div className="w-full">
			<div
				{...getRootProps()}
				className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${
						isDragActive
							? "border-primary-500 bg-primary-50"
							: "border-gray-300 hover:border-primary-400"
					}
          ${hasError ? "border-red-400 bg-red-50" : ""}
          ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
          ${preview ? "pb-4" : "py-16"}
        `}
			>
				<input {...getInputProps()} />

				{!preview && (
					<div className="flex flex-col items-center gap-4">
						<div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
							<svg
								className="w-8 h-8 text-primary-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
								/>
							</svg>
						</div>

						<div>
							<p className="text-lg font-medium text-gray-700">
								{isDragActive
									? "Drop your receipt here"
									: "Drag & drop your receipt"}
							</p>
							<p className="text-sm text-gray-500 mt-1">or click to browse</p>
						</div>

						<div className="text-xs text-gray-400">
							JPG, PNG, or HEIC • Max 10MB
						</div>
					</div>
				)}

				{preview && !isLoading && (
					<div className="space-y-4">
						<img
							src={preview}
							alt="Receipt preview"
							className="max-h-64 mx-auto rounded-lg shadow-md object-contain"
						/>
						<p className="text-sm text-gray-600">
							Click to change or drag a new image
						</p>
					</div>
				)}

				{isLoading && (
					<div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-xl">
						<div className="text-center">
							<div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
							<p className="mt-4 text-gray-700 font-medium">
								Processing receipt...
							</p>
							<p className="text-sm text-gray-500">
								This may take a few seconds
							</p>
						</div>
					</div>
				)}
			</div>

			{hasError && (
				<div className="mt-2 text-sm text-red-600">
					{errorMessage || "Error uploading file"}
				</div>
			)}
		</div>
	);
};

export default ImageDropzone;
