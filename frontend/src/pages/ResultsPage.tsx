import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { useCalculateSplits } from "../hooks/useCalculateSplits";
import { PERSON_COLORS, getInitials } from "../utils/colors";

const ResultsPage: React.FC = () => {
	const navigate = useNavigate();
	const { state } = useApp();
	const splits = useCalculateSplits(state.receipt, state.people);
	const [expandedPersonId, setExpandedPersonId] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		// Redirect if no receipt or no people
		if (!state.receipt || state.people.length === 0) {
			navigate("/split");
		}
	}, [state.receipt, state.people, navigate]);

	if (!state.receipt) {
		return null;
	}

	const handleCopyResults = () => {
		const text = generateShareableText();
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const generateShareableText = () => {
		let text = `💰 ${state.receipt?.merchantName || "Bill"} Split Results\n`;
		text += `📅 ${state.receipt?.date || "Today"}\n`;
		text += `💵 Total: $${state.receipt?.total.toFixed(2)}\n\n`;

		text += `👥 Split Between:\n`;
		splits.forEach((split) => {
			text += `\n${split.personName}: $${split.total.toFixed(2)}\n`;
			text += `  Items: $${split.subtotal.toFixed(2)}\n`;
			if (split.taxAmount > 0) {
				text += `  Tax: $${split.taxAmount.toFixed(2)}\n`;
			}
			if (split.tipAmount > 0) {
				text += `  Tip: $${split.tipAmount.toFixed(2)}\n`;
			}
			if (split.feeAmount > 0) {
				text += `  Fees: $${split.feeAmount.toFixed(2)}\n`;
			}
		});

		text += `\n✨ Split with PayBack`;
		return text;
	};

	const totalAssigned = splits.reduce((sum, split) => sum + split.total, 0);
	const unassignedItems = state.receipt.items.filter(
		(item) => item.assignedTo.length === 0
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 p-4">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
						<svg
							className="w-8 h-8 text-green-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<h1 className="text-4xl font-bold text-gray-900 mb-2">
						Bill Split Complete!
					</h1>
					<p className="text-gray-600">
						{state.receipt.merchantName || "Receipt"} •{" "}
						{state.receipt.date || "Today"}
					</p>
				</div>

				{/* Summary Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
					<div className="bg-white rounded-lg shadow-md p-6 text-center">
						<p className="text-sm text-gray-600 mb-1">Total Bill</p>
						<p className="text-3xl font-bold text-gray-900">
							${state.receipt.total.toFixed(2)}
						</p>
					</div>
					<div className="bg-white rounded-lg shadow-md p-6 text-center">
						<p className="text-sm text-gray-600 mb-1">Split Between</p>
						<p className="text-3xl font-bold text-primary-600">
							{state.people.length}
						</p>
						<p className="text-xs text-gray-500 mt-1">
							{state.people.length === 1 ? "person" : "people"}
						</p>
					</div>
					<div className="bg-white rounded-lg shadow-md p-6 text-center">
						<p className="text-sm text-gray-600 mb-1">Items Assigned</p>
						<p className="text-3xl font-bold text-green-600">
							{state.receipt.items.length - unassignedItems.length}
						</p>
						<p className="text-xs text-gray-500 mt-1">
							of {state.receipt.items.length} items
						</p>
					</div>
				</div>

				{/* Unassigned Items Warning */}
				{unassignedItems.length > 0 && (
					<div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg
									className="h-5 w-5 text-orange-400"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<p className="text-sm text-orange-800 font-medium">
									{unassignedItems.length} item
									{unassignedItems.length > 1 ? "s" : ""} not assigned
								</p>
								<p className="text-xs text-orange-700 mt-1">
									These items are not included in the split calculation
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Individual Splits */}
				<div className="space-y-4 mb-8">
					{splits.map((split) => {
						const person = state.people.find((p) => p.id === split.personId);
						if (!person) return null;

						const colorIndex = PERSON_COLORS.findIndex(
							(c) => c.name === person.color
						);
						const color =
							colorIndex >= 0 ? PERSON_COLORS[colorIndex] : PERSON_COLORS[0];
						const isExpanded = expandedPersonId === split.personId;

						return (
							<div
								key={split.personId}
								className="bg-white rounded-lg shadow-md overflow-hidden"
							>
								{/* Person Header */}
								<div
									className={`p-6 ${color.light} border-l-4 border-${person.color}-500`}
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-4">
											<div
												className={`w-12 h-12 rounded-full ${color.bg} text-white flex items-center justify-center font-bold text-lg`}
											>
												{getInitials(person.name)}
											</div>
											<div>
												<h3 className="text-xl font-bold text-gray-900">
													{split.personName}
												</h3>
												<p className="text-sm text-gray-600">
													{split.items.length} item
													{split.items.length !== 1 ? "s" : ""}
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="text-3xl font-bold text-gray-900">
												${split.total.toFixed(2)}
											</p>
											<button
												onClick={() =>
													setExpandedPersonId(
														isExpanded ? null : split.personId
													)
												}
												className="text-sm text-primary-600 hover:text-primary-700 font-medium mt-1"
											>
												{isExpanded ? "Hide details ▲" : "Show details ▼"}
											</button>
										</div>
									</div>
								</div>

								{/* Expanded Details */}
								{isExpanded && (
									<div className="p-6 border-t border-gray-200">
										{/* Items */}
										<div className="mb-4">
											<h4 className="font-semibold text-gray-900 mb-3">
												Items:
											</h4>
											<div className="space-y-2">
												{split.items.map((item) => (
													<div
														key={item.itemId}
														className="flex justify-between text-sm"
													>
														<div className="flex-1">
															<span className="text-gray-700">
																{item.description}
															</span>
															{item.sharedWith.length > 0 && (
																<span className="ml-2 text-xs text-blue-600">
																	(shared with {item.sharedWith.length} other
																	{item.sharedWith.length > 1 ? "s" : ""})
																</span>
															)}
														</div>
														<span className="font-medium text-gray-900">
															${item.splitAmount.toFixed(2)}
														</span>
													</div>
												))}
											</div>
										</div>

										{/* Breakdown */}
										<div className="pt-4 border-t border-gray-200 space-y-2 text-sm">
											<div className="flex justify-between">
												<span className="text-gray-600">Items Subtotal</span>
												<span className="font-medium">
													${split.subtotal.toFixed(2)}
												</span>
											</div>
											{split.taxAmount > 0 && (
												<div className="flex justify-between">
													<span className="text-gray-600">Tax</span>
													<span className="font-medium">
														${split.taxAmount.toFixed(2)}
													</span>
												</div>
											)}
											{split.tipAmount > 0 && (
												<div className="flex justify-between">
													<span className="text-gray-600">Tip</span>
													<span className="font-medium">
														${split.tipAmount.toFixed(2)}
													</span>
												</div>
											)}
											{split.feeAmount > 0 && (
												<div className="flex justify-between">
													<span className="text-gray-600">Fees</span>
													<span className="font-medium">
														${split.feeAmount.toFixed(2)}
													</span>
												</div>
											)}
											<div className="flex justify-between pt-2 border-t border-gray-300 font-bold text-base">
												<span className="text-gray-900">Total</span>
												<span className="text-gray-900">
													${split.total.toFixed(2)}
												</span>
											</div>
										</div>
									</div>
								)}
							</div>
						);
					})}
				</div>

				{/* Verification */}
				<div className="bg-gray-50 rounded-lg p-6 mb-8">
					<h3 className="font-semibold text-gray-900 mb-3">
						Split Verification:
					</h3>
					<div className="flex justify-between text-sm mb-2">
						<span className="text-gray-600">Sum of individual totals:</span>
						<span className="font-medium">${totalAssigned.toFixed(2)}</span>
					</div>
					<div className="flex justify-between text-sm mb-2">
						<span className="text-gray-600">Original receipt total:</span>
						<span className="font-medium">
							${state.receipt.total.toFixed(2)}
						</span>
					</div>
					<div className="flex justify-between text-sm pt-2 border-t border-gray-300">
						<span className="text-gray-700 font-medium">Difference:</span>
						<span
							className={`font-bold ${
								Math.abs(totalAssigned - state.receipt.total) < 0.01
									? "text-green-600"
									: "text-orange-600"
							}`}
						>
							${Math.abs(totalAssigned - state.receipt.total).toFixed(2)}
						</span>
					</div>
					{Math.abs(totalAssigned - state.receipt.total) < 0.01 && (
						<p className="text-xs text-green-600 mt-2">✓ Split is accurate!</p>
					)}
				</div>

				{/* Actions */}
				<div className="flex flex-col sm:flex-row gap-4">
					<button
						onClick={() => navigate("/split")}
						className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
					>
						← Back to Edit
					</button>
					<button
						onClick={handleCopyResults}
						className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
					>
						{copied ? (
							<>
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
								Copied!
							</>
						) : (
							<>
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
									/>
								</svg>
								Copy Results
							</>
						)}
					</button>
					<button
						onClick={() => navigate("/")}
						className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
					>
						Split Another Bill →
					</button>
				</div>
			</div>
		</div>
	);
};

export default ResultsPage;
