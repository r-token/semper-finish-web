<script lang="ts">
  import '../app.css';
  import Navbar from '$lib/components/Navbar.svelte';
  import { fade } from 'svelte/transition';
  import { page } from '$app/stores';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" type="image/png" href="/logo-noname.png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <!-- Light/dark theme-color for better address bar styling -->
  <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
  <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0a0a0a" />
</svelte:head>

<div class="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
  <Navbar />

  <main class="container-safe pt-1 sm:pt-2 pb-6 sm:pb-8">
    {#key $page.url.pathname}
      <div in:fade={{ duration: 400 }}>
        {#if children}
          {@render children()}
        {/if}
      </div>
    {/key}
  </main>

  <footer class="border-t border-neutral-200 dark:border-neutral-800">
    <div class="container-safe py-6 text-sm text-neutral-600 dark:text-neutral-400 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <img src="/logo.png" alt="Semper Finish" class="h-6 w-auto" />
        <span class="sr-only">Semper Finish</span>
      </div>
      <p class="m-0">© {new Date().getFullYear()} Semper Finish, LLC.</p>
    </div>
  </footer>
</div>
