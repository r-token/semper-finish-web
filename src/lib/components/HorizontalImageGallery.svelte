<script lang="ts">
  import LightboxOverlay from './LightboxOverlay.svelte';
  type AltProp = string | string[] | ((src: string, index: number) => string);
  const props = $props<{
    images: string[];
    alt?: AltProp;
    tileWidth?: string; // tailwind width class, e.g. 'w-80'
    tileHeight?: string; // tailwind height class, e.g. 'h-56'
    class?: string;
  }>();

  let {
    images,
    alt = '',
    tileWidth = 'w-80',
    tileHeight = 'h-56',
    class: className = '',
    ...rest
  } = props;

  let selectedIndex = $state<number | null>(null);

  const altFor = (src: string, index: number): string => {
    if (typeof alt === 'function') return alt(src, index);
    if (Array.isArray(alt)) return alt[index] ?? `Photo ${index + 1}`;
    return alt || `Photo ${index + 1}`;
  };

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
    {#each images as src, i}
      <li class="snap-start shrink-0" role="listitem">
        <img
          src={src}
          alt={altFor(src, i)}
          loading="lazy"
          decoding="async"
          class={`${tileWidth} ${tileHeight} object-cover rounded-lg border border-neutral-200 dark:border-neutral-800 select-none cursor-zoom-in`}
          draggable="false"
          onclick={() => open(i)}
        />
      </li>
    {/each}
  </ul>

  {#if selectedIndex !== null}
    <LightboxOverlay
      src={images[selectedIndex]}
      alt={altFor(images[selectedIndex], selectedIndex)}
      onClose={close}
      onPrev={prev}
      onNext={next}
    />
  {/if}
</div>
