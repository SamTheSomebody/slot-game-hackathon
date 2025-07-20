import { Container, Sprite, Assets, Text } from 'pixi.js';
import { SLOT_LOOKUP, SLOT_SIZE } from '$lib/config/slot';
import { DEBUG_TEXT_STYLE } from '../debug/text';
import { DEBUG_MODE } from '$lib/config/debug';

export class Slot {
	id: number;
	container: Container;
	private sprite: Sprite;

	constructor(reelIndex: number) {
		this.id = -1;
		this.container = new Container();
		this.sprite = new Sprite({
			anchor: 0.5,
			x: SLOT_SIZE / 2,
			y: SLOT_SIZE / 2,
			height: SLOT_SIZE,
			width: SLOT_SIZE
		});
		this.container.addChild(this.sprite);
		if (DEBUG_MODE) {
			const text = new Text({
				text: reelIndex.toString(),
				style: DEBUG_TEXT_STYLE,
				x: 5,
				y: 5
			});
			this.container.addChild(text);
		}
	}

	async load(id: number) {
		const url = SLOT_LOOKUP[id];
		if (!url) {
			throw new Error(`No asset found for slot ID ${id}`);
		}
		this.id = id;
		const texture = await Assets.load(SLOT_LOOKUP[this.id]);
		this.sprite.texture = texture;
	}
}
