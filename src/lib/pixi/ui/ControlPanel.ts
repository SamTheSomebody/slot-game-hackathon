import { DISPLAY } from '$lib/config/display';
import { CONTROL_PANEL_HEIGHT, PANEL_ROUNDING } from '$lib/config/ui/ui';
import { Color, Container, FillGradient, Graphics } from 'pixi.js';
import { SpinButton } from '../ui/SpinButton';
import { MenuButton } from '../ui/MenuButton';

export class ControlPanel {
	container: Container;

	constructor() {
		this.container = new Container({
			width: DISPLAY.width
		});
	}

	async load() {
		this.createBackground();
		await this.addMenuButton();
		await this.addSpinButton();
	}

	private createBackground() {
		const gradient = new FillGradient({
			type: 'linear',
			start: { x: 0, y: 1 },
			end: { x: 0, y: 0 },
			colorStops: [
				{ offset: 0, color: new Color([0, 0, 0, 1]) },
				{ offset: 1, color: new Color([0, 0, 0, 0.25]) }
			]
		});
		const graphic = new Graphics()
			.roundRect(
				(DISPLAY.width * 0.25) / 2,
				DISPLAY.height - CONTROL_PANEL_HEIGHT - 20,
				DISPLAY.width * 0.75,
				CONTROL_PANEL_HEIGHT,
				PANEL_ROUNDING
			)
			.fill(gradient)
			.stroke({
				color: 0x000000,
				alpha: 0.2,
				width: 2
			});
		this.container.addChild(graphic);
	}

	private async addMenuButton() {
		const menuButton = new MenuButton(() => {}); //TODO open menu
		await menuButton.load();
		menuButton.container.position.set(
			(DISPLAY.width * 0.25) / 2,
			DISPLAY.height - CONTROL_PANEL_HEIGHT - 20
		);
		this.container.addChild(menuButton.container);
	}

	private async addSpinButton() {
		const spinButton = new SpinButton(() => {}); //TODO spin reels;
		await spinButton.load();
		spinButton.container.position.set(
			DISPLAY.width * 0.75,
			DISPLAY.height - spinButton.container.height / 2 - 10
		);
		this.container.addChild(spinButton.container);
	}
}
