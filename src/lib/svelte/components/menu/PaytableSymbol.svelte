<script lang="ts">
	import { SYMBOLS } from '$lib/config/symbols';

	export let symbolID: number;
	export let payouts: number[];

	const symbol = SYMBOLS[symbolID];
	const iconURL = `/assets/symbols/paytable_icons/${symbol.name}.png`;
</script>

<div class="entry">
	<img class="icon" src={iconURL} alt={symbol.name} />
	<div class="payouts">
		<span>3x:<b><br />{payouts[3]}</b></span>
		<span>4x:<b><br />{payouts[4]}</b></span>
		<span>5x:<b><br />{payouts[5]}</b></span>
	</div>
</div>

<style>
	.entry {
		display: inline-flex;
		align-items: center;
		gap: 1rem;
		background: #222222;
		padding: 0.5rem;
		border-radius: 0.5rem;
		color: #ffffff;
		font-family: sans-serif;
	}

	.icon {
		width: 48px;
		height: 48px;
		object-fit: contain;
	}

	.payouts {
		display: inline-flex;
		align-items: center;
		gap: 1rem;
		font-size: 0.95rem;
	}
</style>
