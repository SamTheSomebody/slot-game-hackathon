import { DISPLAY } from '$lib/config/display';
import { Container, Graphics, Text } from 'pixi.js';
import { CONTROL_PANEL_HEIGHT } from '$lib/config/ui';
import { balanceState } from '$lib/stores/betState';

export class BalancePanel {
	container: Container;
	amountText: Text;
	unsubscribe: () => void;
	private width: number;

	constructor() {
		this.container = new Container();
		this.width = DISPLAY.width * 0.15;
		const x = CONTROL_PANEL_HEIGHT + 15;
		this.container.position.set(x, 0);

		this.amountText = new Text({
			style: {
				fontSize: 24,
				fill: 0xffffff,
				stroke: 0xffffff
			}
		});

		this.unsubscribe = balanceState.subscribe((state) => {
			this.amountText.text = `$${state.currentBalance.toFixed(2)}`;
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
		const text = new Text({
			text: 'BALANCE',
			style: {
				fontSize: 16,
				fill: 0xffffff
			}
		});
		text.position.set(x, 12);
		this.amountText.position.set(x, 32);
		this.container.addChild(graphic, leftBorder, rightBorder, text, this.amountText);
	}

	destory() {
		this.unsubscribe?.();
	}
}
