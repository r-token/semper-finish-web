<script lang="ts">
  import NavLink from './NavLink.svelte';
  import { page } from '$app/stores';

  const links = [
    { href: '/', label: 'Home' },
    { href: '/meet-the-team', label: 'Meet the Team' },
    { href: '/job-gallery', label: 'Job Gallery' }
  ];

  let pathname = $state('');
  let open = $state(false);

  // Track route changes and close the mobile menu when navigating
  $effect(() => {
    const unsub = page.subscribe(($page) => {
      pathname = $page.url.pathname;
      open = false;
    });
    return unsub;
  });

  const toggle = () => (open = !open);
</script>

<header class="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-neutral-800 dark:bg-neutral-950/80 dark:supports-[backdrop-filter]:bg-neutral-950/60">
  <div class="container-safe h-16 flex items-center justify-between gap-4">
    <a href="/" class="flex items-center gap-3">
      <img src="/logo.png" alt="Semper Finish" class="h-8 w-auto" />
      <span class="sr-only">Semper Finish</span>
    </a>

    <nav class="hidden md:flex items-center gap-1">
      {#each links as link}
        <NavLink href={link.href} active={pathname === link.href}>{link.label}</NavLink>
      {/each}
    </nav>

    <button
      class="md:hidden inline-flex items-center justify-center rounded-md p-2 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      aria-controls="mobile-nav"
      onclick={toggle}
    >
      {#if !open}
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      {:else}
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      {/if}
    </button>
  </div>

  <!-- Accent brand bar -->
  <div aria-hidden="true" class="h-1 bg-gradient-to-r from-primary via-gold to-blue"></div>

  <!-- Mobile menu -->
  <div
    id="mobile-nav"
    data-open={open}
    class="md:hidden overflow-hidden border-t border-neutral-200 dark:border-neutral-800 transition-[grid-template-rows] duration-200 grid data-[open=true]:grid-rows-[1fr] grid-rows-[0fr]"
  >
    <div class="min-h-0">
      <nav class="container-safe py-2 flex flex-col">
        {#each links as link}
          <NavLink href={link.href} active={pathname === link.href}>{link.label}</NavLink>
        {/each}
      </nav>
    </div>
  </div>
</header>
