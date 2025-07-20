import { Container, Graphics } from 'pixi.js';
import { Reel } from './Reel';
import { DISPLAY } from '$lib/config/display';
import { SLOT_BUFFER, SLOT_SIZE } from '$lib/config/slot';
import { spinCompleted, spinRequested } from '$lib/stores/gameState';

export class Reels {
	spinningReels: number = 0;
	container: Container;
	reels: Reel[] = [];

	constructor() {
		this.container = new Container({
			x: (DISPLAY.width - (SLOT_SIZE + SLOT_BUFFER) * 5) / 2,
			y: (DISPLAY.height - (SLOT_SIZE + SLOT_BUFFER) * 3) / 2
		});

		spinRequested.subscribe((requested) => {
			if (requested) {
				this.spin();
				spinRequested.update(() => false);
			}
		});
	}

	async load(reelsData: number[][]) {
		for (let i = 0; i < reelsData.length; i++) {
			const reel = new Reel(reelsData[i], i);
			await reel.load(reelsData[i]);
			reel.container.x = i * (SLOT_SIZE + SLOT_BUFFER);
			this.reels.push(reel);
			this.container.addChild(reel.container);
		}
		this.applyMask();
	}

	private applyMask() {
		const totalWidth = (SLOT_SIZE + SLOT_BUFFER) * 5;
		const totalHeight = (SLOT_SIZE + SLOT_BUFFER) * 3;
		const mask = new Graphics().rect(0, 0, totalWidth, totalHeight).fill(0xffffff);
		this.container.mask = mask;
		this.container.addChild(mask);
	}

	spin() {
		if (this.spinningReels > 0) {
			return;
		}
		spinCompleted.update(() => false);
		this.spinningReels = 5;
		this.reels.forEach((reel) =>
			reel.spin(() => {
				this.spinningReels--;
				if (this.spinningReels <= 0) {
					spinCompleted.update(() => true);
				}
			})
		);
	}
}
