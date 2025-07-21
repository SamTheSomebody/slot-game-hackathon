import { BACKGROUND_IMAGES } from '$lib/config/environment/background';
import { Assets, Container, Sprite } from 'pixi.js';
import { ImageLoader } from './ImageLoader';
import { spinInitiated } from '$lib/stores/gameState';
import gsap from 'gsap';
import { FOREGROUND_IMAGES } from '$lib/config/environment/foreground';
import { CLOUD_URL, LEAF_URL } from '$lib/config/environment/misc';
import { DISPLAY } from '$lib/config/display';
import { TREE_IMAGES } from '$lib/config/environment/trees';
import { Particles } from './Particles';

export class Environment {
	container: Container;
	private background!: Container;
	private foreground!: Container;
	private trees!: Container;
	private leafParticlesLeft!: Particles;
	private leafParticlesRight!: Particles;

	constructor() {
		this.container = new Container();
		this.container.sortableChildren = true;

		spinInitiated.subscribe((requested) => {
			if (requested) {
				this.bounceBackground();
				this.shakeTrees();
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

		const leafTexture = await Assets.load(LEAF_URL);
		this.leafParticlesLeft = new Particles(leafTexture, 400, 300);
		this.leafParticlesRight = new Particles(leafTexture, 400, 300);
		this.leafParticlesLeft.preload(500);
		this.leafParticlesRight.preload(500);
		this.leafParticlesRight.container.x = DISPLAY.width - 400;
		this.leafParticlesLeft.container.zIndex = 20;
		this.leafParticlesRight.container.zIndex = 20;

		const foreground = new ImageLoader();
		await foreground.load(FOREGROUND_IMAGES);
		this.foreground = foreground.container;
		this.foreground.zIndex = 90;

		this.container.addChild(
			this.background,
			this.trees,
			this.leafParticlesLeft.container,
			this.leafParticlesRight.container,
			this.foreground
		);
	}

	bounceBackground() {
		this.background.children.forEach((child, index) => {
			const originalY = child.y;
			gsap.fromTo(
				child,
				{ y: originalY },
				{
					y: originalY - 20,
					duration: 0.25,
					delay: (this.background.children.length - index) * 0.05,
					ease: 'ease.inOut',
					yoyo: true,
					repeat: 1
				}
			);
		});
	}

	shakeTrees() {
		this.trees.children.forEach((child, index) => {
			const originalX = child.x;
			const multiplier = index === 0 ? 1 : -1;
			gsap.fromTo(
				child,
				{ x: originalX, rotation: 0 },
				{
					x: originalX + 10 * multiplier,
					rotation: 0.02 * -multiplier,
					duration: 0.25,
					ease: 'expo.out',
					yoyo: true,
					repeat: 1
				}
			);
		});
		this.leafParticlesRight.burst(500, 200, 0.5, 2, 2);
		this.leafParticlesLeft.burst(500, 200, 0.5, 2, 2);
	}
}
