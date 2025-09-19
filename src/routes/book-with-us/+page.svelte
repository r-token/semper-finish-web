<script>
	export let form;
	import BookingForm from '$lib/components/BookingForm.svelte';
  import Section from '$lib/components/Section.svelte';
  import Heading from '$lib/components/Heading.svelte';
  import Spacer from '$lib/components/Spacer.svelte';
</script>

<svelte:head>
  <title>Book With Us | Semper Finish</title>
  <meta name="description" content="Book a free estimate with Semper Finish. Schedule services with our professional team." />

  <!-- Open Graph -->
  <meta property="og:title" content="Book With Us | Semper Finish" />
  <meta property="og:description" content="Book a free estimate with Semper Finish. Schedule services with our professional team." />

  <!-- Twitter -->
  <meta name="twitter:title" content="Book With Us | Semper Finish" />
  <meta name="twitter:description" content="Book a free estimate with Semper Finish. Schedule services with our professional team." />
</svelte:head>

<Section>
  <Heading title="Book With Us" />
  <Spacer />
  <BookingForm {form} />
</Section>
