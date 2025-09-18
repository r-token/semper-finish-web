<script lang="ts">
  let { variant = 'primary', size = 'md', href = undefined, children } = $props<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'link';
    size?: 'sm' | 'md' | 'lg';
    href?: string | undefined;
    children?: () => any;
  }>();

  const sizeClasses: Record<typeof size, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  } as const;

  const base = 'inline-flex items-center justify-start rounded-md font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue disabled:opacity-50 disabled:pointer-events-none dark:focus-visible:ring-yellow';
  const variants: Record<typeof variant, string> = {
    primary: 'bg-primary text-white hover:bg-[#b50e1c]',
    secondary: 'bg-blue text-white hover:bg-[#003a6e]',
    ghost: 'bg-transparent text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800',
    link: 'bg-transparent text-blue hover:underline dark:text-yellow'
  } as const;

  // For "link" variant, remove padding so the text aligns with surrounding copy
  const padding = variant === 'link' ? 'p-0' : sizeClasses[size];
</script>


{#if href}
  <a href={href} class={`${base} ${variants[variant]} ${padding}`}>
    {#if children}
      {@render children()}
    {/if}
  </a>
{:else}
  <button class={`${base} ${variants[variant]} ${padding}`}>
    {#if children}
      {@render children()}
    {/if}
  </button>
{/if}
