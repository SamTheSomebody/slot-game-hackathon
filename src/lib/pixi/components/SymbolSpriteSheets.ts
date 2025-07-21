import { SYMBOLS, SYMBOLS_SPRITESHEET_URL } from '$lib/config/symbols';
import { Spritesheet, Texture } from 'pixi.js';
import type { Symbol } from '$lib/config/symbols';
import { loadSpriteSheets } from '../utility/loadSpriteSheets';

export class SymbolSpriteSheets {
	private spriteLookup: Record<number, Spritesheet[]> = {};

	async load() {
		for (const [key, value] of Object.entries(SYMBOLS) as [string, Symbol][]) {
			const id = Number(key);
			this.spriteLookup[id] = await loadSpriteSheets(value.name, SYMBOLS_SPRITESHEET_URL);
		}
	}

	getTextureById(symbolId: number, spriteId: number): Texture | undefined {
		const textureName = `${SYMBOLS[symbolId].name}_${spriteId}.png`;
		const sheets = this.spriteLookup[symbolId];
		if (!sheets) {
			return undefined;
		}
		for (const sheet of sheets) {
			if (textureName in sheet.textures) {
				return sheet.textures[textureName];
			}
		}
		console.log(`No texture found for ${symbolId}, ${spriteId}`);
		return undefined;
	}
}
