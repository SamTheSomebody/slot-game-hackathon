import { PAYLINES } from '$lib/config/paylines';
import { PAYTABLE } from '$lib/config/paytable';
import { SHOWN_SLOTS } from '$lib/config/slot';
import { SYMBOLS, type SymbolRarity } from '$lib/config/symbols';

type Match = { symbolID: number; paylineID: number; startIndex: number };
export type CompletedMatch = Match & { payline: number[]; payout: number; rarity: SymbolRarity };

export function evaluatePaylines(reelPositions: number[], reels: number[][]): CompletedMatch[] {
	const activeSymbols = getActiveReelSymbols(reelPositions, reels);

	const ROWS: number = activeSymbols[0].length;
	const REELS: number = activeSymbols.length;

	let activeMatches: Match[] = [];
	const completedMatches: Record<number, CompletedMatch> = {};

	for (let x = 0; x < REELS; x++) {
		const newMatches: Match[] = [];
		if (x < 3) {
			for (let y = 0; y < ROWS; y++) {
				for (let i = 0; i < PAYLINES.length; i++) {
					const line: number[] = PAYLINES[i];
					if (line[x] == y) {
						const newMatch: Match = { symbolID: activeSymbols[x][y], paylineID: i, startIndex: x };
						newMatches.push(newMatch);
					}
				}
			}
		}

		console.log(`Found ${newMatches.length} new matches in iteration ${x}`);

		const matchesToRemove: number[] = [];
		for (let i = 0; i < activeMatches.length; i++) {
			const match: Match = activeMatches[i];
			const line: number[] = PAYLINES[match.paylineID];
			const y: number = line[x];
			if (activeSymbols[x][y] !== match.symbolID) {
				setMatchCompleted(x, match, completedMatches);
				matchesToRemove.push(i);
			}
		}

		console.log(`Found ${matchesToRemove.length} matches to remove in iteration ${x}`);

		matchesToRemove.reverse();
		for (const index of matchesToRemove) {
			activeMatches.splice(index, 1);
		}

		activeMatches = [...activeMatches, ...newMatches];
		console.log(`Current have ${activeMatches.length} active matches in iteration ${x}`);
	}

	for (const match of activeMatches) {
		setMatchCompleted(REELS, match, completedMatches);
	}

	console.log(`Found ${Object.keys(completedMatches).length} match(es)!`);
	for (const match of Object.values(completedMatches)) {
		console.log(match);
	}
	return Object.values(completedMatches);
}

function setMatchCompleted(
	x: number,
	match: Match,
	completedMatches: Record<number, CompletedMatch>
): void {
	const len: number = x - match.startIndex;
	if (len < 3) {
		return;
	}
	const rarity: SymbolRarity = SYMBOLS[match.symbolID].rarity;
	const payout: number = PAYTABLE[rarity].payouts[len];
	const payline: number[] = PAYLINES[match.paylineID].slice(match.startIndex, match.startIndex + len);
	const completedMatch: CompletedMatch = { ...match, payline: payline, payout, rarity };
	if (match.symbolID in completedMatches && completedMatches[match.symbolID].payout > payout) {
		return;
	}
	completedMatches[match.symbolID] = completedMatch;
}

function getActiveReelSymbols(reelPositions: number[], reels: number[][]): number[][] {
	const activeSymbols: number[][] = [];
	for (let i = 0; i < reels.length; i++) {
		const ids: number[] = [];
		//Last slot is hidden
		for (let j = 0; j < SHOWN_SLOTS - 1; j++) {
			const index: number = (reelPositions[i] - j - 2 + reels[i].length) % reels[i].length;
			const id: number = reels[i][index];
			ids.push(id);
		}
		activeSymbols.push(ids);
	}
	return activeSymbols;
}
