import { Graphics, Container } from 'pixi.js';

export class DebugLine {
	private graphics: Graphics;
	private container: Container;

	constructor() {
		this.graphics = new Graphics();
		this.container = new Container();
		this.container.addChild(this.graphics);
	}

	drawLine(x1: number, y1: number, x2: number, y2: number, color = 0xff0000, width = 2) {
		this.graphics.lineStyle(width);
		this.graphics.fill(color);
		this.graphics.moveTo(x1, y1);
		this.graphics.lineTo(x2, y2);
	}

	clear() {
		this.graphics.clear();
	}

	get view(): Container {
		return this.container;
	}
}
