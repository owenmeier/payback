import React, { createContext, useContext, useReducer, ReactNode } from "react";
import type { AppState, AppAction } from "../types/context";
// import type { Receipt, Person, PersonSplit, ReceiptItem } from "../types";

const initialState: AppState = {
	sessionId: null,
	receipt: null,
	people: [],
	splits: [],
	isLoading: false,
	error: null,
	selectedPersonId: null,
};

const AppContext = createContext<
	| {
			state: AppState;
			dispatch: React.Dispatch<AppAction>;
	  }
	| undefined
>(undefined);

const appReducer = (state: AppState, action: AppAction): AppState => {
	switch (action.type) {
		case "SET_SESSION_ID":
			return { ...state, sessionId: action.payload };

		case "SET_RECEIPT":
			return { ...state, receipt: action.payload };

		case "UPDATE_RECEIPT_ITEM":
			if (!state.receipt) return state;
			return {
				...state,
				receipt: {
					...state.receipt,
					items: state.receipt.items.map((item) =>
						item.id === action.payload.itemId
							? { ...item, ...action.payload.updates }
							: item
					),
				},
			};

		case "ADD_RECEIPT_ITEM":
			if (!state.receipt) return state;
			return {
				...state,
				receipt: {
					...state.receipt,
					items: [...state.receipt.items, action.payload],
				},
			};

		case "REMOVE_RECEIPT_ITEM":
			if (!state.receipt) return state;
			return {
				...state,
				receipt: {
					...state.receipt,
					items: state.receipt.items.filter(
						(item) => item.id !== action.payload
					),
				},
			};

		case "ADD_PERSON":
			return {
				...state,
				people: [...state.people, action.payload],
			};

		case "REMOVE_PERSON":
			return {
				...state,
				people: state.people.filter((p) => p.id !== action.payload),
				selectedPersonId:
					state.selectedPersonId === action.payload
						? null
						: state.selectedPersonId,
			};

		case "UPDATE_PERSON":
			return {
				...state,
				people: state.people.map((p) =>
					p.id === action.payload.personId
						? { ...p, ...action.payload.updates }
						: p
				),
			};

		case "ASSIGN_ITEM": {
			if (!state.receipt) return state;

			const newState = {
				...state,
				receipt: {
					...state.receipt,
					items: state.receipt.items.map((item) => {
						if (item.id !== action.payload.itemId) return item;

						if (item.assignedTo.includes(action.payload.personId)) {
							return item;
						}

						return {
							...item,
							assignedTo: [...item.assignedTo, action.payload.personId],
						};
					}),
				},
			};
			return newState;
		}

		case "UNASSIGN_ITEM": {
			console.log("🔴 UNASSIGN_ITEM called:", action.payload);
			if (!state.receipt) return state;
			const unassignedState = {
				...state,
				receipt: {
					...state.receipt,
					items: state.receipt.items.map((item) =>
						item.id === action.payload.itemId
							? {
									...item,
									assignedTo: item.assignedTo.filter(
										(id) => id !== action.payload.personId
									),
							  }
							: item
					),
				},
			};
			console.log(
				"🔴 After UNASSIGN_ITEM:",
				unassignedState.receipt?.items.find(
					(i) => i.id === action.payload.itemId
				)?.assignedTo
			);
			return unassignedState;
		}

		case "SET_SPLITS":
			return { ...state, splits: action.payload };

		case "SET_LOADING":
			return { ...state, isLoading: action.payload };

		case "SET_ERROR":
			return { ...state, error: action.payload };

		case "SELECT_PERSON":
			return { ...state, selectedPersonId: action.payload };

		case "RESET_STATE":
			return initialState;

		default:
			return state;
	}
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [state, dispatch] = useReducer(appReducer, initialState);

	return (
		<AppContext.Provider value={{ state, dispatch }}>
			{children}
		</AppContext.Provider>
	);
};

export const useApp = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useApp must be used within AppProvider");
	}
	return context;
};
