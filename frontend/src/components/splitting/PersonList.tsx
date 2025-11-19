import React from "react";
import { useApp } from "../../contexts/AppContext";
import { PersonSplit } from "../../types";
import PersonCard from "./PersonCard";
import AddPersonForm from "./AddPersonForm";

interface PersonListProps {
	splits: PersonSplit[];
}

const PersonList: React.FC<PersonListProps> = ({ splits }) => {
	const { state, dispatch } = useApp();

	const handlePersonClick = (personId: string) => {
		// Toggle selection
		if (state.selectedPersonId === personId) {
			dispatch({ type: "SELECT_PERSON", payload: null });
		} else {
			dispatch({ type: "SELECT_PERSON", payload: personId });
		}
	};

	// Create a map of person splits for easy lookup
	const splitMap = new Map(splits.map((split) => [split.personId, split]));

	return (
		<div className="space-y-4">
			<AddPersonForm />

			{state.people.length === 0 ? (
				<div className="text-center py-12">
					<div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
						<svg
							className="w-8 h-8 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
							/>
						</svg>
					</div>
					<p className="text-gray-600 font-medium">No people added yet</p>
					<p className="text-sm text-gray-500 mt-1">
						Add people to start splitting the bill
					</p>
				</div>
			) : (
				<div className="space-y-3">
					{state.people.map((person) => (
						<PersonCard
							key={person.id}
							person={person}
							split={splitMap.get(person.id)}
							isSelected={state.selectedPersonId === person.id}
							onClick={() => handlePersonClick(person.id)}
						/>
					))}
				</div>
			)}

			{/* Instructions */}
			{state.people.length > 0 && (
				<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
					<h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
								clipRule="evenodd"
							/>
						</svg>
						How to assign items
					</h3>
					<ol className="space-y-1 text-sm text-blue-800">
						<li>1. Click on a person to select them</li>
						<li>2. Click on items from the receipt to assign</li>
						<li>3. Click the same item again to unassign</li>
						<li>4. Assign items to multiple people to split them</li>
					</ol>
				</div>
			)}
		</div>
	);
};

export default PersonList;
