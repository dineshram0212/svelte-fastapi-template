<script lang="ts">
	import { HugeiconsIcon } from "@hugeicons/svelte";
	import { ViewIcon, ViewOffIcon, ArrowLeft01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
	import { goto } from "$app/navigation";
	import { authClient } from "$lib/utils/auth";

	let newPassword = $state("");
	let loading = $state(false);
	let error = $state<string | null>(null);
	let showPassword = $state(false);


	async function handleSubmit() {
		loading = true;
		error = null;

		const { error: resetError } = await authClient.resetPassword({
			newPassword,
		});

		if (resetError) {
			error = resetError.message ?? "An error occurred";
			loading = false;
		} else {
			goto("/login");
		}
	}
</script>

<div class="relative space-y-7 pb-7">
	<div class="space-y-2">
		<h1 class="text-3xl tracking-tight text-foreground">New Password</h1>
		<p class="text-[13px] text-muted-foreground leading-relaxed">
			Please enter your new password below to regain access to your account.
		</p>
	</div>

	<form
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
		class="space-y-6"
	>
		<div>
			<label
				for="password"
				class="text-[13px] font-medium text-muted-foreground"
				>New Password</label
			>
			<div
				class="relative mt-1 flex items-center border-b border-border pb-1.5 transition-colors focus-within:border-accent-primary"
			>
				<input
					id="password"
					type={showPassword ? "text" : "password"}
					bind:value={newPassword}
					placeholder="Enter new password"
					class="flex-1 border-none bg-transparent px-3 py-1.5 text-[13px] text-foreground outline-none focus:ring-0 placeholder:text-muted-foreground"
					disabled={loading}
					required
				/>
				<button
					type="button"
					onclick={() => (showPassword = !showPassword)}
					class="mr-1 cursor-pointer text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
					disabled={loading}
					aria-label={showPassword ? "Hide password" : "Show password"}
				>
					{#if showPassword}
						<HugeiconsIcon icon={ViewOffIcon} size={16} />
					{:else}
						<HugeiconsIcon icon={ViewIcon} size={16} />
					{/if}
				</button>
			</div>
		</div>

		{#if error}
			<p class="text-xs text-red-600">{error}</p>
		{/if}

		<button
			type="submit"
			disabled={loading}
			class="flex w-full cursor-pointer items-center justify-center rounded-full bg-foreground px-4 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{#if loading}<HugeiconsIcon
					icon={Loading03Icon}
					size={18}
					class="mr-2 animate-spin"
				/>{/if}
			Update Password
		</button>
	</form>

	<div class="flex items-center justify-center pt-2">
		<a
			href="/login"
			class="group flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
		>
			<HugeiconsIcon
				icon={ArrowLeft01Icon}
				size={14}
				class="transition-transform group-hover:-translate-x-1"
			/>
			Back to sign in
		</a>
	</div>
</div>
