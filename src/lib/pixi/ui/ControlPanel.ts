import { DISPLAY } from '$lib/config/display';
import { CONTROL_PANEL_BOTTOM_PAD, CONTROL_PANEL_HEIGHT, PANEL_ROUNDING } from '$lib/config/ui/ui';
import { Color, Container, FillGradient, Graphics } from 'pixi.js';
import { SpinPanel } from '../ui/SpinPanel';
import { MenuButton } from '../ui/MenuButton';
import { BetPanel } from './BetPanel';

export class ControlPanel {
	container: Container;

	constructor() {
		this.container = new Container();
		const x = DISPLAY.width * 0.125;
		const y = DISPLAY.height - CONTROL_PANEL_HEIGHT - CONTROL_PANEL_BOTTOM_PAD;
		this.container.position.set(x, y);
	}

	async load() {
		this.createBackground();
		await this.addMenuButton();
		await this.addSpinPanel();
		await this.addBetPanel();
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
			.roundRect(0, 0, DISPLAY.width * 0.75, CONTROL_PANEL_HEIGHT, PANEL_ROUNDING)
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
		this.container.addChild(menuButton.container);
	}

	private async addSpinPanel() {
		const spinPanel = new SpinPanel();
		await spinPanel.load();
		this.container.addChild(spinPanel.container);
	}

	private async addBetPanel() {
		const panel = new BetPanel();
		await panel.load();
		this.container.addChild(panel.container);
	}
}
