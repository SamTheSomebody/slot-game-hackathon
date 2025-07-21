import { Container, Graphics } from 'pixi.js';

export function DebugContainer(container: Container) {
	const debugBox = new Graphics()
		.rect(0, 0, container.width, container.height)
		.fill({ color: 0xff0000, alpha: 0.25 });
	container.addChild(debugBox);

	const pivotGraphic = new Graphics()
		.circle(container.pivot.x, container.pivot.y, 5)
		.fill({ color: 0x0000ff });
	container.addChild(pivotGraphic);
}
