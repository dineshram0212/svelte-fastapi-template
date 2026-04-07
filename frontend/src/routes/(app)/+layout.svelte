<script lang="ts">
	import { page } from '$app/state';
	let { children } = $props();
</script>

<div class="relative flex min-h-screen flex-col overflow-hidden bg-background">
	<main class="relative flex-1">
		{#key page.url.pathname}
			{@render children()}
		{/key}
	</main>
</div>
