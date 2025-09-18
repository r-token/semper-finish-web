<script lang="ts">
  const props = $props<{ label: string; hint?: string; class?: string; children?: () => any }>();
  let { label, hint = '', class: className = '', children, ...rest } = props;
</script>

<label class={`block ${className}`.trim()} {...rest}>
  <span class="block text-sm font-medium text-neutral-700 dark:text-neutral-200">{label}</span>
  {#if children}
    {@render children()}
  {/if}
  {#if hint}
    <span class="mt-1 block text-xs text-neutral-500 dark:text-neutral-400">{hint}</span>
  {/if}
</label>