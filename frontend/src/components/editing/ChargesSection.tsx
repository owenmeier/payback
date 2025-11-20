import React from "react";

interface ChargesSectionProps {
	taxPercentage: number;
	taxTotal: number;
	tipPercentage: number;
	tipTotal: number;
	feesPercentage: number;
	feesTotal: number;
	inputValues: {
		[key: string]: {
			quantity?: string;
			price?: string;
			percentage?: string;
			total?: string;
		};
	};
	onTaxPercentageChange: (percentage: number) => void;
	onTaxTotalChange: (total: number) => void;
	onTipPercentageChange: (percentage: number) => void;
	onTipTotalChange: (total: number) => void;
	onFeesPercentageChange: (percentage: number) => void;
	onFeesTotalChange: (total: number) => void;
	setInputValues: React.Dispatch<
		React.SetStateAction<{
			[key: string]: {
				quantity?: string;
				price?: string;
				percentage?: string;
				total?: string;
			};
		}>
	>;
}

const ChargesSection: React.FC<ChargesSectionProps> = ({
	taxPercentage,
	taxTotal,
	tipPercentage,
	tipTotal,
	feesPercentage,
	feesTotal,
	inputValues,
	onTaxPercentageChange,
	onTaxTotalChange,
	onTipPercentageChange,
	onTipTotalChange,
	onFeesPercentageChange,
	onFeesTotalChange,
	setInputValues,
}) => {
	return (
		<div className="mt-6 bg-white rounded-lg shadow-sm p-6">
			<h2 className="text-lg font-bold text-gray-900 mb-4">Tax, Tip & Fees</h2>
			<div className="grid grid-cols-3 gap-6">
				{/* Tax */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Tax
					</label>
					<div className="space-y-2">
						<div>
							<label className="text-xs text-gray-600 mb-1 block">
								Percentage (%)
							</label>
							<input
								type="number"
								min="0"
								step="0.1"
								value={
									inputValues["tax"]?.percentage ??
									Math.round(taxPercentage * 1000) / 1000
								}
								onChange={(e) => {
									let val = e.target.value;
									// Limit to 3 decimal places
									if (val && val.includes(".")) {
										const parts = val.split(".");
										if (parts[1].length > 3) {
											val = parts[0] + "." + parts[1].substring(0, 3);
										}
									}
									setInputValues((prev) => ({
										...prev,
										tax: { ...(prev["tax"] || {}), percentage: val },
									}));
									if (val !== "") {
										onTaxPercentageChange(Math.max(0, parseFloat(val) || 0));
									}
								}}
								onBlur={(e) => {
									setInputValues((prev) => {
										const updated = { ...prev };
										if (updated["tax"]) {
											delete updated["tax"].percentage;
										}
										return updated;
									});
									if (e.target.value === "") {
										onTaxPercentageChange(0);
									}
								}}
								className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div>
							<label className="text-xs text-gray-600 mb-1 block">
								Total ($)
							</label>
							<input
								type="number"
								min="0"
								step="0.01"
								value={inputValues["tax"]?.total ?? taxTotal}
								onChange={(e) => {
									const val = e.target.value;
									setInputValues((prev) => ({
										...prev,
										tax: { ...(prev["tax"] || {}), total: val },
									}));
									if (val !== "") {
										onTaxTotalChange(Math.max(0, parseFloat(val) || 0));
									}
								}}
								onBlur={(e) => {
									setInputValues((prev) => {
										const updated = { ...prev };
										if (updated["tax"]) {
											delete updated["tax"].total;
										}
										return updated;
									});
									if (e.target.value === "") {
										onTaxTotalChange(0);
									}
								}}
								className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>
				</div>

				{/* Tip */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Tip
					</label>
					<div className="space-y-2">
						<div>
							<label className="text-xs text-gray-600 mb-1 block">
								Percentage (%)
							</label>
							<input
								type="number"
								min="0"
								step="0.1"
								value={
									inputValues["tip"]?.percentage ??
									Math.round(tipPercentage * 1000) / 1000
								}
								onChange={(e) => {
									let val = e.target.value;
									// Limit to 3 decimal places
									if (val && val.includes(".")) {
										const parts = val.split(".");
										if (parts[1].length > 3) {
											val = parts[0] + "." + parts[1].substring(0, 3);
										}
									}
									setInputValues((prev) => ({
										...prev,
										tip: { ...(prev["tip"] || {}), percentage: val },
									}));
									if (val !== "") {
										onTipPercentageChange(Math.max(0, parseFloat(val) || 0));
									}
								}}
								onBlur={(e) => {
									setInputValues((prev) => {
										const updated = { ...prev };
										if (updated["tip"]) {
											delete updated["tip"].percentage;
										}
										return updated;
									});
									if (e.target.value === "") {
										onTipPercentageChange(0);
									}
								}}
								className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div>
							<label className="text-xs text-gray-600 mb-1 block">
								Total ($)
							</label>
							<input
								type="number"
								min="0"
								step="0.01"
								value={inputValues["tip"]?.total ?? tipTotal}
								onChange={(e) => {
									const val = e.target.value;
									setInputValues((prev) => ({
										...prev,
										tip: { ...(prev["tip"] || {}), total: val },
									}));
									if (val !== "") {
										onTipTotalChange(Math.max(0, parseFloat(val) || 0));
									}
								}}
								onBlur={(e) => {
									setInputValues((prev) => {
										const updated = { ...prev };
										if (updated["tip"]) {
											delete updated["tip"].total;
										}
										return updated;
									});
									if (e.target.value === "") {
										onTipTotalChange(0);
									}
								}}
								className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>
				</div>

				{/* Fees */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Fees
					</label>
					<div className="space-y-2">
						<div>
							<label className="text-xs text-gray-600 mb-1 block">
								Percentage (%)
							</label>
							<input
								type="number"
								min="0"
								step="0.1"
								value={
									inputValues["fees"]?.percentage ??
									Math.round(feesPercentage * 1000) / 1000
								}
								onChange={(e) => {
									let val = e.target.value;
									// Limit to 3 decimal places
									if (val && val.includes(".")) {
										const parts = val.split(".");
										if (parts[1].length > 3) {
											val = parts[0] + "." + parts[1].substring(0, 3);
										}
									}
									setInputValues((prev) => ({
										...prev,
										fees: { ...(prev["fees"] || {}), percentage: val },
									}));
									if (val !== "") {
										onFeesPercentageChange(Math.max(0, parseFloat(val) || 0));
									}
								}}
								onBlur={(e) => {
									setInputValues((prev) => {
										const updated = { ...prev };
										if (updated["fees"]) {
											delete updated["fees"].percentage;
										}
										return updated;
									});
									if (e.target.value === "") {
										onFeesPercentageChange(0);
									}
								}}
								className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div>
							<label className="text-xs text-gray-600 mb-1 block">
								Total ($)
							</label>
							<input
								type="number"
								min="0"
								step="0.01"
								value={inputValues["fees"]?.total ?? feesTotal}
								onChange={(e) => {
									const val = e.target.value;
									setInputValues((prev) => ({
										...prev,
										fees: { ...(prev["fees"] || {}), total: val },
									}));
									if (val !== "") {
										onFeesTotalChange(Math.max(0, parseFloat(val) || 0));
									}
								}}
								onBlur={(e) => {
									setInputValues((prev) => {
										const updated = { ...prev };
										if (updated["fees"]) {
											delete updated["fees"].total;
										}
										return updated;
									});
									if (e.target.value === "") {
										onFeesTotalChange(0);
									}
								}}
								className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChargesSection;
