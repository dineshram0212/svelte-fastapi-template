<script lang="ts" module>
	import { Grid3x3 } from "@hugeicons/core-free-icons";

	// This is sample data.
	const data = {
		user: {
			name: "shadcn",
			email: "m@example.com",
			avatar: "/avatars/shadcn.jpg",
		},
		teams: [
			{
				name: "Acme Inc",
				plan: "Enterprise",
			},
			{
				name: "Acme Corp.",
				plan: "Startup",
			},
			{
				name: "Evil Corp.",
				plan: "Free",
			},
		],
		navMain: [
			{
				title: "Playground",
				url: "#",
				icon: Grid3x3,
				isActive: true,
			},
			{
				title: "Models",
				url: "#",
				icon: Grid3x3,
			},
			{
				title: "Documentation",
				url: "#",
				icon: Grid3x3,
			},
			{
				title: "Settings",
				url: "#",
				icon: Grid3x3,
			},
		],
	};
</script>

<script lang="ts">
	import NavMain from "./nav-main.svelte";
	import NavUser from "./nav-user.svelte";
	import TeamSwitcher from "./team-switcher.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import type { ComponentProps } from "svelte";
	import { userStore } from "$lib/stores/user.svelte";

	let {
		ref = $bindable(null),
		collapsible = "icon",
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();

	const currentUser = $derived(userStore.user ?? data.user);
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
	<Sidebar.Header>
		<TeamSwitcher teams={data.teams} />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={currentUser} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
