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
