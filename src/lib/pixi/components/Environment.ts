import { BACKGROUND_IMAGES, CLOUD_URL, LEAF_URL, TREE_IMAGES } from '$lib/config/environment';
import { Assets, Container, Sprite } from 'pixi.js';
import { loadImages } from '$lib/utility/loadImages';
import { setFastMode, spinInitiated } from '$lib/stores/gameState';
import gsap from 'gsap';
import { DISPLAY } from '$lib/config/display';
import { Particles } from './Particles';

export class Environment {
	container: Container;
	private background!: Container;
	private trees!: Container;
	private leafParticles: Particles[] = [];
	private isFastMode = false;

	constructor() {
		this.container = new Container();
		this.container.sortableChildren = true;

		spinInitiated.subscribe((is) => {
			if (is) {
				this.bounceBackground();
				this.shakeTrees();
			}
		});

		setFastMode.subscribe((active) => {
			this.isFastMode = active;
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

		const background = await loadImages(BACKGROUND_IMAGES);
		this.background = background;
		this.background.zIndex = 0;

		const trees = await loadImages(TREE_IMAGES);
		this.trees = trees;
		this.trees.zIndex = 10;

		const leafTexture = await Assets.load(LEAF_URL);
		for (let i = 0; i < 2; i++) {
			const particles = new Particles(leafTexture, 400, 300);
			particles.preload(500);
			particles.container.zIndex = 20;
			this.leafParticles.push(particles);
		}
		this.leafParticles[0].container.x = DISPLAY.width - 400;

		this.container.addChild(
			this.background,
			this.trees,
			this.leafParticles[0].container,
			this.leafParticles[1].container
		);
	}

	bounceBackground() {
		if (this.isFastMode) {
			return;
		}
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
		for (let i = 0; i < 2; i++) {
			this.leafParticles[i].burst(500, 200, 0.5, 2, 2);
		}
		if (this.isFastMode) {
			return;
		}
		this.trees.children.forEach((child, index) => {
			const originalX = child.x;
			const multiplier = index === 0 ? 1 : -1;
			gsap.fromTo(
				child,
				{ x: originalX, rotation: 0 },
				{
					x: originalX + 10 * multiplier,
					rotation: 0.02 * -multiplier,
					duration: this.isFastMode ? 0 : 0.25,
					ease: 'expo.out',
					yoyo: true,
					repeat: 1
				}
			);
		});
	}
}
