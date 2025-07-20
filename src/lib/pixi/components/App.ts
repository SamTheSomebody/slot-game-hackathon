import { Application, Container } from 'pixi.js';
import { DISPLAY } from '$lib/config/display';
import { Reels } from './Reels';
import { ControlPanel } from '../ui/ControlPanel';
import { Environment } from './Environment';

export class App {
	app: Application;
	stage: Container;

	constructor() {
		this.app = new Application();
		this.stage = this.app.stage;
	}

	async init(container: HTMLElement) {
		await this.app.init({
			background: '#000000',
			width: DISPLAY.width,
			height: DISPLAY.height,
			antialias: true
		});
		container.appendChild(this.app.canvas);

		this.stage.sortableChildren = true;
		const environment = new Environment();
		await environment.load();

		const reels = new Reels();
		await reels.load(this.generateRandomReels());
		reels.container.zIndex = 1;

		const controlPanel = new ControlPanel();
		await controlPanel.load();
		controlPanel.container.zIndex = 99;

		this.stage.addChild(environment.container, reels.container, controlPanel.container);
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
