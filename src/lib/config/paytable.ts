import type { SymbolRarity } from './symbols';

export interface SymbolPaytable {
	name: string;
	rarity: SymbolRarity;
	payouts: number[];
	appearanceChance: number;
}

export const PAYTABLE: SymbolPaytable[] = [
	{
		name: 'common',
		rarity: 'common',
		payouts: [0, 0, 0, 0.1, 0.2, 0.6],
		appearanceChance: 0.5
	},
	{
		name: 'uncommon',
		rarity: 'uncommon',
		payouts: [0, 0, 0, 1, 2, 3],
		appearanceChance: 0.3
	},
	{
		name: 'rare',
		rarity: 'rare',
		payouts: [0, 0, 0, 2.5, 5, 10],
		appearanceChance: 0.15
	},
	{
		name: 'bonus',
		rarity: 'bonus',
		payouts: [0, 0, 40, 40, 40, 40],
		appearanceChance: 0.05
	}
];
