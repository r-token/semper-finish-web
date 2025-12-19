<script>
	import BookingForm from '$lib/components/BookingForm.svelte';
	import TestimonialForm from '$lib/components/TestimonialForm.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Section from '$lib/components/Section.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import CTAButton from '$lib/components/CTAButton.svelte';

	let { data, form } = $props();
	let bookingModalOpen = $state(false);
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
	<Heading title="Professional painting and remodeling services across St. Louis, MO" centered />
	
	<!-- Book With Us Button -->
	<div class="mt-4 flex justify-center">
		<CTAButton onclick={() => bookingModalOpen = true}>
			Book With Us
		</CTAButton>
	</div>

	<!-- Hero Graphic -->
	<div class="mt-12 mb-12 relative flex items-center justify-center">
		<div class="relative w-full max-w-xl">
			<!-- Logo -->
			<img 
				src="/logo.png" 
				alt="Semper Finish Logo" 
				class="w-full h-auto opacity-40 dark:opacity-30"
			/>
		</div>
		<!-- Overlaid Text -->
		<div class="absolute inset-0 flex items-center justify-center">
			<h2 class="text-3xl sm:text-5xl font-black text-black dark:text-white text-center px-4">
				YOUR HOME. OUR HONOR.
			</h2>
		</div>
	</div>

	<!-- Secondary Tagline -->
	<div class="text-center">
		<p class="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
			Woman-owned and veteran-operated, we bring painting and precision you can trust.
		</p>
	</div>

	<!-- Submit Testimonial Button -->
	<div class="mt-8 mb-8 flex justify-center">
		<CTAButton onclick={() => testimonialModalOpen = true}>
			Submit Testimonial
		</CTAButton>
	</div>
</Section>

<Modal bind:open={bookingModalOpen}>
	<BookingForm {form} csrfToken={data?.csrfToken} onClose={() => bookingModalOpen = false} />
</Modal>

<Modal bind:open={testimonialModalOpen}>
	<TestimonialForm {form} csrfToken={data?.csrfToken} onClose={() => testimonialModalOpen = false} />
</Modal>
