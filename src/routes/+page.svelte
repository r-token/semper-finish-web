<script>
	import BookingForm from '$lib/components/BookingForm.svelte';
	import TestimonialForm from '$lib/components/TestimonialForm.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Section from '$lib/components/Section.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Spacer from '$lib/components/Spacer.svelte';

	let { data, form } = $props();
	let testimonialModalOpen = $state(false);
</script>

<svelte:head>
  <title>Semper Finish | Professional Painting & Handyman Services in St. Louis</title>
  <meta name="description" content="Semper Finish delivers professional painting and handyman jobs to the St. Louis metro area." />

  <!-- Open Graph -->
  <meta property="og:title" content="Semper Finish" />
  <meta property="og:description" content="Semper Finish delivers professional painting and handyman jobs to the St. Louis metro area." />

  <!-- Twitter -->
  <meta name="twitter:title" content="Semper Finish" />
  <meta name="twitter:description" content="Semper Finish delivers professional painting and handyman jobs to the St. Louis metro area." />
</svelte:head>

<Section>
	<!-- Responsive header: Heading on left, spacer, logo on right (stacks on small screens) -->
	<div class="flex flex-col lg:flex-row items-start lg:items-center gap-4">
		<div class="min-w-0">
			<Heading title="Semper Finish" lead="Professional painting and handyman services across St. Louis, MO." />
			<p class="text-neutral-600 dark:text-neutral-300 mt-2 leading-6">Woman-owned and veteran-operated, we bring painting and precision you can trust. Your home. Our honor.</p>
			<button 
				onclick={() => testimonialModalOpen = true}
				class="bg-primary text-white rounded-md px-4 py-2 shadow-sm hover:brightness-95 transition mt-4"
			>
				Submit Testimonial
			</button>
		</div>
		<div class="hidden lg:block flex-1"></div>
		<img src="/logo.png" alt="Semper Finish" class="h-14 sm:h-16 lg:h-20 w-auto" />
	</div>

	<Spacer />
	<BookingForm {form} csrfToken={data?.csrfToken} />
</Section>

<Modal bind:open={testimonialModalOpen}>
	<TestimonialForm {form} csrfToken={data?.csrfToken} onClose={() => testimonialModalOpen = false} />
</Modal>
