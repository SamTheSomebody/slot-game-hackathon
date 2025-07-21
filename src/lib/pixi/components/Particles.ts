import gsap from 'gsap';
import { Particle, ParticleContainer, Texture } from 'pixi.js';

export class Particles {
	container: ParticleContainer;
	private texture: Texture;
	private width: number;
	private height: number;
	private poolIndex: number = 0;

	constructor(texture: Texture, width: number, height: number) {
		this.container = new ParticleContainer({
			dynamicProperties: { position: true, rotation: true, color: true, scale: true }
		});
		this.texture = texture;
		this.width = width;
		this.height = height;
	}

	//Quick and dirty object pooling
	//Need to look into this deeper but Particle has no destory method so might as well try to reuse them.
	//Mostly likely more efficient either way, no time for profiling.
	private newParticle(): Particle {
		if (
			this.container.children.length > 1 &&
			this.container.children[this.poolIndex + 1].alpha < 0.1
		) {
			this.poolIndex++;
			this.poolIndex %= this.container.children.length;
			return this.container.children[this.poolIndex] as unknown as Particle;
		}
		const particle = new Particle({
			texture: this.texture,
			x: Math.random() * this.width,
			y: Math.random() * this.height
		});
		this.container.addParticle(particle);
		return particle;
	}

	preload(quantity: number = 100) {
		for (let i = 0; i < quantity; i++) {
			const particle = this.newParticle();
			particle.scaleX = 0;
			particle.scaleY = 0;
			particle.alpha = 0;
		}
	}

	burst(
		quantity: number = 100,
		offsetY: number = 0,
		scale: number = 1,
		rotation: number = 0,
		lifetime: number = 1
	) {
		for (let i = 0; i < quantity; i++) {
			const particle = this.newParticle();
			particle.scaleX = 0;
			particle.scaleY = 0;
			particle.alpha = 0;
			const rand = Math.random();
			particle.rotation = rand * 2 * Math.PI;
			gsap.to(particle, {
				scaleX: (1 + rand / 20) * scale,
				scaleY: (1 + rand / 20) * scale,
				y: particle.y - offsetY / 5,
				alpha: 1,
				delay: i / 10,
				duration: 0.2,
				onComplete: () => {
					particle.scaleX = (1 + rand / 20) * scale;
					particle.scaleY = (1 + rand / 20) * scale;
					particle.alpha = 1;
					gsap.to(particle, {
						x: particle.x + rand,
						y: particle.y + offsetY,
						rotation: rotation * rand,
						alpha: 0,
						duration: lifetime,
						onComplete: () => {
							particle.alpha = 0;
						}
					});
				}
			});
		}
	}
}
