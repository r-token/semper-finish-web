<script>
	import { enhance } from '$app/forms';
	import { base } from '$app/paths';
	import { fade } from 'svelte/transition';
	import Field from '$lib/components/Field.svelte';

	let { form, csrfToken, onClose = () => {} } = $props();
	let successMessage = $state('');
	let isSubmitting = $state(false);
	let formKey = $state('init');
	let renderTs = Date.now();
	let selectedOption = $state('writeOwn');
	let ownTestimonial = $state('');

	const TESTIMONIAL_OPTIONS = {
		option1: "I couldn't be happier with the work Semper Finish did on our home. From the first consultation to the final walk-through, everything was handled with care and attention to detail. They completely transformed the space, the quality of their work speaks for itself, and their professionalism made the whole process stress-free. Highly recommend them to anyone looking for painters who truly care about their craft.",
		
		option2: "I would definitely recommend Semper Finish to anyone looking for reliable, high-quality painting and/or renovation work — they made the whole process easy and stress-free.",
		
		option3: "It's incredible what a difference a fresh coat of paint can make — and Semper Finish nailed it! They took our old, tired walls and made it look completely refreshed. You can tell they put real effort into the prep and finishing details. The end result looks even better than I imagined. I'm so grateful for the care and craftsmanship they brought to this project.",
		
		option4: "Semper Finish did an amazing job on our home. The quality and professionalism were top-notch and never waivered, even when I added a couple more line items to the project halfway through! I will definitely be calling them for future projects.",
		
		option5: "Semper Finish delivered excellent results on our project. The team was punctual, respectful, and detail-oriented. You can tell they take pride in their work — the finish is flawless, and they made the entire process smooth and professional."
	};

	$effect(() => {
		if (!successMessage) return;
		const timer = setTimeout(() => {
			successMessage = '';
			onClose();
		}, 3000);
		return () => clearTimeout(timer);
	});

	const inputClass = 'mt-1 w-full rounded-md border border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-blue focus:border-blue dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:ring-yellow';
</script>

<div class="p-6">
	<img src="/logo-full-width.png" alt="Semper Finish" class="w-full max-w-md mx-auto mt-4 mb-2" />
	
	<div class="mb-6 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
		<p>Thank you for taking the time to share your experience with Semper Finish! Below are a few testimonial drafts written to capture different tones and project types. Please review each option and check the box next to the one you'd prefer, adding any edits or comments you'd like at the bottom. Or, you can choose to write your own! Then sign your approval to allow us to share your feedback publicly (website, social media, and marketing materials).</p>
	</div>

	{#key formKey}
	<form method="POST" action={base + '/?/submitTestimonial'} use:enhance={({ formElement, formData }) => {
		isSubmitting = true;
		successMessage = '';
		form = { ...form, error: undefined };

		// Add the testimonial text to form data
		if (selectedOption === 'writeOwn') {
			formData.set('selectedOption', ownTestimonial);
		} else {
			formData.set('selectedOption', TESTIMONIAL_OPTIONS[selectedOption]);
		}
		
		return async ({ result, update }) => {
			try {
				await update(result);
				if (result.type === 'success') {
					successMessage = 'Thank you! Your testimonial has been submitted successfully.';
					formElement.reset();
					formKey = Math.random().toString(36).slice(2);
					selectedOption = 'writeOwn';
					ownTestimonial = '';
				}
			} finally {
				isSubmitting = false;
			}
		};
	}} class="space-y-4">
		<!-- Anti-bot fields: honeypot, time-trap, and CSRF token -->
		<input type="text" name="referrer" tabindex="-1" autocomplete="off" value="" aria-hidden="true"
			style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;" />
		<input type="hidden" name="form_ts" value={renderTs} />
		<input type="hidden" name="csrf_token" value={csrfToken} />

		<Field label="Name" required>
			<input
				name="name"
				value={form?.name ?? ''}
				placeholder="Your Name"
				required
				class={inputClass}
			/>
		</Field>

		<Field label="Project Details" required>
			<textarea
				name="projectDetails"
				rows="3"
				placeholder="Brief description of the project"
				required
				class={`${inputClass} resize-y min-h-20`}
			>{form?.projectDetails ?? ''}</textarea>
		</Field>

		<Field label="Date of Project" required>
			<input
				name="dateOfProject"
				value={form?.dateOfProject ?? ''}
				placeholder="e.g., November 2025"
				required
				class={inputClass}
			/>
		</Field>

		<Field label="Location (optional)">
			<input
				name="location"
				value={form?.location ?? ''}
				placeholder="Address, city, or neighborhood"
				class={inputClass}
			/>
		</Field>

		<div class="pt-4 border-t border-neutral-200 dark:border-neutral-700">
			<p class="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Write your own testimonial or choose from prewritten options:<span class="text-red-600 dark:text-red-400 ml-0.5">*</span></p>
			
			<div class="space-y-3">
				<label class="flex items-start gap-3 cursor-pointer p-3 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition">
					<input
						type="radio"
						name="testimonialOption"
						value="writeOwn"
						bind:group={selectedOption}
						class="mt-1 text-blue focus:ring-blue dark:focus:ring-yellow"
					/>
					<span class="text-sm text-neutral-700 dark:text-neutral-300 flex-1">
						<strong>Write my own:</strong>
						{#if selectedOption === 'writeOwn'}
							<textarea
								bind:value={ownTestimonial}
								rows="4"
								placeholder="Write your testimonial here..."
								required={selectedOption === 'writeOwn'}
								class={`${inputClass} mt-2`}
							></textarea>
						{/if}
					</span>
				</label>

				{#each Object.entries(TESTIMONIAL_OPTIONS) as [key, text], idx}
					<label class="flex items-start gap-3 cursor-pointer p-3 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition">
						<input
							type="radio"
							name="testimonialOption"
							value={key}
							bind:group={selectedOption}
							class="mt-1 text-blue focus:ring-blue dark:focus:ring-yellow"
						/>
						<span class="text-sm text-neutral-700 dark:text-neutral-300 flex-1">
							<strong>Option {idx + 1}:</strong> {text}
						</span>
					</label>
				{/each}
			</div>
		</div>

		<Field label="Any additional comments or edits of these options here:">
			<textarea
				name="additionalComments"
				rows="3"
				placeholder="Optional comments or edits"
				class={`${inputClass} resize-y min-h-20`}
			>{form?.additionalComments ?? ''}</textarea>
		</Field>

		<div class="pt-4">
			<p class="text-sm text-neutral-700 dark:text-neutral-300 mb-3">I have reviewed the above testimonial(s) and approve Semper Finish to share my chosen version publicly (website, social media, and marketing materials).</p>
			
			<Field label="Signature" required>
				<input
					name="signature"
					value={form?.signature ?? ''}
					placeholder="Your signature"
					required
					class={inputClass}
				/>
			</Field>
		</div>

		{#if form?.error}
			<p class="text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded p-3" role="alert" aria-live="polite">{form.error}</p>
		{/if}
		{#if successMessage}
			<p class="text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded p-3" role="status" aria-live="polite" in:fade={{ duration: 150 }} out:fade={{ duration: 250 }}>{successMessage}</p>
		{/if}

		<div class="flex gap-3 pt-4">
			<button type="submit" class="bg-primary text-white rounded-md px-4 py-2 shadow-sm hover:brightness-95 transition disabled:opacity-60" disabled={isSubmitting}>
				{#if isSubmitting}
					Submitting...
				{:else}
					Submit
				{/if}
			</button>
			<button type="button" onclick={onClose} class="bg-neutral-200 text-neutral-900 rounded-md px-4 py-2 shadow-sm hover:bg-neutral-300 transition dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600">
				Cancel
			</button>
		</div>
	</form>
	{/key}
</div>
