<script lang="ts">
  // Provides a system-theme-aware page shell with optional title/description meta via slot fallback
  let { title = '', description = '', children } = $props<{ title?: string; description?: string; children?: () => any }>();
</script>

<svelte:head>
  {#if title}<title>{title}</title>{/if}
  {#if description}<meta name="description" content={description} />{/if}
</svelte:head>

<div class="space-y-8">
  {#if children}
    {@render children()}
  {/if}
</div>
