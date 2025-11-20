import React from "react";

interface SummaryBoxProps {
	subtotal: number;
	taxTotal: number;
	feesTotal: number;
	tipTotal: number;
}

const SummaryBox: React.FC<SummaryBoxProps> = ({
	subtotal,
	taxTotal,
	feesTotal,
	tipTotal,
}) => {
	const total = subtotal + taxTotal + feesTotal + tipTotal;

	return (
		<div className="mt-6 bg-gradient-to-r from-blue-50 to-gray-50 rounded-lg shadow-sm p-6 border border-blue-100">
			<div className="grid grid-cols-5 gap-4 items-end">
				{/* Subtotal */}
				<div>
					<p className="text-xs text-gray-600 mb-1">Subtotal</p>
					<p className="text-2xl font-bold text-gray-900">
						${subtotal.toFixed(2)}
					</p>
				</div>

				{/* Plus Tax */}
				<div className="text-center">
					<p className="text-xs text-gray-600 mb-1">+ Tax</p>
					<p className="text-xl font-semibold text-gray-800">
						${taxTotal.toFixed(2)}
					</p>
				</div>

				{/* Plus Fees */}
				<div className="text-center">
					<p className="text-xs text-gray-600 mb-1">+ Fees</p>
					<p className="text-xl font-semibold text-gray-800">
						${feesTotal.toFixed(2)}
					</p>
				</div>

				{/* Plus Tip */}
				<div className="text-center">
					<p className="text-xs text-gray-600 mb-1">+ Tip</p>
					<p className="text-xl font-semibold text-gray-800">
						${tipTotal.toFixed(2)}
					</p>
				</div>

				{/* Total */}
				<div className="text-right">
					<p className="text-xs text-gray-600 mb-1 font-medium">Total</p>
					<p className="text-3xl font-bold text-blue-600">
						${total.toFixed(2)}
					</p>
				</div>
			</div>
		</div>
	);
};

export default SummaryBox;
