<script lang="ts">
  import LightboxOverlay from './LightboxOverlay.svelte';
  import type { GalleryImage } from '$lib/utils/parseGalleryImages';
  import PhotoLabel from './PhotoLabel.svelte';

  const props = $props<{
    images: GalleryImage[];
    tileWidth?: string; // tailwind width class, e.g. 'w-80'
    tileHeight?: string; // tailwind height class, e.g. 'h-56'
    class?: string;
  }>();

  let {
    images,
    tileWidth = 'w-80',
    tileHeight = 'h-56',
    class: className = '',
    ...rest
  } = props;

  let selectedIndex = $state<number | null>(null);

  const open = (i: number) => {
    selectedIndex = i;
  };
  const close = () => {
    selectedIndex = null;
  };
  const prev = () => {
    if (selectedIndex === null || images.length === 0) return;
    const nextIndex = (selectedIndex - 1 + images.length) % images.length;
    selectedIndex = nextIndex;
  };
  const next = () => {
    if (selectedIndex === null || images.length === 0) return;
    const nextIndex = (selectedIndex + 1) % images.length;
    selectedIndex = nextIndex;
  };

</script>

<!-- Horizontally scrolling, snap-aligned image gallery -->
<div class={`relative ${className}`.trim()} {...rest}>
  <ul
    class="-mx-4 px-4 md:mx-0 md:px-0 flex gap-3 items-stretch overflow-x-auto snap-x snap-mandatory scroll-px-4
           [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]
           [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent
           [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700"
    role="list"
    aria-label="Image gallery"
  >
    {#each images as img, i}
      <li class="relative snap-start shrink-0" role="listitem">
        <button
          type="button"
          class="block relative"
          onclick={() => open(i)}
          onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } }}
        >
          <img
            src={img.src}
            alt={img.alt}
            loading="lazy"
            decoding="async"
            class={`${tileWidth} ${tileHeight} object-cover rounded-lg border border-neutral-200 dark:border-neutral-800 select-none cursor-zoom-in`}
            draggable="false"
          />

          <!-- Bottom-left label badge -->
          <PhotoLabel label={img.label} class="pointer-events-none absolute left-1.5 bottom-1.5" />
        </button>
      </li>
    {/each}
  </ul>

  {#if selectedIndex !== null}
    <LightboxOverlay
      src={images[selectedIndex].src}
      alt={images[selectedIndex].alt}
      label={images[selectedIndex].label}
      onClose={close}
      onPrev={prev}
      onNext={next}
    />
  {/if}
</div>
