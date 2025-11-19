import { useMemo } from "react";
import { Receipt, Person, PersonSplit, AssignedItem } from "../types";

export const useCalculateSplits = (
	receipt: Receipt | null,
	people: Person[]
): PersonSplit[] => {
	return useMemo(() => {
		if (!receipt || people.length === 0) {
			return [];
		}

		// Initialize splits for each person
		const splits: { [personId: string]: PersonSplit } = {};
		people.forEach((person) => {
			splits[person.id] = {
				personId: person.id,
				personName: person.name,
				items: [],
				subtotal: 0,
				taxAmount: 0,
				tipAmount: 0,
				feeAmount: 0,
				total: 0,
			};
		});

		// Calculate subtotals per person based on assigned items
		receipt.items.forEach((item) => {
			if (item.assignedTo.length === 0) {
				return; // Skip unassigned items
			}

			// Calculate total price for this item (price * quantity)
			const totalItemPrice = item.price * item.quantity;
			const splitPrice = totalItemPrice / item.assignedTo.length;

			item.assignedTo.forEach((personId) => {
				if (splits[personId]) {
					const assignedItem: AssignedItem = {
						itemId: item.id,
						description: item.description,
						fullPrice: totalItemPrice,
						splitAmount: splitPrice,
						sharedWith: item.assignedTo.filter((id) => id !== personId),
					};

					splits[personId].items.push(assignedItem);
					splits[personId].subtotal += splitPrice;
				}
			});
		});

		// Calculate tax, tip, and fees as percentages of the original subtotal
		const totalTax = receipt.tax.reduce((sum, tax) => sum + tax.amount, 0);
		const totalFees = receipt.fees.reduce((sum, fee) => sum + fee.amount, 0);

		// Calculate percentages based on receipt subtotal
		const taxPercentage =
			receipt.subtotal > 0 ? totalTax / receipt.subtotal : 0;
		const tipPercentage =
			receipt.subtotal > 0 ? receipt.tip / receipt.subtotal : 0;
		const feePercentage =
			receipt.subtotal > 0 ? totalFees / receipt.subtotal : 0;

		Object.keys(splits).forEach((personId) => {
			const split = splits[personId];

			if (split.subtotal > 0) {
				// Apply percentages to each person's subtotal
				split.taxAmount = split.subtotal * taxPercentage;

				// Distribute tip
				split.tipAmount = split.subtotal * tipPercentage;

				// Distribute fees
				split.feeAmount = split.subtotal * feePercentage;

				// Calculate total
				split.total =
					split.subtotal + split.taxAmount + split.tipAmount + split.feeAmount;
			}
		});

		return Object.values(splits);
	}, [receipt, people]);
};
