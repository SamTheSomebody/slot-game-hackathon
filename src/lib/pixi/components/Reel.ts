import { Color, Container, FillGradient, Graphics, Text, Ticker } from 'pixi.js';
import { Slot } from './Slot';
import {
	SLOT_SIZE,
	SLOT_BUFFER,
	SLOT_SPIN_TIME,
	SHOWN_SLOTS,
	SLOT_SPIN_MULTIPLIER
} from '$lib/config/slot';
import { easeOutBack } from '$lib/utility/ease';
import { lerp } from '$lib/utility/lerp';
import { DEBUG_MODE } from '$lib/config/debug';
import { DEBUG_TEXT_STYLE } from '../debug/text';
import type { SymbolSpriteSheets } from './SymbolSpriteSheets';
import { reelPositions, reelsSpinning } from '$lib/stores/gameState';

const STEP_HEIGHT = SLOT_SIZE + SLOT_BUFFER;

export class Reel {
	container: Container;
	slots: Slot[] = [];
	index: number = 0;
	private reelIndex: number = 0;
	private slotIDs: number[] = [];
	private ticker?: Ticker;
	private elapsed = 0;
	private text: Text | undefined;

	constructor(slotIDs: number[], reelIndex: number) {
		this.container = new Container();
		this.container.y = -STEP_HEIGHT;
		const colorEnds = new Color([0, 0, 0, 0]);
		const gradient = new FillGradient({
			type: 'linear',
			start: { x: 0, y: 0 },
			end: { x: 1, y: 0 },
			colorStops: [
				{ offset: 0, color: colorEnds },
				{ offset: 0.3, color: new Color([0, 0, 0, 0.3]) },
				{ offset: 0.7, color: new Color([0, 0, 0, 0.3]) },
				{ offset: 1, color: colorEnds }
			]
		});
		const background = new Graphics().rect(0, 0, SLOT_SIZE + 10, STEP_HEIGHT * 5).fill(gradient);
		this.container.addChild(background);
		this.slotIDs = slotIDs;
		this.reelIndex = reelIndex;
		this.debugText();
	}

	async load(slotIDs: number[], sheets: SymbolSpriteSheets) {
		this.slots = [];
		for (let i = 0; i < SHOWN_SLOTS; i++) {
			const slot = new Slot(i, sheets);
			const spriteID = slotIDs[i % slotIDs.length];
			await slot.updateID(spriteID);
			this.slots.push(slot);
			slot.container.y = i * STEP_HEIGHT;
			this.container.addChild(slot.container);
		}
	}

	spin() {
		reelsSpinning.update((amount) => amount + 1);
		this.elapsed = 0;
		const rand = 1; //Math.round(10 + Math.random() * 5 * this.reelIndex);
		const start = this.index;
		const end = this.index - rand;
		const target = end % this.slotIDs.length;
		const time = this.reelIndex * SLOT_SPIN_MULTIPLIER + SLOT_SPIN_TIME;
		let last = start;

		//We know what the position will be when we start
		//Pass it early to avoid race-conditions / allow for skipping animations
		reelPositions.update((positions) => {
			const updated = [...positions];
			updated[this.reelIndex] = target;
			console.log(`Reel ${this.reelIndex} will land on ${target}`);
			return updated;
		});

		this.ticker = new Ticker();
		this.ticker.add((ticker: Ticker) => {
			this.elapsed += ticker.deltaTime;
			const t = this.elapsed / time;
			const eased = easeOutBack(t);
			let current = lerp(start, end, eased);
			if (this.elapsed >= time) {
				current = end;
				this.ticker?.stop();
				this.ticker?.destroy();
				reelsSpinning.update((amount) => amount - 1);
			}
			//We still run this on the finished iteration
			this.updateSlotPositions(current % this.slotIDs.length);
			while (last - 0.9 > current) {
				last--;
				this.updateIndex();
			}
		});
		this.ticker.start();
	}

	animateSymbol(visualIndex: number) {
		this.slots[visualIndex].animate();
	}

	private updateSlotPositions(currentDistance: number) {
		const height = 4 * STEP_HEIGHT;
		for (let i = 0; i < SHOWN_SLOTS; i++) {
			const slot = this.slots[i];
			if (!slot || !slot.container) {
				console.warn(`Slot ${i} or its container is null`, slot);
				continue;
			}
			const offset = i * STEP_HEIGHT;
			const pos = offset + currentDistance * STEP_HEIGHT;
			slot.container.y = pos % height;
		}
	}

	private updateIndex() {
		this.index += this.slotIDs.length - 1;
		this.index %= this.slotIDs.length;
		let topSlot = this.slots[0];
		for (let i = 1; i < this.slots.length; i++) {
			if (this.slots[i].container.y > topSlot.container.y) {
				topSlot = this.slots[i];
			}
		}
		const nextSymbolIndex = (this.index + SHOWN_SLOTS) % this.slotIDs.length;
		topSlot.updateID(this.slotIDs[nextSymbolIndex]);
		this.debugText();
	}

	private debugText() {
		console.log('Drawing debug text');
		if (DEBUG_MODE) {
			if (!this.text) {
				this.text = new Text({
					text: ((this.index + 1) % this.slotIDs.length).toString(),
					style: DEBUG_TEXT_STYLE,
					y: 300
				});
				this.container.addChild(this.text);
			} else {
				this.text.text = ((this.index + 1) % this.slotIDs.length).toString();
			}
		}
	}
}
