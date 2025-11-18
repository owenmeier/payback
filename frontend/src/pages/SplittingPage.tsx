import React from "react";

const SplittingPage: React.FC = () => {
	return (
		<div className="min-h-screen p-4">
			<h1 className="text-2xl font-bold mb-4">Itemize Your Bill</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="border rounded-lg p-4">
					<h2 className="text-xl font-semibold mb-4">Receipt Items</h2>
					<p className="text-gray-500">Items list coming soon...</p>
				</div>
				<div className="border rounded-lg p-4">
					<h2 className="text-xl font-semibold mb-4">People</h2>
					<p className="text-gray-500">People list coming soon...</p>
				</div>
			</div>
		</div>
	);
};

export default SplittingPage;
