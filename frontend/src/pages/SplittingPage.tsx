import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { getMockReceipt, MockReceiptType } from "../services/mockApi";

const SplittingPage: React.FC = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { state, dispatch } = useApp();

	useEffect(() => {
		// Check if we're using mock data (for development)
		const mockType = searchParams.get("mock");
		if (mockType && import.meta.env.DEV) {
			const validMockTypes: MockReceiptType[] = [
				"simple",
				"restaurant",
				"delivery",
				"complex",
			];
			if (validMockTypes.includes(mockType as MockReceiptType)) {
				const mockReceipt = getMockReceipt(mockType as MockReceiptType);
				if (mockReceipt) {
					dispatch({ type: "SET_RECEIPT", payload: mockReceipt });
					dispatch({ type: "SET_SESSION_ID", payload: mockReceipt.id });
				}
			}
		}

		// If no receipt data, redirect to upload
		if (!state.receipt && !mockType) {
			navigate("/");
		}
	}, [searchParams, state.receipt, navigate, dispatch]);

	if (!state.receipt) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			{/* Header */}
			<div className="max-w-7xl mx-auto mb-6">
				<div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Split Your Bill
						</h1>
						<p className="text-sm text-gray-600 mt-1">
							{state.receipt.merchantName || "Receipt"} •{" "}
							{state.receipt.date || "Today"}
						</p>
					</div>
					<div className="text-right">
						<p className="text-sm text-gray-600">Total</p>
						<p className="text-3xl font-bold text-primary-600">
							${state.receipt.total.toFixed(2)}
						</p>
					</div>
				</div>
			</div>

			{/* Main Content - Split Screen */}
			<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Left Panel - Receipt Items */}
				<div className="bg-white rounded-lg shadow-sm p-6">
					<h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
						<span>Receipt Items</span>
						<span className="text-sm font-normal text-gray-500">
							{state.receipt.items.length} items
						</span>
					</h2>

					{/* Receipt Summary */}
					<div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
						<div className="flex justify-between">
							<span className="text-gray-600">Subtotal</span>
							<span className="font-medium">
								${state.receipt.subtotal.toFixed(2)}
							</span>
						</div>
						{state.receipt.tax.map((tax, idx) => (
							<div key={idx} className="flex justify-between">
								<span className="text-gray-600">{tax.description}</span>
								<span className="font-medium">${tax.amount.toFixed(2)}</span>
							</div>
						))}
						{state.receipt.tip > 0 && (
							<div className="flex justify-between">
								<span className="text-gray-600">Tip</span>
								<span className="font-medium">
									${state.receipt.tip.toFixed(2)}
								</span>
							</div>
						)}
						{state.receipt.fees.map((fee, idx) => (
							<div key={idx} className="flex justify-between">
								<span className="text-gray-600">{fee.description}</span>
								<span className="font-medium">${fee.amount.toFixed(2)}</span>
							</div>
						))}
						<div className="flex justify-between pt-2 border-t border-gray-300">
							<span className="font-semibold text-gray-800">Total</span>
							<span className="font-bold text-lg">
								${state.receipt.total.toFixed(2)}
							</span>
						</div>
					</div>

					{/* Items List */}
					<div className="space-y-2 max-h-[600px] overflow-y-auto">
						{state.receipt.items.map((item) => (
							<div
								key={item.id}
								className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
							>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<h3 className="font-medium text-gray-800">
											{item.description}
										</h3>
										{item.quantity > 1 && (
											<p className="text-sm text-gray-500 mt-1">
												Qty: {item.quantity}
											</p>
										)}
									</div>
									<div className="text-right ml-4">
										<p className="font-semibold text-gray-900">
											${item.price.toFixed(2)}
										</p>
										{item.assignedTo.length > 0 && (
											<div className="mt-1 flex gap-1 justify-end">
												{item.assignedTo.slice(0, 3).map((personId, idx) => (
													<div
														key={personId}
														className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center"
													>
														{idx + 1}
													</div>
												))}
												{item.assignedTo.length > 3 && (
													<div className="w-6 h-6 rounded-full bg-gray-300 text-gray-700 text-xs flex items-center justify-center">
														+{item.assignedTo.length - 3}
													</div>
												)}
											</div>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Right Panel - People */}
				<div className="bg-white rounded-lg shadow-sm p-6">
					<h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
						<span>People Splitting</span>
						<span className="text-sm font-normal text-gray-500">
							{state.people.length}{" "}
							{state.people.length === 1 ? "person" : "people"}
						</span>
					</h2>

					{/* Add Person Form - Placeholder */}
					<div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
						<p className="text-gray-500 text-sm">
							Add people component coming soon...
						</p>
						<button className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm">
							+ Add Person
						</button>
					</div>

					{/* People List - Placeholder */}
					{state.people.length === 0 ? (
						<div className="text-center py-12">
							<div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
								<svg
									className="w-8 h-8 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
									/>
								</svg>
							</div>
							<p className="text-gray-600">No people added yet</p>
							<p className="text-sm text-gray-500 mt-1">
								Add people to start splitting the bill
							</p>
						</div>
					) : (
						<div className="space-y-3">
							{state.people.map((person) => (
								<div
									key={person.id}
									className="p-4 border border-gray-200 rounded-lg"
								>
									<p className="font-medium text-gray-800">{person.name}</p>
									<p className="text-sm text-gray-500 mt-1">
										0 items assigned • $0.00
									</p>
								</div>
							))}
						</div>
					)}

					{/* Instructions */}
					<div className="mt-8 p-4 bg-blue-50 rounded-lg">
						<h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
							<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
									clipRule="evenodd"
								/>
							</svg>
							How to split
						</h3>
						<ol className="space-y-1 text-sm text-blue-800">
							<li>1. Add everyone who's splitting the bill</li>
							<li>2. Select a person, then click items they ordered</li>
							<li>3. For shared items, assign to multiple people</li>
							<li>4. Review the split and share with your group</li>
						</ol>
					</div>
				</div>
			</div>

			{/* Bottom Actions */}
			<div className="max-w-7xl mx-auto mt-6">
				<div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
					<button
						onClick={() => navigate("/")}
						className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
					>
						← Back to Upload
					</button>
					<button
						disabled={state.people.length === 0}
						className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
					>
						Calculate Split →
					</button>
				</div>
			</div>
		</div>
	);
};

export default SplittingPage;
