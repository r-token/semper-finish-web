<script lang="ts">
  const props = $props<{ class?: string; children?: () => any }>();
  let { class: className = '', children, ...rest } = props;
  const base = 'grid gap-6';
</script>

<div class={`${base} ${className}`.trim()} {...rest}>
  {#if children}
    {@render children()}
  {/if}
</div>