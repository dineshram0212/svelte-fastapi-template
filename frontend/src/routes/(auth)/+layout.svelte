<script lang="ts">
	import { fly } from 'svelte/transition';
	import { page } from '$app/state';
	import logo from '$lib/assets/brand/logo.png';
	import coverImage from '$lib/assets/brand/auth-cover.jpg';

	let { children } = $props();
</script>

<div class="min-h-screen bg-background lg:grid lg:grid-cols-2">
	<section class="relative hidden h-screen overflow-hidden lg:block select-none">
		<div
			class="absolute inset-0 z-10 pointer-events-none bg-gradient-to-br from-black/20 to-transparent"
		></div>
		<a
			href="/"
			class="absolute top-10 left-10 z-20 flex items-center gap-2 p-1 transition-opacity hover:opacity-80"
		>
			<img src={logo} alt="mekamstore logo" class="h-10" fetchpriority="high" loading="eager" />
			<span class="font-garet text-2xl tracking-tight text-white">Brandname</span>
		</a>
		<img
			src={coverImage}
			alt="Authentication background"
			class="h-full w-full object-cover contrast-[1.1]"
		/>
	</section>
	<section class="flex min-h-screen flex-col bg-muted px-6 py-6 sm:px-10 lg:px-14">
		<a href="/" class="flex items-center gap-2 self-start p-1 transition-opacity hover:opacity-80 lg:hidden">
			<img src={logo} alt="mekamstore logo" class="h-10" fetchpriority="high" loading="eager" />
			<span class="font-garet text-2xl tracking-tight text-foreground">Brandname</span>
		</a>

		<div class="grid flex-1 place-items-center overflow-hidden h-full w-full">
			{#key page.url.pathname}
				<div
					in:fly={{ x: 40, duration: 300, delay: 100, opacity: 0 }}
					class="col-start-1 row-start-1 w-full max-w-sm px-6"
				>
					{@render children?.()}
				</div>
			{/key}
		</div>
	</section>
</div>

<style>
	:global(body) {
		overflow-x: hidden;
	}
</style>
