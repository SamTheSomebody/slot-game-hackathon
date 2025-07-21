import { writable } from 'svelte/store';

export const spinRequested = writable(false);
export const spinInitiated = writable(false);
export const reelsSpinning = writable(0);
export const spinCompleted = writable(true);
export const menuRequested = writable(false);
export const reelPositions = writable<number[]>([]);
