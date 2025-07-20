import { DISPLAY } from '$lib/config/display';
import { Sprite, Assets, Container } from 'pixi.js';

export type ImageLoaderData = {
	url: string;
	x?: number;
	y?: number;
	z?: number;
	width?: number;
	height?: number;
};

export class ImageLoader {
	container: Container;

	constructor() {
		this.container = new Container();
	}

	async load(data: ImageLoaderData[]) {
		for (const { url, x, y, z, width, height } of data) {
			const texture = await Assets.load(url);
			const sprite = new Sprite(texture);
			sprite.texture = texture;
			sprite.width = width ?? DISPLAY.width;
			sprite.height = height ?? DISPLAY.height;
			sprite.x = x ?? 0;
			sprite.y = y ?? 0;
			if (z) {
				this.container.sortableChildren = true;
				sprite.zIndex = z;
			}
			this.container.addChild(sprite);
		}
	}

	addTo(stage: Container) {
		stage.addChildAt(this.container, 0);
	}
}
