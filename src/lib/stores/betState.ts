import { writable } from 'svelte/store';

const MIN_BET = 1;
const MAX_BET = 10;
const BET_INCREMENT = 0.25;

export const betState = writable({
	currentBet: 1.25
});

export function IncreaseBet() {
	betState.update((state) => ({
		...state,
		currentBet: Math.min((state.currentBet += BET_INCREMENT), MAX_BET)
	}));
}

export function DecreaseBet() {
	betState.update((state) => ({
		...state,
		currentBet: Math.max((state.currentBet -= BET_INCREMENT), MIN_BET)
	}));
}
