import type { Sprite } from 'pixi.js';

export function fitSpriteToSquare(sprite: Sprite, squareSize: number) {
	const texWidth = sprite.texture.width;
	const texHeight = sprite.texture.height;
	if (texWidth === 0 || texHeight === 0) {
		return;
	}
	const scale = squareSize / Math.max(texWidth, texHeight);
	sprite.scale.set(scale);
	sprite.anchor.set(0.5);
	sprite.x = squareSize / 2;
	sprite.y = squareSize / 2;
}
