import {
	AUTO_ICON_URL,
	BOLT_ICON_URL,
	BUTTON_WIDTH,
	CONTROL_PANEL_HEIGHT,
	PANEL_ROUNDING,
	SPIN_ICON_URL
} from '$lib/config/ui';
import { DISPLAY } from '$lib/config/display';
import { CircleButton } from '../ui/CircleButton';
import { setFastMode, setNoSpinDelay, spinRequested } from '$lib/stores/gameState';
import { Container, Graphics } from 'pixi.js';

export class SpinPanel {
	container: Container;
	private width: number;
	private isFastMode = false;
	private isNoSpinDelay = false;

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
			{ onclick: () => this.toggleNoSpinDelay(), diameter: BUTTON_WIDTH / 4, icon: AUTO_ICON_URL }, //TODO autospin
			{
				onclick: () => spinRequested.set(true),
				diameter: BUTTON_WIDTH / 2,
				icon: SPIN_ICON_URL,
				invertColour: true
			},
			{ onclick: () => this.toggleFastMode(), diameter: BUTTON_WIDTH / 4, icon: BOLT_ICON_URL } //TODO fast spin
		];

		let xPosition = 20;
		const buttonSpacing = 10;
		const circleButtons: CircleButton[] = [];
		for (const { onclick, diameter, icon, invertColour } of buttons) {
			const button = new CircleButton(onclick, diameter, invertColour); //TODO spin reels;
			await button.load(icon);
			button.container.position.set(xPosition + diameter, CONTROL_PANEL_HEIGHT / 2);
			this.container.addChild(button.container);
			xPosition += diameter * 2 + buttonSpacing;
			circleButtons.push(button);
		}

		setNoSpinDelay.subscribe((active) => {
			circleButtons[0].toggleActivation(active);
		});

		setFastMode.subscribe((active) => {
			circleButtons[2].toggleActivation(active);
		});
	}

	private toggleNoSpinDelay() {
		this.isNoSpinDelay = !this.isNoSpinDelay;
		setNoSpinDelay.set(this.isNoSpinDelay);
	}

	private toggleFastMode() {
		this.isFastMode = !this.isFastMode;
		setFastMode.set(this.isFastMode);
	}
}
