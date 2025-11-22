<script lang="ts">
  const props = $props<{ label: string; hint?: string; class?: string; required?: boolean; children?: () => any }>();
  let { label, hint = '', class: className = '', required = false, children, ...rest } = props;
</script>

<label class={`block ${className}`.trim()} {...rest}>
  <span class="block text-sm font-medium text-neutral-700 dark:text-neutral-200">
    {label}{#if required}<span class="text-red-600 dark:text-red-400 ml-0.5">*</span>{/if}
  </span>
  {#if children}
    {@render children()}
  {/if}
  {#if hint}
    <span class="mt-1 block text-xs text-neutral-500 dark:text-neutral-400">{hint}</span>
  {/if}
</label>
