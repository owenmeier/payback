import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { getMockReceipt, MockReceiptType } from "../services/mockApi";
import { ReceiptItem, Receipt } from "../types";
import { roundToTwo } from "../utils/rounding";
import ItemsList from "../components/editing/ItemsList";
import ChargesSection from "../components/editing/ChargesSection";
import SummaryBox from "../components/editing/SummaryBox";

const ItemEditingPage: React.FC = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { state, dispatch } = useApp();
	const [items, setItems] = useState<ReceiptItem[]>([]);
	const [editedItems, setEditedItems] = useState<{
		[key: string]: { quantity?: number; price?: number; description?: string };
	}>({});
	const [taxEdits, setTaxEdits] = useState<{
		percentage?: number;
		total?: number;
	}>({});
	const [tipEdits, setTipEdits] = useState<{
		percentage?: number;
		total?: number;
	}>({});
	const [feesEdits, setFeesEdits] = useState<{
		percentage?: number;
		total?: number;
	}>({});
	// Track raw input values for all numeric fields to allow intermediate empty states
	const [inputValues, setInputValues] = useState<{
		[key: string]: {
			quantity?: string;
			price?: string;
			percentage?: string;
			total?: string;
		};
	}>({});

	useEffect(() => {
		// Handle mock data (for development)
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
					setItems([...mockReceipt.items]);
				}
			}
		} else if (state.receipt?.items) {
			// Set items from receipt if available and not using mock
			setItems([...state.receipt.items]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	if (!state.receipt) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<p className="text-gray-600 mb-4">No receipt loaded</p>
					<button
						onClick={() => navigate("/")}
						className="px-4 py-2 bg-primary-600 text-white rounded-lg"
					>
						← Back to Upload
					</button>
				</div>
			</div>
		);
	}

	const handleSplitItem = (itemId: string) => {
		// Convert one item with quantity N into N separate items with quantity 1
		const itemIndex = items.findIndex((i) => i.id === itemId);
		if (itemIndex === -1) return;

		const originalItem = items[itemIndex];
		// Use edited quantity if it exists, otherwise use original quantity
		const quantityToSplit =
			editedItems[itemId]?.quantity ?? originalItem.quantity;

		const newItems: ReceiptItem[] = [];

		for (let i = 0; i < quantityToSplit; i++) {
			newItems.push({
				...originalItem,
				id: `${originalItem.id}-split-${i}`,
				quantity: 1,
				assignedTo: [],
			});
		}

		const updatedItems = [
			...items.slice(0, itemIndex),
			...newItems,
			...items.slice(itemIndex + 1),
		];

		setItems(updatedItems);

		// Clear any edits for this item since we've split it
		setEditedItems((prev) => {
			const updated = { ...prev };
			delete updated[itemId];
			return updated;
		});
	};

	// const handleMergeItems = (itemIds: string[]) => {
	// 	// Merge multiple items back into one
	// 	const itemsToMerge = items.filter((i) => itemIds.includes(i.id));
	// 	if (itemsToMerge.length === 0) return;

	// 	const mergedQuantity = itemsToMerge.reduce((sum, i) => sum + i.quantity, 0);
	// 	const baseItem = itemsToMerge[0];

	// 	const filtered = items.filter((i) => !itemIds.includes(i.id));
	// 	const merged: ReceiptItem = {
	// 		id: baseItem.id.split("-split-")[0], // Remove split suffix
	// 		description: baseItem.description,
	// 		price: baseItem.price,
	// 		quantity: mergedQuantity,
	// 		assignedTo: [],
	// 	};

	// 	setItems([...filtered, merged]);
	// };

	const handleQuantityChange = (itemId: string, newQuantity: number) => {
		if (newQuantity < 1) return;
		setEditedItems((prev) => ({
			...prev,
			[itemId]: {
				...(prev[itemId] || {
					price: items.find((i) => i.id === itemId)?.price || 0,
				}),
				quantity: newQuantity,
			},
		}));
	};

	const handlePriceChange = (itemId: string, newPrice: number) => {
		if (newPrice < 0) return;
		setEditedItems((prev) => ({
			...prev,
			[itemId]: {
				...(prev[itemId] || {
					quantity: items.find((i) => i.id === itemId)?.quantity || 1,
				}),
				price: newPrice,
			},
		}));
	};

	const getDisplayQuantity = (item: ReceiptItem): number => {
		return editedItems[item.id]?.quantity ?? item.quantity;
	};

	const getDisplayPrice = (item: ReceiptItem): number => {
		return editedItems[item.id]?.price ?? item.price;
	};

	const getItemTotal = (item: ReceiptItem): number => {
		return roundToTwo(getDisplayQuantity(item) * getDisplayPrice(item));
	};

	const getDisplayDescription = (item: ReceiptItem): string => {
		return editedItems[item.id]?.description ?? item.description;
	};

	const handleDescriptionChange = (itemId: string, newDescription: string) => {
		setEditedItems((prev) => ({
			...prev,
			[itemId]: {
				...(prev[itemId] || {}),
				description: newDescription,
			},
		}));
	};

	const handleDeleteItem = (itemId: string) => {
		setItems((prev) => prev.filter((i) => i.id !== itemId));
		setEditedItems((prev) => {
			const updated = { ...prev };
			delete updated[itemId];
			return updated;
		});
	};

	const handleAddItem = () => {
		const newItem: ReceiptItem = {
			id: `item-${Date.now()}`,
			description: "New Item",
			price: 0,
			quantity: 1,
			assignedTo: [],
		};
		setItems((prev) => [...prev, newItem]);
	};

	// Helper function to calculate subtotal of all items
	const getItemsSubtotal = (): number => {
		const sum = items.reduce(
			(sum, item) => sum + getDisplayQuantity(item) * getDisplayPrice(item),
			0
		);
		return roundToTwo(sum);
	};

	// Helper to calculate total tax amount
	const getTotalTaxAmount = (): number => {
		return Array.isArray(state.receipt?.tax)
			? (state.receipt.tax as { amount: number }[]).reduce(
					(sum, t) => sum + (t.amount || 0),
					0
			  )
			: 0;
	};

	// Helper to calculate total fees amount
	const getTotalFeesAmount = (): number => {
		return Array.isArray(state.receipt?.fees)
			? (state.receipt.fees as { amount: number }[]).reduce(
					(sum, f) => sum + (f.amount || 0),
					0
			  )
			: 0;
	};

	// Tax helpers
	const getTaxPercentage = (): number => {
		if (taxEdits.percentage !== undefined) return taxEdits.percentage;
		const subtotal = getItemsSubtotal();
		if (subtotal === 0) return 0;
		return (getTotalTaxAmount() / subtotal) * 100;
	};

	const getTaxTotal = (): number => {
		if (taxEdits.total !== undefined) return roundToTwo(taxEdits.total);
		return roundToTwo(getTotalTaxAmount());
	};

	const handleTaxPercentageChange = (percentage: number) => {
		const newTotal = roundToTwo((getItemsSubtotal() * percentage) / 100);
		setTaxEdits({ percentage, total: newTotal });
	};

	const handleTaxTotalChange = (total: number) => {
		const roundedTotal = roundToTwo(total);
		const subtotal = getItemsSubtotal();
		const percentage = subtotal > 0 ? (roundedTotal / subtotal) * 100 : 0;
		setTaxEdits({ percentage, total: roundedTotal });
	};

	// Tip helpers
	const getTipPercentage = (): number => {
		if (tipEdits.percentage !== undefined) return tipEdits.percentage;
		const subtotal = getItemsSubtotal();
		if (subtotal === 0) return 0;
		return ((state.receipt?.tip || 0) / subtotal) * 100;
	};

	const getTipTotal = (): number => {
		if (tipEdits.total !== undefined) return roundToTwo(tipEdits.total);
		return roundToTwo(state.receipt?.tip || 0);
	};

	const handleTipPercentageChange = (percentage: number) => {
		const newTotal = roundToTwo((getItemsSubtotal() * percentage) / 100);
		setTipEdits({ percentage, total: newTotal });
	};

	const handleTipTotalChange = (total: number) => {
		const roundedTotal = roundToTwo(total);
		const subtotal = getItemsSubtotal();
		const percentage = subtotal > 0 ? (roundedTotal / subtotal) * 100 : 0;
		setTipEdits({ percentage, total: roundedTotal });
	};

	// Fees helpers
	const getFeesPercentage = (): number => {
		if (feesEdits.percentage !== undefined) return feesEdits.percentage;
		const subtotal = getItemsSubtotal();
		if (subtotal === 0) return 0;
		return (getTotalFeesAmount() / subtotal) * 100;
	};

	const getFeesTotal = (): number => {
		if (feesEdits.total !== undefined) return roundToTwo(feesEdits.total);
		return roundToTwo(getTotalFeesAmount());
	};

	const handleFeesPercentageChange = (percentage: number) => {
		const newTotal = roundToTwo((getItemsSubtotal() * percentage) / 100);
		setFeesEdits({ percentage, total: newTotal });
	};

	const handleFeesTotalChange = (total: number) => {
		const roundedTotal = roundToTwo(total);
		const subtotal = getItemsSubtotal();
		const percentage = subtotal > 0 ? (roundedTotal / subtotal) * 100 : 0;
		setFeesEdits({ percentage, total: roundedTotal });
	};

	const handleContinue = () => {
		// Update items with edited quantities, prices, and descriptions
		const updatedItems = items.map((item) => ({
			...item,
			quantity: getDisplayQuantity(item),
			price: getDisplayPrice(item),
			description: getDisplayDescription(item),
		}));

		// Update receipt with new items, charges, and navigate to splitting
		if (state.receipt) {
			// Build updated tax array
			const updatedTax = state.receipt.tax.map((t) => ({
				...t,
				amount: getTaxTotal(),
			}));

			dispatch({
				type: "SET_RECEIPT",
				payload: {
					...state.receipt,
					items: updatedItems,
					tax: updatedTax,
					tip: getTipTotal(),
					fees: state.receipt.fees.map((f) => ({
						...f,
						amount: getFeesTotal(),
					})),
					total: getItemsSubtotal() + getTaxTotal() + getTipTotal() + getFeesTotal(),
				} as Receipt,
			});
			navigate("/splitting");
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Review & Edit Items
				</h1>
				<p className="text-gray-600 mb-6">
					Split items into individual portions if needed for uneven splits
				</p>

				<div className="bg-white rounded-lg shadow-sm p-6">
					<ItemsList
						items={items}
						editedItems={editedItems}
						inputValues={inputValues}
						onQuantityChange={handleQuantityChange}
						onPriceChange={handlePriceChange}
						onDescriptionChange={handleDescriptionChange}
						onSplitItem={handleSplitItem}
						onDeleteItem={handleDeleteItem}
						onAddItem={handleAddItem}
						setInputValues={setInputValues}
						getDisplayQuantity={getDisplayQuantity}
						getDisplayPrice={getDisplayPrice}
						getDisplayDescription={getDisplayDescription}
						getItemTotal={getItemTotal}
					/>
				</div>

				<ChargesSection
					taxPercentage={getTaxPercentage()}
					taxTotal={getTaxTotal()}
					tipPercentage={getTipPercentage()}
					tipTotal={getTipTotal()}
					feesPercentage={getFeesPercentage()}
					feesTotal={getFeesTotal()}
					inputValues={inputValues}
					onTaxPercentageChange={handleTaxPercentageChange}
					onTaxTotalChange={handleTaxTotalChange}
					onTipPercentageChange={handleTipPercentageChange}
					onTipTotalChange={handleTipTotalChange}
					onFeesPercentageChange={handleFeesPercentageChange}
					onFeesTotalChange={handleFeesTotalChange}
					setInputValues={setInputValues}
				/>

				<SummaryBox
					subtotal={getItemsSubtotal()}
					taxTotal={getTaxTotal()}
					feesTotal={getFeesTotal()}
					tipTotal={getTipTotal()}
				/>

				<div className="mt-6 flex gap-4">
					<button
						onClick={() => navigate("/")}
						className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium"
					>
						← Back
					</button>
					<button
						onClick={handleContinue}
						className="ml-auto px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
					>
						Continue to Assignment →
					</button>
				</div>
			</div>
		</div>
	);
};

export default ItemEditingPage;
