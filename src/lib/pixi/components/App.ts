import { Application, Container } from 'pixi.js';
import { DISPLAY } from '$lib/config/display';
import { Reels } from './Reels';
import { ControlPanel } from '../ui/ControlPanel';
import { Environment } from './Environment';
import { SpinControl } from './SpinControl';
import { reelPositions } from '$lib/stores/gameState';
import { REELS } from '$lib/config/reels';
import { ImageLoader } from './ImageLoader';
import { FOREGROUND_IMAGES } from '$lib/config/environment/foreground';

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
		await reels.load(REELS); //TODO toggle for generate random
		reels.container.zIndex = 1;
		reelPositions.set([0, 0, 0, 0, 0]);

		const foreground = new ImageLoader();
		await foreground.load(FOREGROUND_IMAGES);
		foreground.container.zIndex = 90;

		const controlPanel = new ControlPanel();
		await controlPanel.load();
		controlPanel.container.zIndex = 99;

		const spinControl = new SpinControl();
		await spinControl.load();

		this.stage.addChild(
			environment.container,
			reels.container,
			foreground.container,
			controlPanel.container
		);
	}

	destroy() {
		this.app.destroy(true, { children: true });
	}
}
