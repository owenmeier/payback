/**
 * Rounding utility functions for internal calculations
 * Display layer shows 3 decimals but backend maintains full precision
 */

/**
 * Round a single number to 2 decimals for internal calculations
 * (Display layer shows 3 decimals for user)
 */
export const roundToTwo = (num: number): number => {
	return Math.round(num * 100) / 100;
};

/**
 * Distribute a total amount across multiple recipients, ensuring:
 * - Each amount is rounded to 2 decimals
 * - The sum of all amounts equals the total
 * Strategy: Round down all but the last, then adjust the last to compensate
 * @param total The total amount to distribute
 * @param count Number of recipients
 * @returns Array of amounts that sum to total
 * Used in: SplittingPage for dividing items among people
 */
export const distributeWithRounding = (
	total: number,
	count: number
): number[] => {
	if (count <= 0) return [];
	if (count === 1) return [roundToTwo(total)];

	const baseAmount = total / count;
	const amounts = Array(count).fill(baseAmount).map(roundToTwo);

	// Calculate the difference due to rounding
	const sum = amounts.reduce((acc, val) => acc + val, 0);
	const difference = roundToTwo(total - sum);

	// Add the difference to the last amount
	amounts[amounts.length - 1] = roundToTwo(
		amounts[amounts.length - 1] + difference
	);

	return amounts;
};

/**
 * Round an array of amounts such that their sum equals the target total
 * All amounts are capped at 2 decimals
 * @param amounts Array of amounts to round
 * @param targetTotal The total that amounts should sum to
 * @returns Array of rounded amounts
 */
export const roundAmountsToTotal = (
	amounts: number[],
	targetTotal: number
): number[] => {
	if (amounts.length === 0) return [];
	if (amounts.length === 1) return [roundToTwo(targetTotal)];

	// Round all amounts down first
	const rounded = amounts.map(roundToTwo);
	const currentSum = rounded.reduce((acc, val) => acc + val, 0);
	const difference = roundToTwo(targetTotal - currentSum);

	// Distribute the difference (usually just a few cents) to the last amount
	rounded[rounded.length - 1] = roundToTwo(
		rounded[rounded.length - 1] + difference
	);

	return rounded;
};
