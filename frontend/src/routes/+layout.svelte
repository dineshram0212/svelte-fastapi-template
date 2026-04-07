<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { authClient } from '$lib/utils/auth';

	let { children } = $props();

	onMount(async () => {
		// Attempt to fetch current user on load if token exists
		if (localStorage.getItem('auth_token')) {
			await authClient();
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
