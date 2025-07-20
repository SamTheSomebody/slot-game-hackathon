import type { Payline } from '$lib/types/slot';

export const PAYLINES: Payline[] = [
	// Horizontal lines
	[0, 0, 0],
	[1, 1, 1],
	[2, 2, 2],

	// V shapes
	[0, 1, 0],
	[2, 1, 2],

	// Zigzags
	[0, 1, 2],
	[2, 1, 0]
];
