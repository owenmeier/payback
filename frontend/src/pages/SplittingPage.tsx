import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { getMockReceipt, MockReceiptType } from "../services/mockApi";
import { useCalculateSplits } from "../hooks/useCalculateSplits";
import PersonList from "../components/splitting/PersonList";
import ItemsList from "../components/splitting/ItemsList";

const SplittingPage: React.FC = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { state, dispatch } = useApp();

	// Calculate splits based on current state
	const splits = useCalculateSplits(state.receipt, state.people);

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams, navigate, dispatch]);

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
						<div className="flex items-center gap-4">
							<button
								onClick={() => navigate("/edit-items")}
								className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
							>
								← Back to Editing
							</button>
							<span className="text-sm font-normal text-gray-500">
								{state.receipt.items.length} items
							</span>
						</div>
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
					<ItemsList />
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

					<PersonList splits={splits} />
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
						onClick={() => navigate("/results")}
						disabled={state.people.length === 0}
						className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
					>
						View Results →
					</button>
				</div>
			</div>
		</div>
	);
};

export default SplittingPage;
