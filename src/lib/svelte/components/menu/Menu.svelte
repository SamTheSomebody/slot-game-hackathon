<script lang="ts">
	import { PAYTABLE } from '$lib/config/paytable';
	import { PAYLINES } from '$lib/config/paylines';
	import PaytableSymbol from './PaytableSymbol.svelte';
	import Payline from './Payline.svelte';
	import { RARITY_VALUES, SYMBOLS, type Symbol, type SymbolRarity } from '$lib/config/symbols';

	const symbolsByRarity: Record<SymbolRarity, { symbol: Symbol; id: number }[]> = {
		common: [],
		uncommon: [],
		rare: [],
		bonus: []
	};

	for (const [id, symbol] of Object.entries(SYMBOLS)) {
		symbolsByRarity[symbol.rarity].push({ symbol, id: Number(id) });
	}
</script>

<div class="menu-container">
	<h2>Payout Table</h2>

	<div class="paytable-grid">
		{#each Object.values(PAYTABLE) as table (table.name)}
			<div
				class="rarity-title"
				style="color: #{RARITY_VALUES[table.name].color.toString(16).padStart(6, '0')}"
			>
				{table.name}
			</div>
			<div class="symbols-wrapper">
				{#each symbolsByRarity[table.name] as symbol (symbol.id)}
					<PaytableSymbol symbolID={symbol.id} payouts={table.payouts} />
				{/each}
			</div>
		{/each}
	</div>
	<hr style="margin: 1rem; border: none; height: 1px; background-color: #555555" />
	<h2>Paylines</h2>
	<div class="paylines-container">
		{#each PAYLINES as line, index (index)}
			<Payline {line} {index} />
		{/each}
	</div>
</div>

<style>
	.menu-container {
		font-family: sans-serif;
		max-width: 850px;
		color: #ffffff;
		background-color: rgba(0, 0, 0, 0.8);
		border-radius: 12px;
		padding: 1rem;
		padding-top: 0.1rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	h2 {
		text-align: center;
		text-transform: uppercase;
	}

	.rarity-title {
		font-weight: 700;
		text-transform: capitalize;
		font-size: 1.1rem;
		text-align: center;
		width: 100%;
		padding: 0.5rem;
	}

	.symbols-wrapper {
		display: flex;
		flex-wrap: wrap;
		flex-direction: rows;
		justify-content: center;
		max-width: 100%;
		gap: 1rem;
	}

	.paylines-container {
		display: flex;
		flex-wrap: wrap;
		flex-direction: rows;
		justify-content: center;
		max-width: 100%;
		gap: 1rem;
	}
</style>
