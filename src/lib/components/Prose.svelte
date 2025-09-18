<script lang="ts">
  // Tailwind Typography wrapper that inverts in dark mode
  const props = $props<{ children?: () => any; class?: string }>();
  let { children, class: className = '', ...rest } = props;
</script>

<div class={`prose prose-neutral dark:prose-invert max-w-none ${className}`.trim()} {...rest}>
  {#if children}
    {@render children()}
  {/if}
</div>
