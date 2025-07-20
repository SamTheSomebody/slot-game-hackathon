import { PAYLINES } from '$lib/config/paylines';
import type { Payline, MatchResult, SlotSymbol } from '$lib/types/slot';

export function evaluatePaylines(grid: Payline[]): MatchResult[] {
	const results: MatchResult[] = [];

	for (const payline of PAYLINES) {
		const symbols = payline.map((row, col) => grid[row][col]);
		const first = symbols[0];
		let count = 1;

		for (let i = 1; i < symbols.length; i++) {
			if (symbols[i] === first) {
				count++;
			} else {
				break;
			}
		}

		if (count >= 3) {
			results.push({
				payline,
				symbol: first,
				count,
				payout: getPayout(first, count)
			});
		}
	}

	return results;
}

function getPayout(symbol: SlotSymbol, count: number): number {
	const base = 10;
	return base * count;
}
