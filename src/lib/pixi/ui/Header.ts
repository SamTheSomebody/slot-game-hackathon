import { DISPLAY } from '$lib/config/display';
import { Assets, Container, Sprite } from 'pixi.js';

const HEADER_IMAGE = '/assets/ui/up.png';

export class Header {
	container: Container;

	constructor() {
		this.container = new Container({
			width: DISPLAY.width
		});
	}

	async load() {
		const texture = await Assets.load(HEADER_IMAGE);
		const sprite = new Sprite(texture);
		sprite.width = DISPLAY.width;
		sprite.height = 75;
		this.container.addChild(sprite);
	}
}
