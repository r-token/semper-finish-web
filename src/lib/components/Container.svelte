<script lang="ts">
  const props = $props<{ as?: string; class?: string; children?: () => any }>();
  let { as = 'div', class: className = '', children, ...rest } = props;
  const base = 'container-safe';
</script>

<svelte:element this={as} class={`${base} ${className}`.trim()} {...rest}>
  {#if children}
    {@render children()}
  {/if}
</svelte:element>