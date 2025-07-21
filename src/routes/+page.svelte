<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { App } from '$lib/pixi/components/App';
	import { DISPLAY } from '$lib/config/display';
	import { menuRequested } from '$lib/stores/gameState';
	import Menu from '$lib/svelte/components/menu/Menu.svelte';
	import { fade, scale } from 'svelte/transition';

	let container: HTMLDivElement;
	let app: App;

	onMount(async () => {
		app = new App();
		await app.init(container);
	});

	onDestroy(() => {
		app?.destroy();
	});
</script>

<div class="game-container" style="width: {DISPLAY.width}px; height: {DISPLAY.height}px;">
	<div bind:this={container}></div>
	{#if $menuRequested}
		<btn
			role="menu"
			tabindex="0"
			class="menu-overlay"
			on:keydown={() => menuRequested.set(false)}
			on:click={() => menuRequested.set(false)}
			in:fade={{ duration: 250 }}
			out:fade={{ duration: 200 }}
		>
			<div in:scale={{ duration: 300, start: 0.8 }} out:scale={{ duration: 200, start: 1 }}>
				<Menu />
			</div>
		</btn>
	{/if}
</div>

<style>
	.game-container {
		position: relative;
	}

	.menu-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.2);
		backdrop-filter: blur(0px);
		animation: blur-in 250ms forwards;
		z-index: 100;
	}

	.menu-overlay:leave {
		animation: blur-out 200ms forwards;
	}

	@keyframes blur-in {
		from {
			backdrop-filter: blur(0px);
		}
		to {
			backdrop-filter: blur(10px);
		}
	}

	@keyframes blur-out {
		from {
			backdrop-filter: blur(10px);
		}
		to {
			backdrop-filter: blur(0px);
		}
	}
</style>
