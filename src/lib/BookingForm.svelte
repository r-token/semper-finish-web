<script>
	import { enhance } from '$app/forms';
	import Field from '$lib/components/Field.svelte';
	import Grid from '$lib/components/Grid.svelte';
	import Card from '$lib/components/Card.svelte';
	import Prose from '$lib/components/Prose.svelte';

	let { form } = $props();

	const inputClass = 'mt-1 w-full rounded-md border border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-blue focus:border-blue dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:ring-yellow';
</script>

<Card elevated>
	<Prose>
		<h2>Book With Us</h2>
		<p>Tell us a little about your project and how we can help. We’ll follow up quickly.</p>
	</Prose>

	{#if form?.error}
		<p class="text-sm text-red-600 dark:text-red-400">{form.error}</p>
	{/if}

	<form method="POST" use:enhance class="mt-6 space-y-4">
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
					class={`${inputClass} resize-y min-h-24`}
				></textarea>
			</Field>

			<button type="submit" class="bg-primary text-white rounded-md px-4 py-2 shadow-sm hover:brightness-95 transition">Submit</button>
		</form>
</Card>
