<script lang="ts">
	import { authClient } from "$lib/utils/auth";
	import { notify } from "$lib/stores/notifications.svelte.js";
	import { HugeiconsIcon } from "@hugeicons/svelte";
	import { ArrowLeft01Icon, Loading03Icon } from "@hugeicons/core-free-icons";

	let email = $state("");
	let loading = $state(false);
	let success = $state(false);
	let error = $state<string | null>(null);

	async function handleReset() {
		loading = true;
		error = null;

		const { error: resetError } = await authClient.forgetPassword({
			email,
			redirectTo: "/reset-password",
		});

		if (resetError) {
			error = resetError.message ?? "An error occurred";
		} else {
			success = true;
			notify.success(
				"Reset link sent",
				"Check your email for the password reset instructions.",
			);
		}
		loading = false;
	}
</script>

<div class="relative space-y-7 pb-7">
	<div class="space-y-2">
		<h1 class="text-3xl tracking-tight text-foreground">Reset Password</h1>
		<p class="text-[13px] text-muted-foreground leading-relaxed">
			Enter your email address and we will send you a link to reset your
			password.
		</p>
	</div>

	{#if success}
		<div class="rounded-2xl bg-green-500/10 p-6 text-center">
			<p class="text-sm font-medium text-green-600">
				Check your email for a reset link!
			</p>
			<button
				onclick={() => (success = false)}
				class="mt-4 text-xs font-semibold text-green-700 hover:underline"
			>
				Didn't get the email? Try again
			</button>
		</div>
	{:else}
		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleReset();
			}}
			class="space-y-6"
		>
			<div>
				<label for="email" class="text-[13px] font-medium text-muted-foreground"
					>Email</label
				>
				<div
					class="relative mt-1 flex items-center border-b border-border pb-1.5 transition-colors focus-within:border-accent-primary"
				>
					<input
						id="email"
						type="email"
						bind:value={email}
						placeholder="name@example.com"
						class="flex-1 border-none bg-transparent px-3 py-1.5 text-[13px] text-foreground outline-none focus:ring-0 placeholder:text-muted-foreground"
						disabled={loading}
						required
					/>
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
						size={16}
						class="animate-spin"
					/>{/if}
				Send Reset Link
			</button>
		</form>
	{/if}

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
