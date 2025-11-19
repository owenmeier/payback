import React, { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import { Person, PersonSplit } from "../../types";
import { getInitials, PERSON_COLORS } from "../../utils/colors";

interface PersonCardProps {
	person: Person;
	split?: PersonSplit;
	isSelected: boolean;
	onClick: () => void;
}

const PersonCard: React.FC<PersonCardProps> = ({
	person,
	split,
	isSelected,
	onClick,
}) => {
	const { dispatch } = useApp();
	const [isEditing, setIsEditing] = useState(false);
	const [editName, setEditName] = useState(person.name);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	// Get color based on person's assigned color
	const colorIndex = PERSON_COLORS.findIndex((c) => c.name === person.color);
	const color = colorIndex >= 0 ? PERSON_COLORS[colorIndex] : PERSON_COLORS[0];

	const itemCount = split?.items.length || 0;
	const total = split?.total || 0;

	const handleSaveName = () => {
		const trimmedName = editName.trim();
		if (trimmedName && trimmedName !== person.name) {
			dispatch({
				type: "UPDATE_PERSON",
				payload: {
					personId: person.id,
					updates: { name: trimmedName },
				},
			});
		}
		setIsEditing(false);
		setEditName(person.name);
	};

	const handleDelete = () => {
		dispatch({ type: "REMOVE_PERSON", payload: person.id });
		setShowDeleteConfirm(false);
	};

	return (
		<div
			className={`
        relative p-4 rounded-lg border-2 transition-all cursor-pointer
        ${
					isSelected
						? `border-${color.name}-500 ${color.light} shadow-md`
						: "border-gray-200 hover:border-gray-300 hover:shadow-sm"
				}
      `}
			onClick={onClick}
		>
			{/* Delete Confirmation Overlay */}
			{showDeleteConfirm && (
				<div className="absolute inset-0 bg-white bg-opacity-95 rounded-lg flex flex-col items-center justify-center p-4 z-10">
					<p className="text-sm font-medium text-gray-900 mb-3 text-center">
						Remove {person.name}?
					</p>
					{itemCount > 0 && (
						<p className="text-xs text-gray-600 mb-3 text-center">
							{itemCount} {itemCount === 1 ? "item" : "items"} will be
							unassigned
						</p>
					)}
					<div className="flex gap-2">
						<button
							onClick={(e) => {
								e.stopPropagation();
								handleDelete();
							}}
							className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700"
						>
							Remove
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation();
								setShowDeleteConfirm(false);
							}}
							className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
						>
							Cancel
						</button>
					</div>
				</div>
			)}

			<div className="flex items-center gap-3">
				{/* Avatar */}
				<div
					className={`w-12 h-12 rounded-full ${color.bg} text-white flex items-center justify-center font-bold text-lg flex-shrink-0`}
				>
					{getInitials(person.name)}
				</div>

				{/* Name */}
				<div className="flex-1 min-w-0">
					{isEditing ? (
						<input
							type="text"
							value={editName}
							onChange={(e) => setEditName(e.target.value)}
							onBlur={handleSaveName}
							onKeyDown={(e) => {
								if (e.key === "Enter") handleSaveName();
								if (e.key === "Escape") {
									setIsEditing(false);
									setEditName(person.name);
								}
								e.stopPropagation();
							}}
							onClick={(e) => e.stopPropagation()}
							autoFocus
							className="w-full px-2 py-1 text-sm font-medium border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
						/>
					) : (
						<h3 className="font-semibold text-gray-900 truncate">
							{person.name}
						</h3>
					)}

					<div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
						<span>
							{itemCount} {itemCount === 1 ? "item" : "items"}
						</span>
						<span className="font-medium text-gray-900">
							${total.toFixed(2)}
						</span>
					</div>
				</div>

				{/* Actions */}
				<div className="flex gap-1">
					<button
						onClick={(e) => {
							e.stopPropagation();
							setIsEditing(true);
						}}
						className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
						title="Edit name"
					>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							/>
						</svg>
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							setShowDeleteConfirm(true);
						}}
						className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
						title="Remove person"
					>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
					</button>
				</div>
			</div>

			{/* Selected Indicator */}
			{isSelected && (
				<div className="absolute top-2 right-2">
					<div
						className={`w-3 h-3 rounded-full ${color.bg} animate-pulse`}
					></div>
				</div>
			)}
		</div>
	);
};

export default PersonCard;
