<script lang="ts">
  let { title = '', lead = '', children } = $props<{ title?: string; lead?: string; children?: () => any }>();
</script>

<section class="space-y-4">
  {#if title}
    <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">{title}</h2>
  {/if}
  {#if lead}
    <p class="text-neutral-600 dark:text-neutral-300 max-w-prose">{lead}</p>
  {/if}
  <div class="max-w-prose">
    {#if children}
      {@render children()}
    {/if}
  </div>
</section>
