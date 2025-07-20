export type Payline = number[];
export type SlotSymbol = number;
export interface MatchResult {
	payline: Payline;
	symbol: SlotSymbol;
	count: number;
	payout: number;
}
