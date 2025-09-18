<script lang="ts">
  const props = $props<{ elevated?: boolean; children?: () => any }>();
  let { elevated = true, children, ...rest } = props;
</script>

<section class={`rounded-xl border ${elevated ? 'shadow-sm' : ''} border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900`}
  {...rest}
>
  <div class="p-6 sm:p-8">
    {#if children}
      {@render children()}
    {/if}
  </div>
</section>
