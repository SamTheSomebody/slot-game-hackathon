import { Sprite, Assets, Container } from 'pixi.js';

const IMAGES = [{ url: '/assets/environment/ground.png', x: 0, y: 600, width: 1280, height: 283 }];

export class Foreground {
	container: Container;

	constructor() {
		this.container = new Container();
	}

	async load() {
		for (const { url, x, y, width, height } of IMAGES) {
			const texture = await Assets.load(url);
			const sprite = new Sprite(texture);
			sprite.texture = texture;
			sprite.width = width;
			sprite.height = height;
			sprite.x = x;
			sprite.y = y;
			this.container.addChild(sprite);
		}
	}

	addTo(stage: Container) {
		stage.addChildAt(this.container, 1);
	}
}
