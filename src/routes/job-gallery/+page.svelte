<script lang="ts">
  import Section from '$lib/components/Section.svelte';
  import Heading from '$lib/components/Heading.svelte';
  import Spacer from '$lib/components/Spacer.svelte';
  import JobGallery from '$lib/components/JobGallery.svelte';
  import { organizeImagesByJob, type GalleryImage } from '$lib/utils/parseGalleryImages';

  const modules = import.meta.glob('$lib/assets/gallery/job*/*.{jpg,jpeg,png,webp}', {
    eager: true,
    query: '?url',
    import: 'default'
  }) as Record<string, string>;

  const allJobImages = organizeImagesByJob(modules);
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
  
  {#if allJobImages['job5-bathroom']?.length > 0}
    <JobGallery title="2025 Bathroom Repair/Repaint" images={allJobImages['job5-bathroom']} />
  {/if}
  
  {#if allJobImages['job4-pundmann']?.length > 0}
    <JobGallery title="2025 Sunroom Furniture Refinish in St. Charles, MO" images={allJobImages['job4-pundmann']} />
  {/if}
  
  {#if allJobImages['job3-patsy-howell']?.length > 0}
    <JobGallery title="2025 6-Room Repair/Repaint in Troy, MO" images={allJobImages['job3-patsy-howell']} />
  {/if}

  {#if allJobImages['job2-stairwell']?.length > 0}
    <JobGallery title="2025 Stairwell Paint Job in St. Charles, MO" images={allJobImages['job2-stairwell']} />
  {/if}

  {#if allJobImages['job1-gma']?.length > 0}
    <JobGallery title="2025 Garage Paint Job in Labadie, MO" images={allJobImages['job1-gma']} />
  {/if}
</Section>