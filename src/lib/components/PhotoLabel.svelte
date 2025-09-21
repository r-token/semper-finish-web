<script lang="ts">
  import type { GalleryLabel } from '$lib/utils/parseGalleryImages';
  let { label, class: className = '', ...rest } = $props<{ label: GalleryLabel; class?: string }>();

  const classesFor = (l: GalleryLabel): string => {
    if (l === 'before') return 'bg-red-600/90 text-white ring-white/50';
    if (l === 'prep') return 'bg-amber-400/95 text-neutral-900 ring-white/40';
    return 'bg-green-600/90 text-white ring-white/50';
  };

</script>

<span
  class={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-sm ring-1 ring-inset backdrop-blur-sm ${classesFor(label)} ${className}`.trim()}
  {...rest}
>
  {label}
</span>
