import React from "react";

const UploadPage: React.FC = () => {
	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="max-w-2xl w-full">
				<h1 className="text-4xl font-bold text-center mb-8">PayBack</h1>
				<p className="text-center text-gray-600 mb-8">
					Upload your receipt to get started
				</p>
				{/* Upload component will go here */}
				<div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
					<p className="text-gray-500">Upload component coming soon...</p>
				</div>
			</div>
		</div>
	);
};

export default UploadPage;
