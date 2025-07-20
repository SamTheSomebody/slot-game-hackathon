import { BACKGROUND_IMAGES } from '$lib/config/environment/background';
import { Assets, Container, Sprite } from 'pixi.js';
import { ImageLoader } from './ImageLoader';
import { spinCompleted, spinRequested } from '$lib/stores/gameState';
import gsap from 'gsap';
import { FOREGROUND_IMAGES } from '$lib/config/environment/foreground';
import { CLOUD_URL } from '$lib/config/environment/misc';
import { DISPLAY } from '$lib/config/display';
import { TREE_IMAGES } from '$lib/config/environment/trees';

export class Environment {
	container: Container;
	private background!: Container;
	private foreground!: Container;
	private trees!: Container;
	private canSpin = true;

	constructor() {
		this.container = new Container();
		this.container.sortableChildren = true;

		spinRequested.subscribe((requested) => {
			if (requested) {
				this.bounceChildren(this.background);
			}
		});

		spinCompleted.subscribe((completed) => {
			if (completed) {
				this.canSpin = true;
			}
		});
	}

	async load() {
		const texture = await Assets.load(CLOUD_URL);
		for (let i = 0; i < 3; i++) {
			const cloud = new Sprite(texture);
			cloud.scale = (Math.random() / 2 + 0.75) / 3;
			const x = cloud.width;
			cloud.position.set(x, 100 * i);
			cloud.zIndex = 5;
			this.container.addChild(cloud);
			gsap.fromTo(
				cloud,
				{ x: -x },
				{
					x: x + DISPLAY.width,
					duration: 60 + Math.random() * 20,
					delay: i * 10,
					repeat: -1,
					ease: 'none'
				}
			);
		}
		const background = new ImageLoader();
		await background.load(BACKGROUND_IMAGES);
		this.background = background.container;
		this.background.zIndex = 0;

		const trees = new ImageLoader();
		await trees.load(TREE_IMAGES);
		this.trees = trees.container;
		this.trees.zIndex = 10;

		const foreground = new ImageLoader();
		await foreground.load(FOREGROUND_IMAGES);
		this.foreground = foreground.container;
		this.foreground.zIndex = 50;

		this.container.addChild(this.background, this.trees, this.foreground);
	}

	bounceChildren(container: Container) {
		if (!this.canSpin) {
			return;
		}
		this.canSpin = false;
		container.children.forEach((child, index) => {
			const originalY = child.y;
			gsap.fromTo(
				child,
				{ y: originalY },
				{
					y: originalY - 20,
					duration: 0.25,
					delay: (container.children.length - 1 - index) * 0.05,
					ease: 'ease.inOut',
					yoyo: true,
					repeat: 1
				}
			);
		});
	}
}
