<script>
	export let form;
	import BookingForm from '$lib/components/BookingForm.svelte';
	import Section from '$lib/components/Section.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Spacer from '$lib/components/Spacer.svelte';
</script>

<svelte:head>
  <title>Semper Finish</title>
  <meta name="description" content="Semper Finish delivers professional painting and handyman jobs to the St. Louis metro area." />
</svelte:head>

<Section>
	<Heading title="Semper Finish" lead="We’re a local crew delivering quality work across the St. Louis metro area. Woman-owned and veteran-operated, we bring painting and precision you can trust. Your home. Our honor." />
	<Spacer />
	<BookingForm {form} />
</Section>
