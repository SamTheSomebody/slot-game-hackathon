import { Color, Container, FillGradient, Graphics, Text, Ticker } from 'pixi.js';
import { Slot } from './Slot';
import { SLOT_SIZE, SLOT_BUFFER, SLOT_SPIN_TIME } from '$lib/config/slot';
import { DebugContainer } from '../debug/container';
import { easeInOutBack, easeInOutQuad, easeOutBack } from '$lib/utility/ease';
import { lerp } from '$lib/utility/lerp';
import { DEBUG_MODE } from '$lib/config/debug';
import { DEBUG_TEXT_STYLE } from '../debug/text';

const SHOWN_SLOTS = 4;
const STEP_HEIGHT = SLOT_SIZE + SLOT_BUFFER;

export class Reel {
	container: Container;
	slots: Slot[] = [];
	index: number = 0;
	private reelIndex: number = 0;
	private slotIDs: number[] = [];
	private ticker?: Ticker;
	private elapsed = 0;
	private text: Text;

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
		this.text = new Text({
			style: DEBUG_TEXT_STYLE
		});
		this.text.position.set(-15, 200);
		this.container.addChild(this.text);
		if (DEBUG_MODE) {
			this.text.text = this.index.toString();
		}
	}

	async load(slotIDs: number[]) {
		this.slots = [];
		for (let i = 0; i < SHOWN_SLOTS; i++) {
			const slot = new Slot(i);
			const spriteID = slotIDs[i % slotIDs.length];
			await slot.load(spriteID);
			this.slots.push(slot);
			slot.container.y = i * STEP_HEIGHT;
			this.container.addChild(slot.container);
		}
	}

	spin(onStop?: () => void) {
		this.elapsed = 0;
		const rand = Math.round(10 + Math.random() * 5);
		const start = this.index;
		const end = start + rand + this.reelIndex * 5;
		const time = this.reelIndex * 25 + SLOT_SPIN_TIME;
		let last = start;

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
				if (onStop) {
					onStop();
				}
			}
			this.updateSlotPositions(current % this.slotIDs.length);
			while (current > last + 0.9) {
				last++;
				this.updateIndex();
			}
		});
		this.ticker.start();
	}

	private updateSlotPositions(currentDistance: number) {
		const height = 4 * STEP_HEIGHT;
		for (let i = 0; i < this.slots.length; i++) {
			const slot = this.slots[i];
			if (!slot || !slot.container) {
				console.warn(`Slot ${i} or its container is null`, slot);
				continue; // Skip this slot
			}
			const offset = i * STEP_HEIGHT;
			const pos = offset + currentDistance * STEP_HEIGHT;
			slot.container.y = pos % height;
		}
	}

	private updateIndex() {
		this.index++;
		this.index %= this.slotIDs.length;
		if (DEBUG_MODE) {
			this.text.text = this.index.toString();
		}
		let topSlot = this.slots[0];
		for (let i = 1; i < this.slots.length; i++) {
			if (this.slots[i].container.y > topSlot.container.y) {
				topSlot = this.slots[i];
			}
		}
		const nextSymbolIndex = (this.index + SHOWN_SLOTS) % this.slotIDs.length;
		topSlot.load(this.slotIDs[nextSymbolIndex]);
	}
}
