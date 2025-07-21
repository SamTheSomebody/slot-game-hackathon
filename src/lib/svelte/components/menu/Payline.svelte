<script lang="ts">
	export let line: number[];
	export let index: number;
</script>

<div class="root">
	<strong>{index + 1}</strong>
	<div class="grid">
		{#each Array(3) as _, rowIndex}
			{#each Array(5) as _, colIndex}
				<div class="square" class:active={line[colIndex] === rowIndex}></div>
			{/each}
		{/each}
	</div>
</div>

<style>
	.root {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(5, 10px);
		grid-template-rows: repeat(3, 10px);
		gap: 1px;
		margin-top: 0.25rem;
	}
	.square {
		width: 10px;
		height: 10px;
		background-color: #555;
		border-radius: 3px;
	}
	.square.active {
		background-color: white;
	}
</style>
