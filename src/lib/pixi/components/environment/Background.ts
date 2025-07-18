import { Sprite, Assets, Container } from 'pixi.js';

const URLS = [
	'/assets/environment/background/sky.png',
	'/assets/environment/background/mountains.png',
	'/assets/environment/background/hill_background.png',
	'/assets/environment/background/hill_midground.png'
];

const IMAGES = [
	{
		url: '/assets/environment/trees/tree_1.png',
		x: 900,
		y: -200,
		width: 670,
		height: 930
	},
	{
		url: '/assets/environment/trees/tree_2A.png',
		x: -200,
		y: -250,
		width: 670,
		height: 930
	}
];

export class Background {
	container: Container;

	constructor() {
		this.container = new Container();
	}

	async load() {
		const image_vertical_gap = 150;
		for (let i = 0; i < URLS.length; i++) {
			const texture = await Assets.load(URLS[i]);
			const sprite = new Sprite(texture);
			sprite.texture = texture;
			sprite.width = 1280;
			sprite.height = 720;
			sprite.x = 0;
			sprite.y = image_vertical_gap * i;
			this.container.addChild(sprite);
		}
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
		stage.addChildAt(this.container, 0);
	}
}
