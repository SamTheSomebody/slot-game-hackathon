import { Container, Graphics } from 'pixi.js';
import { Reel } from './Reel';
import { DISPLAY } from '$lib/config/display';
import { SHOWN_SLOTS, SLOT_BUFFER, SLOT_SIZE } from '$lib/config/slot';
import { spinInitiated } from '$lib/stores/gameState';
import { SymbolSpriteSheets } from './SymbolSpriteSheets';

export class Reels {
	spinningReels: number = 0;
	container: Container;
	reels: Reel[] = [];
	private animationIntervalId?: number;

	constructor() {
		this.container = new Container({
			x: (DISPLAY.width - (SLOT_SIZE + SLOT_BUFFER) * 5) / 2,
			y: (DISPLAY.height - (SLOT_SIZE + SLOT_BUFFER) * 3) / 2
		});

		spinInitiated.subscribe((initiated) => {
			if (initiated) {
				this.spin();
			}
		});
	}

	async load(reelsData: number[][]) {
		const sheets = new SymbolSpriteSheets();
		await sheets.load();
		for (let i = 0; i < reelsData.length; i++) {
			const reel = new Reel(reelsData[i], i);
			await reel.load(reelsData[i], sheets);
			reel.container.x = i * (SLOT_SIZE + SLOT_BUFFER);
			this.reels.push(reel);
			this.container.addChild(reel.container);
		}
		this.applyMask();
		this.startRandomAnimations();
	}

	private applyMask() {
		const totalWidth = (SLOT_SIZE + SLOT_BUFFER) * 5 + SLOT_BUFFER * 2;
		const totalHeight = (SLOT_SIZE + SLOT_BUFFER) * 3;
		const mask = new Graphics().rect(-SLOT_BUFFER, 0, totalWidth, totalHeight).fill(0xffffff);
		this.container.mask = mask;
		this.container.addChild(mask);
	}

	spin() {
		this.spinningReels = 5;
		this.reels.forEach((reel) => reel.spin());
	}

	startRandomAnimations(intervalMs = 1000) {
		if (this.animationIntervalId) {
			clearInterval(this.animationIntervalId);
		}
		this.animationIntervalId = window.setInterval(() => {
			this.animateRandomSymbol();
		}, intervalMs);
	}

	stopRandomAnimations() {
		if (this.animationIntervalId) {
			clearInterval(this.animationIntervalId);
			this.animationIntervalId = undefined;
		}
	}

	animateRandomSymbol() {
		const reelIndex = Math.floor(Math.random() * this.reels.length);
		const reel = this.reels[reelIndex];
		const visualIndex = Math.floor(Math.random() * SHOWN_SLOTS);

		reel.animateSymbol(visualIndex);
	}
}
