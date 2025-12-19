<script lang="ts">
  const props = $props<{ title: string; lead?: string; centered?: boolean }>();
  let { title, lead = '', centered = false } = props;
</script>

<!-- Standard page heading with optional lead, wrapped in Prose for consistent type scale -->
<div class={centered ? 'text-center' : ''}>
  <div class="prose prose-neutral dark:prose-invert max-w-none prose-h1:mb-1 prose-h1:text-3xl prose-p:mt-0">
    <h1>{title}</h1>
    {#if lead}
      <p class="text-neutral-600 dark:text-neutral-300 leading-6">{lead}</p>
    {/if}
  </div>
</div>
