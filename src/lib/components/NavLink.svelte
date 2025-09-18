<script lang="ts">
  let { href = '/', label = 'Home', active = false, children } = $props<{
    href?: string;
    label?: string;
    active?: boolean;
    children?: () => any;
  }>();
</script>

<a
  href={href}
  data-active={active}
  class="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 data-[active=true]:text-primary data-[active=true]:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800 dark:data-[active=true]:text-yellow dark:data-[active=true]:bg-neutral-800 transition-colors"
>
  {#if children}
    {@render children()}
  {:else}
    {label}
  {/if}
</a>
