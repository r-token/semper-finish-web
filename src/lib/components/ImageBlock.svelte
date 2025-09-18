<script lang="ts">
  let { src = '', alt = '', caption = '' } = $props<{ src?: string; alt?: string; caption?: string }>();
</script>

<figure class="space-y-3">
  <img src={src} alt={alt} class="w-full rounded-lg border border-neutral-200 dark:border-neutral-800" />
  {#if caption}
    <figcaption class="text-sm text-neutral-600 dark:text-neutral-300">{caption}</figcaption>
  {/if}
</figure>
