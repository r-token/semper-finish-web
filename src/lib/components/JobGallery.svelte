<script lang="ts">
  import HorizontalImageGallery from './HorizontalImageGallery.svelte';
  import type { GalleryImage } from '$lib/utils/parseGalleryImages';

  const props = $props<{ title: string; images: GalleryImage[]; class?: string }>();
  let { title, images, class: className = '', ...rest } = props;
</script>

<div class="mt-8 {className}" {...rest}>
  <div class="prose prose-neutral dark:prose-invert max-w-none prose-h2:mb-1">
    <h2>{title}</h2>
  </div>
  <div class="mt-4">
    <HorizontalImageGallery images={images} />
  </div>
</div>