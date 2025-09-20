<script lang="ts">
  const props = $props<{ size?: 'sm' | 'md' | 'lg' }>();
  let { size = 'md' } = props;
  const cls = {
    sm: 'mt-2 sm:mt-4',
    md: 'mt-4 sm:mt-6',
    lg: 'mt-6 sm:mt-8'
  } as const;
</script>

<div aria-hidden="true" class={cls[size]}></div>
