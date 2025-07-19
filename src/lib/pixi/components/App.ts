import { Application, Container } from 'pixi.js';
import { DISPLAY } from '$lib/config/display';
import { Background } from './environment/Background';
import { Foreground } from './environment/Foreground';
import { Reels } from './Reels';
import { ControlPanel } from '../ui/ControlPanel';

export class App {
	app: Application;
	stage: Container;
	reels!: Reels;

	constructor() {
		this.app = new Application();
		this.stage = this.app.stage;
	}

	async init(container: HTMLElement) {
		await this.app.init({
			background: '#000000',
			width: DISPLAY.width,
			height: DISPLAY.height
		});
		container.appendChild(this.app.canvas);
		await this.addBackground();
		await this.addForeground();
		await this.addReels();
		await this.addControlPanel();
	}

	private async addBackground() {
		const background = new Background();
		await background.load();
		this.stage.addChildAt(background.container, 0);
	}

	private async addForeground() {
		const foreground = new Foreground();
		await foreground.load();
		this.stage.addChildAt(foreground.container, 1);
	}

	private async addReels() {
		this.reels = new Reels();
		await this.reels.load(this.generateRandomReels());
		this.stage.addChildAt(this.reels.container, 2);
	}

	private async addControlPanel() {
		const header = new ControlPanel();
		await header.load();
		this.stage.addChild(header.container);
	}

	private generateRandomReels(count = 5): number[][] {
		return Array.from({ length: count }, () => this.generateRandomSlots());
	}

	private generateRandomSlots(count = 30, max = 11): number[] {
		return Array.from({ length: count }, () => Math.floor(Math.random() * max));
	}

	destroy() {
		this.app.destroy(true, { children: true });
	}
}
