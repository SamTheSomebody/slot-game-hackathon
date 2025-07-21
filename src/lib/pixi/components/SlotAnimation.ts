import { Container, Sprite, Texture } from 'pixi.js';
import { fitSpriteToSquare } from '$lib/utility/fitSpriteToSquare';
import { SLOT_SIZE } from '$lib/config/slot';
import type { SymbolSpriteSheets } from './SymbolSpriteSheets';
import { Slot } from './Slot';
import { spinInitiated, updatePayout, type Payout } from '$lib/stores/gameState';
import { AdvancedBloomFilter, GlowFilter } from 'pixi-filters';
import gsap from 'gsap';
import { RARITY_VALUES } from '$lib/config/symbols';

export class SlotAnimation {
	slot: Slot;
	container: Container;
	private sprite: Sprite;
	private glowFilter: GlowFilter;
	private bloomFilter: AdvancedBloomFilter;
	private animationTimeline: gsap.core.Timeline | undefined;
	private sheets: SymbolSpriteSheets;
	private bloomTween: GSAPTween | undefined;
	private glowTween: GSAPTween | undefined;

	constructor(sheets: SymbolSpriteSheets, slot: Slot) {
		this.sprite = new Sprite({
			anchor: 0.5,
			x: SLOT_SIZE / 2,
			y: SLOT_SIZE / 2,
			height: SLOT_SIZE,
			width: SLOT_SIZE
		});
		this.glowFilter = new GlowFilter({
			alpha: 0
		});
		this.bloomFilter = new AdvancedBloomFilter({
			bloomScale: 0
		});
		this.sheets = sheets;
		this.slot = slot;
		this.container = slot.container;
		this.container.addChild(this.sprite);

		updatePayout.subscribe((payout) => {
			this.togglePayout(payout);
		});

		spinInitiated.subscribe((initiated) => {
			if (initiated) {
				this.hidePayout();
			}
		});
		this.sprite.filters = [this.glowFilter, this.bloomFilter];
	}

	updateVisual() {
		this.animationTimeline?.kill();
		const texture = this.sheets.getTextureById(this.slot.id, 1);
		this.sprite.texture = texture ?? Texture.EMPTY; //TODO handle this more gracefully
		fitSpriteToSquare(this.sprite, SLOT_SIZE);
	}

	animate() {
		const rand = Math.floor(Math.random() * (9 - 2 + 1)) + 2; //Most sprite sheets have 9 or so sprites
		const texture = this.sheets.getTextureById(this.slot.id, rand);
		if (!texture) {
			return;
		}
		const originalTexture = this.sprite.texture;
		this.animationTimeline = gsap
			.timeline()
			.set(this.sprite, {
				texture: texture,
				onComplete: () => {
					fitSpriteToSquare(this.sprite, SLOT_SIZE);
				}
			})
			.to({}, { duration: 0.5 })
			.set(this.sprite, {
				texture: originalTexture,
				onComplete: () => {
					fitSpriteToSquare(this.sprite, SLOT_SIZE);
				}
			});
	}

	togglePayout(payout: Payout) {
		const slotIndex = Math.round(this.container.y / 170) - 1;
		const isMatch =
			payout && this.slot.reel.reelIndex === payout.reelIndex && slotIndex === payout.slotIndex;
		if (!isMatch) {
			return;
		}
		const values = RARITY_VALUES[payout.rarity];
		this.glowFilter.color = values.color;
		this.glowFilter.outerStrength = values.intensity * 3;
		this.glowFilter.distance = values.intensity * 30;
		this.glowTween?.kill();
		this.glowTween = gsap.to(this.glowFilter, {
			alpha: 0.5,
			duration: 1
		});
		this.bloomTween?.kill();
		this.bloomTween = gsap.to(this.bloomFilter, {
			bloomScale: values.intensity,
			brightness: values.intensity,
			duration: 1
		});
	}

	hidePayout() {
		this.glowTween?.kill();
		this.glowTween = gsap.to(this.glowFilter, {
			alpha: 0,
			duration: 0.5
		});
		this.bloomTween?.kill();
		this.bloomTween = gsap.to(this.bloomFilter, {
			bloomScale: 0,
			brightness: 1,
			duration: 0.5
		});
	}
}
