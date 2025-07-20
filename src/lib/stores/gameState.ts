import { writable } from 'svelte/store';

export const spinRequested = writable(false);
export const spinCompleted = writable(false);
