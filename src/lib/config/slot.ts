import { Color, FillGradient } from 'pixi.js';

export const SLOT_SIZE = 150;
export const SLOT_BUFFER = 20;
export const SLOT_SPIN_TIME = 100;
export const SLOT_SPIN_FAST_TIME = 10;
export const SLOT_SPIN_MULTIPLIER = 20;
export const SHOWN_SLOTS = 4;

const colorEnd = new Color([0, 0, 0, 0]);
const colorMid = new Color([0, 0, 0, 0.4]);
export const GRADIENT = new FillGradient({
	type: 'linear',
	start: { x: 0, y: 0 },
	end: { x: 1, y: 0 },
	colorStops: [
		{ offset: 0, color: colorEnd },
		{ offset: 0.35, color: colorMid },
		{ offset: 0.65, color: colorMid },
		{ offset: 1, color: colorEnd }
	]
});
