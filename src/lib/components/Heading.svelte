<script lang="ts">
  const props = $props<{ title: string; lead?: string }>();
  let { title, lead = '' } = props;
</script>

<!-- Standard page heading with optional lead, wrapped in Prose for consistent type scale -->
<div>
  <div class="prose prose-neutral dark:prose-invert max-w-none prose-h1:mb-1 prose-p:mt-0">
    <h1>{title}</h1>
    {#if lead}
      <p class="text-neutral-600 dark:text-neutral-300 leading-6">{lead}</p>
    {/if}
  </div>
</div>
