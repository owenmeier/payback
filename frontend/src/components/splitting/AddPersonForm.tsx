import React, { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import { Person } from "../../types";
import { generateId } from "../../utils/idGenerator";
import { getPersonColor } from "../../utils/colors";

const AddPersonForm: React.FC = () => {
	const { state, dispatch } = useApp();
	const [name, setName] = useState("");
	const [isAdding, setIsAdding] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const trimmedName = name.trim();
		if (!trimmedName) {
			return;
		}

		// Check for duplicate names
		const isDuplicate = state.people.some(
			(p) => p.name.toLowerCase() === trimmedName.toLowerCase()
		);

		if (isDuplicate) {
			alert("Someone with this name already exists!");
			return;
		}

		// Create new person with auto-assigned color
		const colorIndex = state.people.length;
		const color = getPersonColor(colorIndex);

		const newPerson: Person = {
			id: generateId("person"),
			name: trimmedName,
			color: color.name,
		};

		dispatch({ type: "ADD_PERSON", payload: newPerson });
		setName("");
		setIsAdding(false);
	};

	if (!isAdding) {
		return (
			<button
				onClick={() => setIsAdding(true)}
				className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-2 font-medium"
			>
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
						d="M12 4v16m8-8H4"
					/>
				</svg>
				Add Person
			</button>
		);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-gray-50 p-4 rounded-lg border border-gray-200"
		>
			<label
				htmlFor="person-name"
				className="block text-sm font-medium text-gray-700 mb-2"
			>
				Person's Name
			</label>
			<div className="flex gap-2">
				<input
					id="person-name"
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Enter name..."
					autoFocus
					className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
				/>
				<button
					type="submit"
					disabled={!name.trim()}
					className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
				>
					Add
				</button>
				<button
					type="button"
					onClick={() => {
						setIsAdding(false);
						setName("");
					}}
					className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
				>
					Cancel
				</button>
			</div>
		</form>
	);
};

export default AddPersonForm;
