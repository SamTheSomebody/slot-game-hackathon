<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { App } from '$lib/pixi/components/App';
	import { DISPLAY } from '$lib/config/display';

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

<div bind:this={container} style="width: {DISPLAY.width}px; {DISPLAY.height}: 720px;"></div>
