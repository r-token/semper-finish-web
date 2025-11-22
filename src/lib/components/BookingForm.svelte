<script>
	import { enhance } from '$app/forms';
	import { base } from '$app/paths';
	import { fade } from 'svelte/transition';
	import Field from '$lib/components/Field.svelte';
	import Grid from '$lib/components/Grid.svelte';
	import Card from '$lib/components/Card.svelte';
	import Prose from '$lib/components/Prose.svelte';

	let { form, csrfToken } = $props();
	let successMessage = $state('');
	let isSubmitting = $state(false);
	let formKey = $state('init');
	// Timestamp captured at render to power an anti-bot time trap
	let renderTs = Date.now();

	$effect(() => {
		if (!successMessage) return;
		const t = setTimeout(() => {
			successMessage = '';
		}, 5000);
		return () => clearTimeout(t);
	});

	const inputClass = 'mt-1 w-full rounded-md border border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-blue focus:border-blue dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:ring-yellow';
</script>

<Card elevated>
	<Prose>
		<h2>Book With Us</h2>
		<p>Tell us a little about your project and how we can help. We’ll follow up quickly.</p>
	</Prose>

	{#key formKey}
	<form method="POST" action={base + '/?/submitBooking'} use:enhance={({ formElement }) => {
		isSubmitting = true;
		successMessage = '';
		form = { ...form, error: undefined }; // reset any form errors
		
		return async ({ result, update }) => {
			try {
				await update(result);
				if (result.type === 'success') {
					successMessage = 'Thanks! We received your request and will be in touch shortly.';
					formElement.reset();
					formKey = Math.random().toString(36).slice(2);
				}
			} finally {
				isSubmitting = false;
			}
		};
		}} class="mt-6 space-y-4">
			<!-- Anti-bot fields: honeypot, time-trap, and CSRF token -->
			<input type="text" name="referrer" tabindex="-1" autocomplete="off" value="" aria-hidden="true"
				style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;" />
			<input type="hidden" name="form_ts" value={renderTs} />
			<input type="hidden" name="csrf_token" value={csrfToken} />
			<Grid class="sm:grid-cols-2">
				<Field label="First Name">
					<input
						name="firstName"
						value={form?.firstName ?? ''}
						placeholder="First Name"
						required
						class={inputClass}
					/>
				</Field>
				<Field label="Last Name">
					<input
						name="lastName"
						value={form?.lastName ?? ''}
						placeholder="Last Name"
						required
						class={inputClass}
					/>
				</Field>
			</Grid>

			<Field label="Email Address">
				<input
					type="email"
					name="email"
					value={form?.email ?? ''}
					placeholder="Email Address"
					required
					class={inputClass}
				/>
			</Field>

			<Field label="Phone Number">
				<input
					type="tel"
					name="phone"
					value={form?.phone ?? ''}
					placeholder="Phone Number"
					required
					class={inputClass}
				/>
			</Field>

			<Field label="Home Address">
				<input
					name="address"
					value={form?.address ?? ''}
					placeholder="Home Address"
					required
					class={inputClass}
				/>
			</Field>

			<Field label="Project Details" hint="Describe the work you're interested in.">
				<textarea
					name="details"
					rows="5"
					placeholder="Tell us what you need..."
					required
					class={`${inputClass} resize-y min-h-24`}
				></textarea>
			</Field>

			<button type="submit" class="bg-primary text-white rounded-md px-4 py-2 shadow-sm hover:brightness-95 transition disabled:opacity-60" disabled={isSubmitting}>
				{#if isSubmitting}
					Submitting...
				{:else}
					Submit Booking Request
				{/if}
			</button> 
		</form>
	{/key}
	
	{#if form?.error}
		<p class="text-sm mt-6 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded p-3" role="alert" aria-live="polite">{form.error}</p>
	{/if}
	{#if successMessage}
		<p class="text-sm mt-6 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded p-3" role="status" aria-live="polite" in:fade={{ duration: 150 }} out:fade={{ duration: 250 }}>{successMessage}</p>
	{/if}
</Card>
