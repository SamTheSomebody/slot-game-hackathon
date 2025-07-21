import type { SymbolRarity } from './symbols';

export interface SymbolPaytable {
	name: SymbolRarity;
	payouts: number[];
	appearanceChance: number;
}

export const PAYTABLE: Record<SymbolRarity, SymbolPaytable> = {
	common: {
		name: 'common',
		payouts: [0, 0, 0, 0.1, 0.2, 0.6],
		appearanceChance: 0.5
	},
	uncommon: {
		name: 'uncommon',
		payouts: [0, 0, 0, 1, 2, 3],
		appearanceChance: 0.3
	},
	rare: {
		name: 'rare',
		payouts: [0, 0, 0, 2.5, 5, 10],
		appearanceChance: 0.15
	},
	bonus: {
		name: 'bonus',
		payouts: [0, 0, 40, 40, 40, 40],
		appearanceChance: 0.05
	}
};
