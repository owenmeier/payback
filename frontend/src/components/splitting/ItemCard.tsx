import React from "react";
import { useApp } from "../../contexts/AppContext";
import { ReceiptItem } from "../../types";
import { PERSON_COLORS, getInitials } from "../../utils/colors";

interface ItemCardProps {
	item: ReceiptItem;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
	const { state, dispatch } = useApp();

	const handleItemClick = (e: React.MouseEvent) => {
		e.stopPropagation();

		if (!state.selectedPersonId) {
			return;
		}

		const isAssigned = item.assignedTo.includes(state.selectedPersonId);

		if (isAssigned) {
			dispatch({
				type: "UNASSIGN_ITEM",
				payload: {
					itemId: item.id,
					personId: state.selectedPersonId,
				},
			});
		} else {
			dispatch({
				type: "ASSIGN_ITEM",
				payload: {
					itemId: item.id,
					personId: state.selectedPersonId,
				},
			});
		}
	};

	// Get assigned people details for display
	const assignedPeople = state.people.filter((person) =>
		item.assignedTo.includes(person.id)
	);

	// Determine border color based on selected person
	let borderColor = "border-gray-200 hover:border-gray-300";
	let bgColor = "bg-white";

	if (state.selectedPersonId) {
		const isAssignedToSelected = item.assignedTo.includes(
			state.selectedPersonId
		);
		if (isAssignedToSelected) {
			// Item is assigned to selected person
			const selectedPerson = state.people.find(
				(p) => p.id === state.selectedPersonId
			);
			if (selectedPerson) {
				const colorIndex = PERSON_COLORS.findIndex(
					(c) => c.name === selectedPerson.color
				);
				const color =
					colorIndex >= 0 ? PERSON_COLORS[colorIndex] : PERSON_COLORS[0];
				borderColor = `border-${selectedPerson.color}-500`;
				bgColor = color.light;
			}
		} else {
			// Item not assigned to selected person - show it's clickable
			borderColor = "border-gray-300 hover:border-primary-400";
		}
	}

	const isShared = assignedPeople.length > 1;

	return (
		<div
			onClick={handleItemClick}
			className={`
        p-4 border-2 rounded-lg transition-all cursor-pointer
        ${borderColor} ${bgColor}
        ${
					!state.selectedPersonId
						? "opacity-75 cursor-not-allowed"
						: "hover:shadow-md"
				}
      `}
			title={
				!state.selectedPersonId
					? "Select a person first"
					: "Click to assign/unassign"
			}
		>
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<div className="flex items-start gap-2">
						<h3 className="font-medium text-gray-800 flex-1">
							{item.description}
						</h3>
						{isShared && (
							<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
								Shared
							</span>
						)}
					</div>
					{item.quantity > 1 && (
						<p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
					)}
				</div>

				<div className="text-right ml-4">
					<p className="font-semibold text-gray-900">
						${(item.price * item.quantity).toFixed(2)}
					</p>

					{/* Show assigned people */}
					{assignedPeople.length > 0 && (
						<div className="mt-2 flex gap-1 justify-end flex-wrap">
							{assignedPeople.map((person) => {
								const colorIndex = PERSON_COLORS.findIndex(
									(c) => c.name === person.color
								);
								const color =
									colorIndex >= 0
										? PERSON_COLORS[colorIndex]
										: PERSON_COLORS[0];

								return (
									<div
										key={person.id}
										className={`w-8 h-8 rounded-full ${color.bg} text-white text-xs flex items-center justify-center font-semibold shadow-sm`}
										title={person.name}
									>
										{getInitials(person.name)}
									</div>
								);
							})}
						</div>
					)}

					{/* If shared, show split amount */}
					{isShared && (
						<p className="text-xs text-gray-500 mt-1">
							$
							{((item.price * item.quantity) / assignedPeople.length).toFixed(
								2
							)}{" "}
							each
						</p>
					)}
				</div>
			</div>

			{/* Visual hint when no person selected */}
			{!state.selectedPersonId && assignedPeople.length === 0 && (
				<div className="mt-2 text-xs text-gray-400 text-center">
					Select a person to assign items
				</div>
			)}
		</div>
	);
};

export default ItemCard;
