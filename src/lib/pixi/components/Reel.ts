import { Container, Graphics, Text, Ticker } from 'pixi.js';
import { Slot } from './Slot';
import {
	SLOT_SIZE,
	SLOT_BUFFER,
	SLOT_SPIN_TIME,
	SHOWN_SLOTS,
	SLOT_SPIN_MULTIPLIER,
	GRADIENT,
	SLOT_SPIN_FAST_TIME
} from '$lib/config/slot';
import { easeOutBack } from '$lib/utility/ease';
import { lerp } from '$lib/utility/lerp';
import { DEBUG_MODE, DEBUG_TEXT_STYLE } from '$lib/config/debug';
import type { SymbolSpriteSheets } from './SymbolSpriteSheets';
import { reelPositions, reelsSpinning, setFastMode, setNoSpinDelay } from '$lib/stores/gameState';

const STEP_HEIGHT = SLOT_SIZE + SLOT_BUFFER;
const HEIGHT = 4 * STEP_HEIGHT;

export class Reel {
	container: Container;
	slots: Slot[] = [];
	index: number = 0;
	reelIndex: number = 0;
	private slotIDs: number[] = [];
	private ticker?: Ticker;
	private elapsed = 0;
	private text: Text | undefined;
	private nextSlotToUpdate = 0;
	private isNoDelay = false;
	private isFastMode = false;

	constructor(slotIDs: number[], reelIndex: number) {
		this.container = new Container();
		this.container.y = -STEP_HEIGHT;
		const background = new Graphics().rect(0, 0, SLOT_SIZE + 10, STEP_HEIGHT * 5).fill(GRADIENT);
		this.container.addChild(background);
		this.slotIDs = slotIDs;
		this.reelIndex = reelIndex;
		this.debugText();

		setFastMode.subscribe((toggle) => {
			this.isFastMode = toggle;
		});
		setNoSpinDelay.subscribe((toggle) => {
			this.isNoDelay = toggle;
		});
	}

	async load(slotIDs: number[], sheets: SymbolSpriteSheets) {
		this.slots = [];
		for (let i = 0; i < SHOWN_SLOTS; i++) {
			const slot = new Slot(i, sheets, this);
			const index = SHOWN_SLOTS - 1 - i;
			const spriteID = slotIDs[i];
			await slot.updateID(spriteID, i);
			this.slots.push(slot);
			slot.container.y = index * STEP_HEIGHT;
			this.container.addChild(slot.container);
			this.index++;
		}
	}

	spin() {
		reelsSpinning.update((amount) => amount + 1);
		this.elapsed = 0;
		const rand = Math.round(10 + Math.random() * 5 * this.reelIndex);
		const start = this.index;
		const end = this.index + rand;
		const target = end % this.slotIDs.length;
		const spinDelay = this.isNoDelay ? 0 : this.reelIndex * SLOT_SPIN_MULTIPLIER;
		const spinTime = this.isFastMode ? SLOT_SPIN_FAST_TIME : SLOT_SPIN_TIME;
		const time = spinDelay + spinTime;
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
			this.updateSlotPositions(current);
			while (current < end && current > last + 0.9) {
				last++;
				this.updateIndex();
			}
		});
		this.ticker.start();
	}

	animateSymbol(visualIndex: number) {
		this.slots[visualIndex].animate();
	}

	private updateSlotPositions(currentDistance: number) {
		for (let i = 0; i < SHOWN_SLOTS; i++) {
			const slot = this.slots[i];
			const offset = SHOWN_SLOTS - 1 - i;
			const pos = (offset + currentDistance) * STEP_HEIGHT;
			slot.container.y = pos % HEIGHT;
		}
	}

	private updateIndex() {
		this.index = this.incrementIndex();
		const nextIndex = this.incrementIndex();
		const nextSymbol = this.slotIDs[nextIndex];
		this.slots[this.nextSlotToUpdate].updateID(nextSymbol, nextIndex);
		this.nextSlotToUpdate++;
		this.nextSlotToUpdate %= SHOWN_SLOTS;
		this.debugText();
	}

	private incrementIndex() {
		const i = this.index++;
		return i % this.slotIDs.length;
	}

	private debugText() {
		if (DEBUG_MODE) {
			if (!this.text) {
				this.text = new Text({
					text: this.index.toString(),
					style: DEBUG_TEXT_STYLE,
					y: STEP_HEIGHT * 3.7
				});
				this.container.addChild(this.text);
			} else {
				this.text.text = this.index.toString();
			}
		}
	}
}
