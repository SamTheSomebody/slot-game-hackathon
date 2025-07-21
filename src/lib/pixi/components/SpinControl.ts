import { REELS } from '$lib/config/reels';
import { evaluatePaylines } from '$lib/logic/paylineEvaluator';
import { balanceState, betState } from '$lib/stores/betState';
import {
	reelPositions,
	reelsSpinning,
	spinCompleted,
	spinInitiated,
	spinRequested
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
		console.log(`There are ${reelsSpinning} reels spinning.`);
		if (reelsSpinning <= 0) {
			console.log(`Reels finished spinning.`);
			spinCompleted.set(true);
			spinInitiated.set(false);
			this.canSpin = true;
		}

		evaluatePaylines(this.reelPositions, REELS);
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
