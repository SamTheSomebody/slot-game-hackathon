import { DISPLAY } from '$lib/config/display';
import { Container, Graphics, Text } from 'pixi.js';
import { CircleButton } from '../ui/CircleButton';
import {
	ADD_ICON_URL,
	BUTTON_WIDTH,
	CONTROL_PANEL_HEIGHT,
	PANEL_ROUNDING,
	REMOVE_ICON_URL
} from '$lib/config/ui/ui';
import { DecreaseBet, betState, IncreaseBet } from '$lib/stores/betState';

export class BetPanel {
	container: Container;
	amountText: Text;
	unsubscribe: () => void;
	private width: number;

	constructor() {
		this.container = new Container();
		this.width = DISPLAY.width * 0.12;
		const x = DISPLAY.width * 0.55 - this.width + PANEL_ROUNDING;
		this.container.position.set(x, 0);

		this.amountText = new Text({
			style: {
				fontSize: 24,
				fill: 0xffffff,
				stroke: 0xffffff
			}
		});

		this.unsubscribe = betState.subscribe((state) => {
			this.amountText.text = `$${state.currentBet.toFixed(2)}`;
		});
	}

	async load() {
		const graphic = new Graphics().rect(0, 0, this.width, CONTROL_PANEL_HEIGHT).fill(0x000000);
		const leftBorder = new Graphics()
			.rect(0, 0, 1, CONTROL_PANEL_HEIGHT)
			.fill({ color: 0xffffff, alpha: 0.5 });
		const rightBorder = new Graphics()
			.rect(this.width, 0, 1, CONTROL_PANEL_HEIGHT)
			.fill({ color: 0xffffff, alpha: 0.5 });

		const x = 15;
		const betText = new Text({
			text: 'BET',
			style: {
				fontSize: 16,
				fill: 0xffffff
			}
		});
		betText.position.set(x, 12);
		this.amountText.position.set(x, 32);

		const diameter = BUTTON_WIDTH / 8;

		const increaseButton = new CircleButton(() => IncreaseBet(), diameter);
		await increaseButton.load(ADD_ICON_URL);
		increaseButton.container.position.set(this.width - diameter - x, 7 + diameter);

		const decreaseButton = new CircleButton(() => DecreaseBet(), diameter);
		await decreaseButton.load(REMOVE_ICON_URL);
		decreaseButton.container.position.set(this.width - diameter - x, (13 + diameter) * 2);

		this.container.addChild(
			graphic,
			leftBorder,
			rightBorder,
			betText,
			this.amountText,
			decreaseButton.container,
			increaseButton.container
		);
	}

	destory() {
		this.unsubscribe?.();
	}
}
