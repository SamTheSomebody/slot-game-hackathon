import { Container, Sprite, Text, Texture } from 'pixi.js';
import { SLOT_SIZE } from '$lib/config/slot';
import { DEBUG_TEXT_STYLE } from '../debug/text';
import { DEBUG_MODE } from '$lib/config/debug';
import { SymbolSpriteSheets } from './SymbolSpriteSheets';
import gsap from 'gsap';
import { fitSpriteToSquare } from '../utility/fitSpriteToSquare';

export class Slot {
	id: number;
	container: Container;
	private animationTimeline: gsap.core.Timeline | undefined;
	private sheets: SymbolSpriteSheets;
	private sprite: Sprite;
	private reelIndex: number;
	private text: Text | undefined;

	constructor(reelIndex: number, sheets: SymbolSpriteSheets) {
		this.id = -1;
		this.reelIndex = reelIndex;
		this.sheets = sheets;
		this.container = new Container();
		this.sprite = new Sprite({
			anchor: 0.5,
			x: SLOT_SIZE / 2,
			y: SLOT_SIZE / 2,
			height: SLOT_SIZE,
			width: SLOT_SIZE
		});
		this.container.addChild(this.sprite);
	}

	async updateID(id: number) {
		this.animationTimeline?.kill();
		this.id = id;
		const texture = this.sheets.getTextureById(id, 1);
		this.sprite.texture = texture ?? Texture.EMPTY; //TODO handle this more gracefully
		fitSpriteToSquare(this.sprite, SLOT_SIZE);
		this.debugText();
	}

	animate() {
		const rand = Math.floor(Math.random() * (9 - 2 + 1)) + 2; //Most sprite sheets have 9 or so sprites
		const texture = this.sheets.getTextureById(this.id, rand);
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

	private debugText() {
		if (DEBUG_MODE) {
			if (!this.text) {
				this.text = new Text({
					text: `V: ${this.reelIndex},\nS: ${this.id}`,
					style: DEBUG_TEXT_STYLE,
					x: 55,
					y: 55
				});
				this.container.addChild(this.text);
			} else {
				this.text.text = `V: ${this.reelIndex},\nS: ${this.id}`;
			}
		}
	}
}
