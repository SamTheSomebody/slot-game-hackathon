import { SHOWN_SLOTS } from '$lib/config/slot';
import { SYMBOLS } from '$lib/config/symbols';

export function generateRandomReels(count = 5): number[][] {
	return Array.from({ length: count }, () => generateRandomSlots());
}

function generateRandomSlots(count = 32): number[] {
	if (count % SHOWN_SLOTS != 0) {
		throw Error(`${count} needs to be divisible by ${SHOWN_SLOTS}`);
	}
	return Array.from({ length: count }, () =>
		Math.floor(Math.random() * Object.keys(SYMBOLS).length)
	);
}
