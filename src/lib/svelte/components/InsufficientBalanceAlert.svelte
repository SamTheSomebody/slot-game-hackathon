<script lang="ts">
	export let visible: boolean;
	export let close: () => void;
</script>

{#if visible}
	<div class="container" on:click={close}>
		<div class="pop-up" on:click|stopPropagation>
			<h2>Insufficient Balance</h2>
			<p>You do not have enough balance to spin. Please adjust your bet or add more credits.</p>
			<button on:click={close}>Close</button>
		</div>
	</div>
{/if}

<style>
	.container {
    font-family: sans-serif;
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2000;
	}
	.pop-up {
		background: #222;
		color: #fff;
		padding: 2rem 2.5rem;
		border-radius: 12px;
		box-shadow: 0 4px 24px rgba(0,0,0,0.3);
		max-width: 90vw;
		text-align: center;
	}
	button {
		margin-top: 1.5rem;
		padding: 0.5rem 1.5rem;
		font-size: 1rem;
		border: none;
		border-radius: 6px;
		background: #fff;
		color: #222;
		cursor: pointer;
		transition: background 0.2s;
	}
	button:hover {
		background: #eee;
	}
</style> 