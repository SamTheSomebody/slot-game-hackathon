import { Container, Graphics, Text } from 'pixi.js';

export class SpinButton {
	container: Container;
	private onClick: () => void;

	constructor(onClick: () => void) {
		this.onClick = onClick;
		this.container = new Container();
		this.createButton();
	}

	private createButton() {
		const width = 150;
		const height = 60;

		const bg = new Graphics().roundRect(0, 0, width, height, 10).fill(0xffcc00);
		bg.interactive = true;
		bg.cursor = 'pointer';
		bg.on('pointerdown', () => {
			this.onClick();
		});

		const label = new Text({
			text: 'SPIN',
			style: {
				fontFamily: 'Arial',
				fontSize: 28,
				fontWeight: 'bold',
				fill: '#222'
			}
		});
		label.anchor.set(0.5);
		label.x = width / 2;
		label.y = height / 2;

		this.container.addChild(bg);
		this.container.addChild(label);
	}

	set position(pos: { x: number; y: number }) {
		this.container.position.set(pos.x, pos.y);
	}

	addTo(stage: Container) {
		stage.addChild(this.container);
	}
}
