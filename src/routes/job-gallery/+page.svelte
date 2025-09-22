<script lang="ts">
  import Section from '$lib/components/Section.svelte';
  import Heading from '$lib/components/Heading.svelte';
  import Spacer from '$lib/components/Spacer.svelte';
  import JobGallery from '$lib/components/JobGallery.svelte';
  import { parseGalleryImages } from '$lib/utils/parseGalleryImages';

  // Load images for the first gallery (job1-gma), then parse/sort by label order and numeric index
  const modules = import.meta.glob('$lib/assets/gallery/job1-gma/*.{jpg,jpeg,png,webp}', {
    eager: true,
    query: '?url',
    import: 'default'
  }) as Record<string, string>;

  const gmaImages = parseGalleryImages(modules);
</script>

<svelte:head>
  <title>Job Gallery | Semper Finish</title>
  <meta name="description" content="A selection of our recent jobs and finishes." />
  
  <!-- Open Graph -->
  <meta property="og:title" content="Job Gallery | Semper Finish" />
  <meta property="og:description" content="A selection of our recent jobs and finishes." />
  
  <!-- Twitter -->
  <meta name="twitter:title" content="Job Gallery | Semper Finish" />
  <meta name="twitter:description" content="A selection of our recent jobs and finishes." />
</svelte:head>

<Section width="wide">
  <Heading title="Job Gallery" lead="See examples of our work." />
  <Spacer />

  <JobGallery title="2025 Job in Labadie, MO" images={gmaImages} />
</Section>