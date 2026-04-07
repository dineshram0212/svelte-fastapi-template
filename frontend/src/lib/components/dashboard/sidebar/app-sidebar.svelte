<script lang="ts">
	import { user, orgs, navMain } from "$lib/constants/sidebar";
	import NavMain from "./nav-main.svelte";
	import NavUser from "./nav-user.svelte";
	import TeamSwitcher from "./org-switcher.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import type { ComponentProps } from "svelte";
	import { userStore } from "$lib/stores/user.svelte";

	let {
		ref = $bindable(null),
		collapsible = "icon",
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();

	const currentUser = $derived(userStore.user ?? user);
</script>

<Sidebar.Root bind:ref variant="floating" {...restProps}>
	<Sidebar.Header>
		<TeamSwitcher orgs={orgs} />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={navMain} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={currentUser} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
