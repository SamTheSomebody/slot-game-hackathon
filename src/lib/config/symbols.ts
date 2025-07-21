export type SymbolRarity = 'common' | 'uncommon' | 'rare' | 'bonus';
export type Symbol = { name: string; rarity: SymbolRarity };

export const SYMBOLS: Record<number, Symbol> = {
	0: { name: 'cat', rarity: 'common' },
	1: { name: 'pig', rarity: 'common' },
	2: { name: 'rabbit', rarity: 'common' },

	3: { name: 'owl', rarity: 'uncommon' },
	4: { name: 'lizard', rarity: 'uncommon' },
	5: { name: 'sheep', rarity: 'uncommon' },

	6: { name: 'octopus', rarity: 'rare' },
	7: { name: 'spider', rarity: 'rare' },
	8: { name: 'unicorn', rarity: 'rare' },

	9: { name: 'dragon', rarity: 'bonus' },
	10: { name: 'rainbow', rarity: 'bonus' }
};

export const SYMBOLS_SPRITESHEET_URL = '/assets/symbols';

export const RARITY_VALUES: Record<SymbolRarity, { color: number; intensity: number }> = {
	common: { color: 0xffffff, intensity: 1 },
	uncommon: { color: 0x00ffff, intensity: 1.25 },
	rare: { color: 0xffff00, intensity: 1.5 },
	bonus: { color: 0xff00ff, intensity: 1.75 }
};
