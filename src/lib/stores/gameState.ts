import type { SymbolRarity } from '$lib/config/symbols';
import { writable } from 'svelte/store';

export type Payout = { reelIndex: number; slotIndex: number; rarity: SymbolRarity };

export const spinRequested = writable(false);
export const spinInitiated = writable(false);
export const reelsSpinning = writable(0);
export const spinCompleted = writable(true);
export const menuRequested = writable(false);
export const reelPositions = writable<number[]>([]);
export const updatePayout = writable<Payout>();
export const setFastMode = writable(false);
export const setNoSpinDelay = writable(false);
