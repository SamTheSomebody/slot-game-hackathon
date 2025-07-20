import { DISPLAY } from '$lib/config/display';
import {
	AUTO_ICON_URL,
	BOLT_ICON_URL,
	BUTTON_WIDTH,
	CONTROL_PANEL_HEIGHT,
	PANEL_ROUNDING,
	SPIN_ICON_URL
} from '$lib/config/ui/ui';
import { Container, Graphics } from 'pixi.js';
import { CircleButton } from '../ui/CircleButton';
import { spinRequested } from '$lib/stores/gameState';

export class SpinPanel {
	container: Container;
	private width: number;

	constructor() {
		this.container = new Container();
		this.width = DISPLAY.width * 0.2;
		const x = DISPLAY.width * 0.75 - this.width;
		this.container.position.set(x, 0);
	}

	async load() {
		const graphic = new Graphics()
			.roundRect(0, 0, this.width, CONTROL_PANEL_HEIGHT, PANEL_ROUNDING)
			.fill(0x000000);
		this.container.addChild(graphic);

		const buttons = [
			{ onclick: () => {}, diameter: BUTTON_WIDTH / 4, icon: AUTO_ICON_URL },
			{
				onclick: () => spinRequested.update(() => true),
				diameter: BUTTON_WIDTH / 2,
				icon: SPIN_ICON_URL,
				invertColour: true
			},
			{ onclick: () => {}, diameter: BUTTON_WIDTH / 4, icon: BOLT_ICON_URL }
		];

		let xPosition = 20;
		const buttonSpacing = 10;
		for (const { onclick, diameter, icon, invertColour } of buttons) {
			const button = new CircleButton(onclick, diameter, invertColour); //TODO spin reels;
			await button.load(icon);
			button.container.position.set(xPosition + diameter, CONTROL_PANEL_HEIGHT / 2);
			this.container.addChild(button.container);
			xPosition += diameter * 2 + buttonSpacing;
		}
	}
}
