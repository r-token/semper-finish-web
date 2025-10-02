<script lang="ts">
  import '../app.css';
  import Navbar from '$lib/components/Navbar.svelte';
  import { fade } from 'svelte/transition';
  import { page } from '$app/stores';

  let { children } = $props();
</script>

<svelte:head>
  <!-- Favicon and Apple Touch Icon; Google prefers 144x144 -->
  <link rel="icon" type="image/png" sizes="144x144" href="/logo-noname-144.png" />
  <link rel="icon" type="image/png" href="/logo-noname-144.png" /> <!-- fallback if `sizes` not supported -->
  <link rel="icon" type="image/png" sizes="680x680" href="/logo-noname.png" />
  <link rel="apple-touch-icon" sizes="680x680" href="/logo-noname.png" />
  
  <!-- Light/dark theme-color for better address bar styling -->
  <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
  <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0a0a0a" />

  <!-- Canonical URL -->
  <link rel="canonical" href={$page.url.href} />
  
  <!-- Structured data for site name -->
  {@html `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Semper Finish",
    "description": "Semper Finish delivers professional painting and handyman jobs to the St. Louis metro area.",
    "url": "${$page.url.origin}"
  }
  </script>`}
  
  <!-- LocalBusiness structured data -->
  {@html `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Semper Finish",
    "description": "Professional painting and handyman services in the St. Louis metro area",
    "url": "${$page.url.origin}",
    "telephone": "+1-314-412-8368",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "St. Louis",
      "addressRegion": "MO",
      "addressCountry": "US"
    },
    "areaServed": {
      "@type": "City",
      "name": "St. Louis"
    }
  }
  </script>`}

  <!-- Open Graph defaults -->
  <meta property="og:site_name" content="Semper Finish" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={$page.url.href} />
  <meta property="og:image" content={$page.url.origin + '/logo.png'} />
  <meta property="og:locale" content="en_US" />

  <!-- Twitter defaults -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content={$page.url.origin + '/logo.png'} />

  <!-- Robots -->
  <meta name="robots" content="index, follow" />
</svelte:head>

<div class="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
  <Navbar />

  <main class="container-safe pb-4">
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
        <img src="/logo.png" alt="Semper Finish" class="h-2 w-auto" />
        <span class="sr-only">Semper Finish</span>
      </div>
      <p class="m-0">© {new Date().getFullYear()} Semper Finish, LLC.</p>
    </div>
  </footer>
</div>
