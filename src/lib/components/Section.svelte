<script lang="ts">
  const props = $props<{ width?: 'narrow' | 'default' | 'wide'; children?: () => any }>();
  let { width = 'default', children, ...rest } = props;

  const widths = {
    narrow: 'max-w-2xl',
    default: 'max-w-5xl',
    wide: 'max-w-7xl'
  } as const;
</script>

<section class={`container-safe ${widths[width]} w-full`}
  {...rest}
>
  <div class="py-8 sm:py-12">
    {#if children}
      {@render children()}
    {/if}
  </div>
</section>
