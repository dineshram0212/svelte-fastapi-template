<script lang="ts">
	import { HugeiconsIcon } from "@hugeicons/svelte";
	import {
		ViewIcon,
		ViewOffIcon,
		Loading03Icon,
		InformationCircleIcon,
	} from "@hugeicons/core-free-icons";
	import { authClient } from "$lib/utils/auth";
	import { goto } from "$app/navigation";
	import { notify } from "$lib/stores/notifications.svelte.js";

	let email = $state("");
	let password = $state("");
	let showPassword = $state(false);
	let loading = $state(false);
	let googleLoading = $state(false);
	let error = $state<string | null>(null);

	async function login() {
		loading = true;
		error = null;
		const { error: authError } = await authClient.signIn.email({
			email,
			password,
			callbackURL: "/",
		});

		if (authError) {
			error = authError.message || "Failed to login";
			loading = false;
		} else {
			notify.info(
				"New Sign In",
				"Your account was just signed into on a new device or session.",
			);
			goto("/");
		}
	}

	async function loginWithGoogle() {
		googleLoading = true;
		error = null;
		const { error: socialError } = await authClient.signIn.social({
			provider: "google",
			callbackURL: "/",
		});

		if (socialError) {
			const message = socialError.message || "Failed to continue with Google";
			error = message;
			notify.alert("Google Sign In Failed", message);
		}

		googleLoading = false;
	}
</script>

<div class="relative space-y-7 pb-7">
	<div class="space-y-2">
		<h1 class="text-3xl tracking-tight text-foreground">Welcome back</h1>
	</div>

	<button
		type="button"
		onclick={loginWithGoogle}
		disabled={loading || googleLoading}
		class="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-background/60 disabled:cursor-not-allowed disabled:opacity-60"
	>
		<svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true">
			<path
				fill="#4285F4"
				d="M21.8 12.22c0-.74-.07-1.45-.2-2.13H12v4.03h5.49a4.71 4.71 0 0 1-2.04 3.09v2.56h3.3c1.94-1.79 3.05-4.43 3.05-7.55Z"
			/>
			<path
				fill="#34A853"
				d="M12 22c2.76 0 5.08-.91 6.77-2.48l-3.3-2.56c-.92.62-2.09.99-3.47.99-2.67 0-4.94-1.8-5.74-4.22H2.84v2.65A10 10 0 0 0 12 22Z"
			/>
			<path
				fill="#FBBC05"
				d="M6.26 13.73a6.03 6.03 0 0 1 0-3.45V7.63H2.84a10 10 0 0 0 0 8.75l3.42-2.65Z"
			/>
			<path
				fill="#EA4335"
				d="M12 6.05c1.5 0 2.85.51 3.91 1.52l2.93-2.93C17.07 2.99 14.75 2 12 2a10 10 0 0 0-9.16 5.63l3.42 2.65C7.06 7.85 9.33 6.05 12 6.05Z"
			/>
		</svg>
		{#if googleLoading}
			<HugeiconsIcon icon={Loading03Icon} size={16} class="animate-spin" />
			Redirecting...
		{:else}
			Login with Google
		{/if}
	</button>

	<div class="relative text-center">
		<div
			class="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border"
		></div>
		<span class="relative bg-muted px-3 text-xs text-muted-foreground">Or</span>
	</div>

	<form
		onsubmit={(e) => {
			e.preventDefault();
			login();
		}}
		class="space-y-5"
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
					autocomplete="email"
					bind:value={email}
					placeholder="name@example.com"
					class="flex-1 border-none bg-transparent px-3 py-1.5 text-[13px] text-foreground outline-none focus:ring-0 placeholder:text-muted-foreground"
					disabled={loading || googleLoading}
					required
				/>
			</div>
		</div>

		<div>
			<div class="flex items-center justify-between">
				<label
					for="password"
					class="text-[13px] font-medium text-muted-foreground">Password</label
				>
				<a
					href="/forgot-password"
					class="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
					>Forgot password?</a
				>
			</div>
			<div
				class="relative mt-1 flex items-center border-b border-border pb-1.5 transition-colors focus-within:border-accent-primary"
			>
				<input
					id="password"
					type={showPassword ? "text" : "password"}
					autocomplete="current-password"
					bind:value={password}
					placeholder="Enter your password"
					class="flex-1 border-none bg-transparent px-3 py-1.5 text-[13px] text-foreground outline-none focus:ring-0 placeholder:text-muted-foreground"
					disabled={loading || googleLoading}
					required
				/>
				<button
					type="button"
					onclick={() => (showPassword = !showPassword)}
					class="mr-1 cursor-pointer text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
					disabled={loading || googleLoading}
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

		<button
			type="submit"
			disabled={loading || googleLoading}
			class="flex w-full cursor-pointer items-center justify-center rounded-full bg-foreground px-4 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{#if loading}
				<HugeiconsIcon
					icon={Loading03Icon}
					size={18}
					class="mr-2 animate-spin"
				/>
				Signing in...
			{:else}
				Sign in
			{/if}
		</button>
	</form>

	<div
		class="flex w-full items-center justify-center gap-1 text-[13px] text-muted-foreground"
	>
		Don't have an account? <a
			href="/signup"
			class="hover:text-foreground underline underline-offset-2">Create an account</a
		>
	</div>

	<div
		class="pointer-events-none absolute right-0 bottom-0 left-0 flex h-4 items-center justify-center gap-1 overflow-hidden text-center text-xs text-red-600 transition-opacity"
		class:opacity-0={!error}
	>
		<HugeiconsIcon icon={InformationCircleIcon} size={14} />
		<span class="truncate">{error ?? ""}</span>
	</div>
</div>
