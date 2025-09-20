<script lang="ts">
  import Section from '$lib/components/Section.svelte';
  import Heading from '$lib/components/Heading.svelte';
  import Spacer from '$lib/components/Spacer.svelte';
  import JobGallery from '$lib/components/JobGallery.svelte';

  // Load images for the first gallery (job1-gma) as URLs in natural numeric order
  const modules = import.meta.glob('$lib/assets/gallery/job1-gma/*.{jpg,jpeg,png,webp}', {
    eager: true,
    query: '?url',
    import: 'default'
  }) as Record<string, string>;

  const gmaImages = Object.entries(modules)
    .sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }))
    .map(([, url]) => url);
</script>

<svelte:head>
  <title>Gallery | Semper Finish</title>
  <meta name="description" content="A selection of our recent jobs and finishes." />
  <meta property="og:title" content="Gallery | Semper Finish" />
  <meta property="og:description" content="A selection of our recent jobs and finishes." />
  <meta name="twitter:title" content="Gallery | Semper Finish" />
  <meta name="twitter:description" content="A selection of our recent jobs and finishes." />
</svelte:head>

<Section width="wide">
  <Heading title="Job Gallery" lead="See examples of our work." />
  <Spacer />

  <JobGallery title="2025 Job in Labadie, MO" images={gmaImages} />
</Section>