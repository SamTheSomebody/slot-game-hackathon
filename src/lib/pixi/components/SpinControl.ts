import { PAYLINES } from '$lib/config/paylines';
import { REELS } from '$lib/config/reels';
import { evaluatePaylines, type CompletedMatch } from '$lib/logic/paylineEvaluator';
import { balanceState, betState } from '$lib/stores/betState';
import {
	reelPositions,
	reelsSpinning,
	spinCompleted,
	spinInitiated,
	spinRequested,
	updatePayout,
	type Payout
} from '$lib/stores/gameState';

export class SpinControl {
	private canSpin = true;
	private currentBet = 1.25;
	private currentBalance = 100;
	private reelPositions: number[] = [];

	constructor() {
		reelsSpinning.subscribe((reelsSpinning) => this.completeSpin(reelsSpinning));
		spinRequested.subscribe((isRequested) => this.startSpin(isRequested));
		betState.subscribe(({ currentBet }) => {
			this.currentBet = currentBet;
		});
		balanceState.subscribe(({ currentBalance }) => {
			this.currentBalance = currentBalance;
		});
		reelPositions.subscribe((positions) => (this.reelPositions = positions));
	}
	async load() {}

	private completeSpin(reelsSpinning: number) {
		if (reelsSpinning > 0) {
			return;
		}
		spinCompleted.set(true);
		spinInitiated.set(false);
		this.canSpin = true;
		if (this.reelPositions.length > 4) {
			const betPerPayline = this.currentBet / PAYLINES.length;
			const matches: CompletedMatch[] = evaluatePaylines(this.reelPositions, REELS);
			for (const match of matches) {
				for (let i = 0; i < match.payline.length; i++) {
					const payout: Payout = {
						reelIndex: match.startIndex + i,
						slotIndex: match.payline[i],
						rarity: match.rarity
					};
					updatePayout.set(payout);
					this.currentBalance += match.payout * betPerPayline;
				}
			}
			balanceState.set({ currentBalance: this.currentBalance });
		}
	}

	private startSpin(isRequested: boolean) {
		spinRequested.set(false);
		if (!isRequested || !this.canSpin) {
			return;
		}
		if (this.currentBet > this.currentBalance) {
			//TODO not enough balance error
			return;
		}
		spinInitiated.set(true);
		spinCompleted.set(false);
		this.canSpin = false;
		balanceState.update((state) => ({
			...state,
			currentBalance: state.currentBalance - this.currentBet
		}));
	}
}
