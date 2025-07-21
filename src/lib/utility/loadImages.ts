import { DISPLAY } from '$lib/config/display';
import type { ImageLoaderData } from '$lib/config/environment';
import { Sprite, Assets, Container } from 'pixi.js';

export async function loadImages(data: ImageLoaderData[]): Promise<Container> {
	const container = new Container();
	for (const { url, x, y, z, width, height } of data) {
		const texture = await Assets.load(url);
		const sprite = new Sprite(texture);
		sprite.texture = texture;
		sprite.width = width ?? DISPLAY.width;
		sprite.height = height ?? DISPLAY.height;
		sprite.x = x ?? 0;
		sprite.y = y ?? 0;
		if (z) {
			container.sortableChildren = true;
			sprite.zIndex = z;
		}
		container.addChild(sprite);
	}
	return container;
}
