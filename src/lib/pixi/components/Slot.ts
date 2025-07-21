import { Container, Text } from 'pixi.js';
import { DEBUG_MODE, DEBUG_TEXT_STYLE } from '$lib/config/debug';
import { SymbolSpriteSheets } from './SymbolSpriteSheets';
import { SlotAnimation } from './SlotAnimation';
import type { Reel } from './Reel';

export class Slot {
	id: number;
	container: Container;
	reel: Reel; //Dirtyly pass visual index down the chain for payout effects
	private animation: SlotAnimation;
	private visualIndex: number;
	private reelIndex: number = 0;
	private text: Text | undefined;

	constructor(visualIndex: number, sheets: SymbolSpriteSheets, reel: Reel) {
		this.id = -1;
		this.reel = reel;
		this.visualIndex = visualIndex;
		this.container = new Container();
		this.animation = new SlotAnimation(sheets, this);
	}

	animate() {
		this.animation.animate();
	}

	async updateID(id: number, reelIndex: number) {
		this.id = id;
		this.reelIndex = reelIndex;
		this.debugText();
		this.animation.updateVisual();
	}

	private debugText() {
		if (DEBUG_MODE) {
			if (!this.text) {
				this.text = new Text({
					text: `V: ${this.visualIndex}\nR: ${this.reelIndex}\nS: ${this.id}`,
					style: DEBUG_TEXT_STYLE,
					x: 55,
					y: 55
				});
				this.container.addChild(this.text);
			} else {
				this.text.text = `V: ${this.visualIndex}\nR: ${this.reelIndex}\nS: ${this.id}`;
			}
		}
	}
}
