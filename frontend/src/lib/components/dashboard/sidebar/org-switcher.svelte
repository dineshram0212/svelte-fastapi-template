<script lang="ts">
	import { HugeiconsIcon } from "@hugeicons/svelte";
	import { Plus, ChevronDoubleCloseIcon } from "@hugeicons/core-free-icons";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";

	// This should be `Component` after @lucide/svelte updates types
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let { orgs }: { orgs: { name: string; plan: string }[] } = $props();

	// svelte-ignore state_referenced_locally
	let activeOrg = $state(orgs[0]);
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<div class="grid flex-1 text-start text-sm leading-tight">
							<span class="truncate font-medium">
								{activeOrg.name}
							</span>
							<span class="truncate text-xs">{activeOrg.plan}</span>
						</div>
						<HugeiconsIcon icon={ChevronDoubleCloseIcon} class="ms-auto rotate-90" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56"
				align="start"
				side="bottom"
				sideOffset={4}
			>
				<DropdownMenu.Label class="text-muted-foreground text-xs"
					>Organizations</DropdownMenu.Label
				>
				{#each orgs as org (org.name)}
					<DropdownMenu.Item
						onSelect={() => (activeOrg = org)}
						class="gap-2 p-2"
					>
						{org.name}
					</DropdownMenu.Item>
				{/each}
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="gap-2 p-2">
					<div
						class="flex size-6 items-center justify-center rounded-md border bg-transparent"
					>
						<HugeiconsIcon icon={Plus} class="size-4" />
					</div>
					<div class="text-muted-foreground font-medium">New Organization</div>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
