import { Color, Container, FillGradient, Graphics, Ticker } from 'pixi.js';
import { Slot } from './Slot';
import { SLOT_SIZE, SLOT_BUFFER, SLOT_SPEED, SLOT_SPIN_TIME } from '$lib/config/slot';

const SHOWN_SLOTS = 4;

export class Reel {
	container: Container;
	slots: Slot[] = [];
	position: number = 0;
	private reelIndex: number = 0;
	private slotIDs: number[] = [];
	private ticker?: Ticker;
	private elapsed = 0;

	constructor(slotIDs: number[], reelIndex: number) {
		this.container = new Container();
		this.container.width = SLOT_SIZE;
		this.container.height = (SLOT_SIZE + SLOT_BUFFER) * 5;
		const colorEnds = new Color([0, 0, 0, 0]);
		const gradient = new FillGradient({
			type: 'linear',
			start: { x: 0, y: 0 },
			end: { x: 1, y: 0 },
			colorStops: [
				{ offset: 0, color: colorEnds },
				{ offset: 0.5, color: new Color([0, 0, 0, 0.5]) },
				{ offset: 1, color: colorEnds }
			]
		});
		const background = new Graphics()
			.rect(0, 0, SLOT_SIZE + 10, (SLOT_SIZE + SLOT_BUFFER) * 5)
			.fill(gradient);
		this.container.addChild(background);
		this.slotIDs = slotIDs;
		this.reelIndex = reelIndex;
	}

	async load(slotIDs: number[]) {
		this.slots = [];
		for (let i = 0; i < SHOWN_SLOTS; i++) {
			const spriteID = slotIDs[i];
			const slot = new Slot(i);
			await slot.load(slotIDs[spriteID]);
			this.slots.push(slot);
			slot.container.y = SHOWN_SLOTS + i * (SLOT_SIZE + SLOT_BUFFER);
			this.container.addChild(slot.container);
		}
	}

	spin(onStop?: () => void) {
		this.elapsed = 0;
		this.ticker = new Ticker(); //TODO add tweening
		this.ticker.add((ticker: Ticker) => {
			for (let i = 0; i < SHOWN_SLOTS; i++) {
				this.slots[i].container.y += SLOT_SPEED * (this.reelIndex + 1) * ticker.deltaTime;
			}
			this.update_position();
			this.elapsed++;
			if (this.elapsed >= SLOT_SPIN_TIME + this.reelIndex * 10) {
				this.ticker?.stop();
				this.ticker?.destroy();
				if (onStop) {
					onStop();
				}
			}
		});
		this.ticker.start();
	}

	private update_position() {
		//TODO ensure that its clamped
		//Only 4 slots are shown at a time, we have a reel of 30
		//Position is the currently selected slot
		//We need to check the bottom most slot
		//If it is off the screen, we move it to the top and assign the next slot index from the reel
		const height = 3 * (SLOT_SIZE + SLOT_BUFFER);
		for (const slot of this.slots) {
			if (slot.container.y > height) {
				slot.container.y -= height + SLOT_SIZE + SLOT_BUFFER;
				slot.load(this.slotIDs[this.position]);
			}
			this.position++;
			this.position %= this.slotIDs.length;
		}
		/*
		const bottomSlotIndex = (this.position + SHOWN_SLOTS - 1) % SHOWN_SLOTS;
		const bottomSlot = this.slots[bottomSlotIndex];
		if (bottomSlot.container.y < height) {
			return;
		}
		bottomSlot.container.y -= height;
		console.log(bottomSlotIndex, bottomSlot);
		const nextIndex = (this.position + SHOWN_SLOTS) % this.slotIDs.length;
		bottomSlot.load(this.slotIDs[nextIndex]);*/
	}
}
