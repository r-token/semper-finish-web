<script lang="ts">
  const props = $props<{ size?: 'sm' | 'md' | 'lg' }>();
  let { size = 'md' } = props;
  const cls = {
    sm: 'mt-4 sm:mt-6',
    md: 'mt-8 sm:mt-10',
    lg: 'mt-12 sm:mt-16'
  } as const;
</script>

<div aria-hidden class={cls[size]}></div>