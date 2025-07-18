import { Container, Sprite, Assets, Text } from 'pixi.js';
import { SLOT_LOOKUP, SLOT_SIZE } from '$lib/config/slot';
import { DEBUG_MODE } from '$lib/config/debug';
import { DEBUG_TEXT_STYLE } from '../debug/Text';

export class Slot {
	id: number;
	container: Container;
	private sprite: Sprite;
	private text: Text;
	private reelPosition: number;

	constructor(reelPosition: number) {
		this.id = -1;
		this.reelPosition = reelPosition;
		this.container = new Container();
		this.sprite = new Sprite({
			anchor: 0.5,
			x: SLOT_SIZE / 2,
			y: SLOT_SIZE / 2,
			height: SLOT_SIZE,
			width: SLOT_SIZE
		});
		this.text = new Text({
			style: DEBUG_TEXT_STYLE,
			x: 5,
			y: 5
		});
		this.container.addChildAt(this.sprite, 0);
		this.container.addChildAt(this.text, 1);
	}

	async load(id: number) {
		const url = SLOT_LOOKUP[id];
		if (!url) {
			throw new Error(`No asset found for slot ID ${id}`);
		}
		this.id = id;
		const texture = await Assets.load(SLOT_LOOKUP[this.id]);
		this.sprite.texture = texture;
		this.text.text = DEBUG_MODE
			? `Sprite ID: ${id},\nPos: ${this.reelPosition}\nhasBonus: ${false}\nyPos: ${this.container.y}`
			: '';
	}
}
