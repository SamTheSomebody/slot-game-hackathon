import { PAYLINES } from '$lib/config/paylines';
import { SHOWN_SLOTS } from '$lib/config/slot';
import { reelPositions } from '$lib/stores/gameState';
import type { Payline, MatchResult, SlotSymbol } from '$lib/types/slot';

export function evaluatePaylines(reelPositions: number[], reels: number[][]): MatchResult[] {
	const results: MatchResult[] = [];
	return results;

	for (const payline of PAYLINES) {
		const symbols = payline.map((row, col) => reels[row][col]);
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

function getActiveReelSymbols(reelPosition: number, reel: number[]): number[] {
	const ids = [];
	//The first slot is the hidden one
	for (let i = 1; i < SHOWN_SLOTS; i++) {
		const index = (reelPosition + i) % reel.length;
		const id = reel[index];
		ids.push(id);
	}
	return ids;
}
