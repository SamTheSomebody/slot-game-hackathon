import { Application, Container } from 'pixi.js';
import { DISPLAY } from '$lib/config/display';
import { Background } from './environment/Background';
import { Foreground } from './environment/Foreground';
import { Reels } from './Reels';
import { SpinButton } from '../ui/SpinButton';
import { Header } from '../ui/Header';

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
			width: 1280,
			height: 720
		});
		container.appendChild(this.app.canvas);

		await this.addBackground();
		await this.addForeground();
		await this.addReels();
		this.addSpinButton();
		await this.addHeader();
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

	private addSpinButton() {
		const spinButton = new SpinButton(() => this.reels.spin());
		spinButton.position = {
			x: (DISPLAY.width - spinButton.container.width) / 2,
			y: DISPLAY.height - spinButton.container.height - 20
		};
		this.stage.addChild(spinButton.container);
	}

	private async addHeader() {
		const header = new Header();
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
