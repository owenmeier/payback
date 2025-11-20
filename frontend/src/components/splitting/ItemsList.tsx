import React from "react";
import { useApp } from "../../contexts/AppContext";
import ItemCard from "./ItemCard";

const ItemsList: React.FC = () => {
	const { state } = useApp();

	if (!state.receipt) {
		return null;
	}

	const unassignedItems = state.receipt.items.filter(
		(item) => item.assignedTo.length === 0
	);
	const assignedItems = state.receipt.items.filter(
		(item) => item.assignedTo.length > 0
	);

	// Calculate total quantities for unassigned and assigned items
	const unassignedQuantity = unassignedItems.reduce(
		(sum, item) => sum + item.quantity,
		0
	);
	const assignedQuantity = assignedItems.reduce(
		(sum, item) => sum + item.quantity,
		0
	);
	const totalQuantity = unassignedQuantity + assignedQuantity;

	const selectedPerson = state.people.find(
		(p) => p.id === state.selectedPersonId
	);

	return (
		<div>
			{/* Selection indicator */}
			{selectedPerson && (
				<div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
					<p className="text-sm font-medium text-blue-900">
						<span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
						Assigning to: <strong>{selectedPerson.name}</strong>
					</p>
					<p className="text-xs text-blue-700 mt-1">
						Click items to assign or unassign
					</p>
				</div>
			)}

			{!selectedPerson && state.people.length > 0 && (
				<div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
					<p className="text-sm font-medium text-yellow-900">
						👈 Select a person from the right to start assigning items
					</p>
				</div>
			)}

			{/* Items list */}
			<div className="space-y-2 max-h-[600px] overflow-y-auto">
				{state.receipt.items.map((item) => (
					<ItemCard key={item.id} item={item} />
				))}
			</div>

			{/* Summary footer */}
			<div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
				<div className="flex justify-between text-sm">
					<span className="text-gray-600">
						Assigned: {assignedQuantity} of {totalQuantity}
					</span>
					{unassignedQuantity > 0 && (
						<span className="text-orange-600 font-medium">
							{unassignedQuantity} unassigned
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default ItemsList;
