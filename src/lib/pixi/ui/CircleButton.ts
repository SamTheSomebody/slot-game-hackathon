import { BUTTON_ICON_PADDING } from '$lib/config/ui/ui';
import { Assets, Container, Graphics, Sprite } from 'pixi.js';

export class CircleButton {
	container: Container;
	innerContainer: Container;
	private onClick: () => void;
	private diameter: number;

	constructor(onClick: () => void, diameter: number, invertColour: boolean = false) {
		this.onClick = onClick;
		this.diameter = diameter;
		this.container = new Container();
		this.innerContainer = new Container();

		const bg = new Graphics()
			.circle(0, 0, diameter)
			.fill(invertColour ? 0xffffff : 0x000000)
			.stroke({ color: invertColour ? 0x000000 : 0xffffff, width: 2 });
		bg.interactive = true;
		bg.cursor = 'pointer';
		bg.on('pointerdown', () => {
			this.onClick();
		});
		bg.on('pointerover', () => {
			this.innerContainer.scale.set(1.2);
		});
		bg.on('pointerout', () => {
			this.innerContainer.scale.set(1);
		});

		this.container.addChild(bg, this.innerContainer);
	}

	async load(iconURL: string) {
		const texture = await Assets.load(iconURL);
		const sprite = new Sprite(texture);
		sprite.setSize(this.diameter - BUTTON_ICON_PADDING);
		sprite.position.set(-sprite.width / 2);
		this.innerContainer.addChild(sprite);
	}
}
