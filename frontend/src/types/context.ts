import { Receipt, Person, PersonSplit, ReceiptItem } from "./index";

export interface AppState {
	sessionId: string | null;
	receipt: Receipt | null;
	people: Person[];
	splits: PersonSplit[];
	isLoading: boolean;
	error: string | null;
	selectedPersonId: string | null;
}

export type AppAction =
	| { type: "SET_SESSION_ID"; payload: string }
	| { type: "SET_RECEIPT"; payload: Receipt }
	| {
			type: "UPDATE_RECEIPT_ITEM";
			payload: { itemId: string; updates: Partial<ReceiptItem> };
	  }
	| { type: "ADD_RECEIPT_ITEM"; payload: ReceiptItem }
	| { type: "REMOVE_RECEIPT_ITEM"; payload: string }
	| { type: "ADD_PERSON"; payload: Person }
	| { type: "REMOVE_PERSON"; payload: string }
	| {
			type: "UPDATE_PERSON";
			payload: { personId: string; updates: Partial<Person> };
	  }
	| { type: "ASSIGN_ITEM"; payload: { itemId: string; personId: string } }
	| { type: "UNASSIGN_ITEM"; payload: { itemId: string; personId: string } }
	| { type: "SET_SPLITS"; payload: PersonSplit[] }
	| { type: "SET_LOADING"; payload: boolean }
	| { type: "SET_ERROR"; payload: string | null }
	| { type: "SELECT_PERSON"; payload: string | null }
	| { type: "RESET_STATE" };
