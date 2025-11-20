import React from "react";
import { ReceiptItem } from "../../types";

interface ItemsListProps {
	items: ReceiptItem[];
	editedItems: {
		[key: string]: {
			quantity?: number;
			price?: number;
			description?: string;
		};
	};
	inputValues: {
		[key: string]: {
			quantity?: string;
			price?: string;
			percentage?: string;
			total?: string;
		};
	};
	onQuantityChange: (itemId: string, newQuantity: number) => void;
	onPriceChange: (itemId: string, newPrice: number) => void;
	onDescriptionChange: (itemId: string, newDescription: string) => void;
	onSplitItem: (itemId: string) => void;
	onDeleteItem: (itemId: string) => void;
	onAddItem: () => void;
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
	getDisplayQuantity: (item: ReceiptItem) => number;
	getDisplayPrice: (item: ReceiptItem) => number;
	getDisplayDescription: (item: ReceiptItem) => string;
	getItemTotal: (item: ReceiptItem) => number;
}

const ItemsList: React.FC<ItemsListProps> = ({
	items,
	inputValues,
	onQuantityChange,
	onPriceChange,
	onDescriptionChange,
	onSplitItem,
	onDeleteItem,
	onAddItem,
	setInputValues,
	getDisplayQuantity,
	getDisplayPrice,
	getDisplayDescription,
	getItemTotal,
}) => {
	return (
		<div className="bg-white rounded-lg shadow-sm p-6">
			{items.length === 0 ? (
				<p className="text-gray-500">No items to display</p>
			) : (
				items.map((item) => (
					<div
						key={item.id}
						className="mb-6 p-4 border border-gray-200 rounded-lg"
					>
						{/* Item header: name (editable) and total cost */}
						<div className="flex items-center justify-between mb-4 gap-4">
							<input
								type="text"
								value={getDisplayDescription(item)}
								onChange={(e) => onDescriptionChange(item.id, e.target.value)}
								className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<p className="text-lg font-bold text-gray-900 whitespace-nowrap">
								${getItemTotal(item).toFixed(2)}
							</p>
						</div>

						{/* Input controls: quantity, price, and buttons */}
						<div className="flex items-end gap-4">
							{/* Quantity input - 1/3 width of price */}
							<div style={{ width: "80px" }}>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Quantity
								</label>
								<input
									type="number"
									min="1"
									step="1"
									value={
										inputValues[item.id]?.quantity ?? getDisplayQuantity(item)
									}
									onChange={(e) => {
										const val = e.target.value;
										// Allow empty intermediate state
										setInputValues((prev) => ({
											...prev,
											[item.id]: {
												...(prev[item.id] || {}),
												quantity: val,
											},
										}));
										// Update the actual value if not empty
										if (val !== "") {
											onQuantityChange(
												item.id,
												Math.max(1, parseInt(val) || 1)
											);
										}
									}}
									onBlur={(e) => {
										// Clear input state on blur and apply default if empty
										setInputValues((prev) => {
											const updated = { ...prev };
											if (updated[item.id]) {
												delete updated[item.id].quantity;
											}
											return updated;
										});
										if (e.target.value === "") {
											onQuantityChange(item.id, 1);
										}
									}}
									className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							{/* Price per Item input - 3x width of quantity */}
							<div style={{ width: "240px" }}>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Price per Item
								</label>
								<input
									type="number"
									min="0"
									step="0.01"
									value={inputValues[item.id]?.price ?? getDisplayPrice(item)}
									onChange={(e) => {
										const val = e.target.value;
										// Allow empty intermediate state
										setInputValues((prev) => ({
											...prev,
											[item.id]: {
												...(prev[item.id] || {}),
												price: val,
											},
										}));
										// Update the actual value if not empty
										if (val !== "") {
											onPriceChange(item.id, Math.max(0, parseFloat(val) || 0));
										}
									}}
									onBlur={(e) => {
										// Clear input state on blur and apply default if empty
										setInputValues((prev) => {
											const updated = { ...prev };
											if (updated[item.id]) {
												delete updated[item.id].price;
											}
											return updated;
										});
										if (e.target.value === "") {
											onPriceChange(item.id, 0);
										}
									}}
									className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							{/* Spacer to push buttons to the right */}
							<div className="flex-1" />

							{/* Split button - fixed width, conditional display */}
							{getDisplayQuantity(item) > 1 && (
								<button
									onClick={() => onSplitItem(item.id)}
									style={{ width: "100px" }}
									className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
								>
									Split
								</button>
							)}

							{/* Delete button - fixed width */}
							<button
								onClick={() => onDeleteItem(item.id)}
								style={{ width: "80px" }}
								className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
							>
								Delete
							</button>
						</div>
					</div>
				))
			)}
			{items.length > 0 && (
				<button
					onClick={onAddItem}
					className="mt-4 w-full px-4 py-2 border-2 border-dashed border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 font-medium"
				>
					+ Add Item
				</button>
			)}
		</div>
	);
};

export default ItemsList;
