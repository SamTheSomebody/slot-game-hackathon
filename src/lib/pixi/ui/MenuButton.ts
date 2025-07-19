import {
	BUTTON_WIDTH,
	CONTROL_PANEL_HEIGHT,
	ICON_SIZE,
	MENU_ICON_URL,
	PANEL_ROUNDING
} from '$lib/config/ui/ui';
import { Assets, Container, Graphics, Sprite } from 'pixi.js';

export class MenuButton {
	container: Container;
	private onClick: () => void;

	constructor(onClick: () => void) {
		this.onClick = onClick;
		this.container = new Container();
	}

	async load() {
		const bg = new Graphics()
			.roundRect(0, 0, BUTTON_WIDTH, CONTROL_PANEL_HEIGHT, PANEL_ROUNDING)
			.fill(0x000000);
		bg.interactive = true;
		bg.cursor = 'pointer';
		bg.on('pointerdown', () => {
			this.onClick();
		});

		const texture = await Assets.load(MENU_ICON_URL);
		const sprite = new Sprite(texture);
		sprite.x = sprite.width / 2;
		sprite.y = sprite.height / 4;

		this.container.addChild(bg);
		this.container.addChild(sprite);
	}
}
