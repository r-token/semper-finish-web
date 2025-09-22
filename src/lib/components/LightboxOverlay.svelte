<script lang="ts">
  import { browser } from '$app/environment';
  import PhotoLabel from './PhotoLabel.svelte';
  import type { GalleryLabel } from '$lib/utils/parseGalleryImages';

  let { src, alt = 'Image', label = undefined as GalleryLabel | undefined, onClose, onPrev, onNext, class: className = '', ...rest } = $props<{ src: string; alt?: string; label?: GalleryLabel; onClose?: () => void; onPrev?: () => void; onNext?: () => void; class?: string }>();

  let dialogEl: HTMLDivElement | null = null;

  const close = () => {
    onClose?.();
  };

  // Lock background scroll while open (client-only)
  $effect(() => {
    if (!browser) return;

    const body = document.body;
    const html = document.documentElement;

    // Cache current inline styles so we can restore precisely
    const prev = {
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      bodyOverflow: body.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior
    };

    const scrollY = window.scrollY || window.pageYOffset;

    // Robust iOS-friendly body scroll lock: fix body in place
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    // Prevent scroll chaining/rubber-banding out of the overlay
    html.style.overscrollBehavior = 'contain';

    return () => {
      // Restore previous styles and scroll position
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.width = prev.bodyWidth;
      body.style.overflow = prev.bodyOverflow;
      html.style.overscrollBehavior = prev.htmlOverscroll;

      // Restore scroll position
      const y = Math.abs(parseInt((prev.bodyTop || '0').replace('px', ''), 10)) || scrollY;
      window.scrollTo(0, y);
    };
  });


  // Ensure the dialog receives keyboard focus for reliable key handling
  $effect(() => {
    if (!browser) return;
    if (dialogEl) {
      try { dialogEl.focus({ preventScroll: true } as any); } catch (e) { /* no-op */ }
    }
  });
</script>

<div class={`fixed inset-0 z-50 ${className}`.trim()} {...rest}>
  <!-- Dim background (click to close) -->
  <div class="absolute inset-0 bg-black/70" aria-hidden="true" onclick={close}></div>


  <!-- Dialog container; clicking outside the figure closes -->
  <div
    class="relative z-10 h-full w-full grid place-items-center p-4 touch-none overscroll-none select-none"
    role="dialog"
    aria-modal="true"
    tabindex="0"
    bind:this={dialogEl}
    onkeydown={(e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev?.();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNext?.();
      }
    }}
    onclick={(e) => { if (e.currentTarget === e.target) close(); }}
    onpointerdown={(e) => {
      // Track swipe start
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const el = e.currentTarget as HTMLElement & any;
      el.setPointerCapture(e.pointerId);
      el._startX = e.clientX;
      el._startY = e.clientY;
      el._dx = 0;
      el._dy = 0;
      el._dragging = true;
      el._lock = 'pending'; // 'pending' | 'x' | 'y'
      el._t0 = e.timeStamp;
      el._pointer = e.pointerType;
    }}
    onpointermove={(e) => {
      // Track movement and determine swipe direction with a small slop + angle-based lock
      const el = e.currentTarget as any;
      if (!el._dragging) return;
      el._dx = e.clientX - el._startX;
      el._dy = e.clientY - el._startY;

      const absX = Math.abs(el._dx);
      const absY = Math.abs(el._dy);

      if (el._lock === 'pending') {
        const dist = Math.hypot(el._dx, el._dy);
        const slop = 6; // px before deciding a direction (more responsive)
        if (dist > slop) {
          const angleDeg = Math.atan2(absY, absX) * 180 / Math.PI; // 0 = horizontal
          el._lock = angleDeg <= 55 ? 'x' : 'y'; // more lenient horizontal window
        }
      }

      if (el._lock === 'x') {
        // Once we decide it's a horizontal swipe, keep the browser from interfering
        e.preventDefault();
      }
    }}
    onpointerup={(e) => {
      const el: any = e.currentTarget;
      if (!el._dragging) return;
      el._dragging = false;
      const dx = el._dx ?? 0;
      const dy = el._dy ?? 0;
      const lock = el._lock;
      const dt = Math.max((e.timeStamp - (el._t0 ?? e.timeStamp)), 1); // ms
      el._dx = 0; el._dy = 0; el._lock = 'pending';

      const baseThreshold = (el._pointer === 'touch') ? 24 : 32; // easier on touch
      const minFlickDx = 12;
      const vx = Math.abs(dx) / dt; // px/ms
      const velocityThreshold = 0.4; // ~400 px/s

      if (lock === 'x') {
        const angleDeg = Math.atan2(Math.abs(dy), Math.abs(dx)) * 180 / Math.PI;
        if (
          Math.abs(dx) > baseThreshold ||
          (vx > velocityThreshold && Math.abs(dx) > minFlickDx)
        ) {
          if (angleDeg <= 70) {
            if (dx < 0) onNext?.(); else onPrev?.();
          }
        }
      }
    }}
    onpointercancel={(e) => {
      const el: any = e.currentTarget; el._dragging = false; el._dx = 0; el._dy = 0; el._lock = 'pending';
    }}
  >
    <figure class="relative max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)]">
      <img
        src={src}
        alt={alt}
        class="max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] object-contain rounded-lg shadow-2xl border border-neutral-200 dark:border-neutral-700 bg-white/5"
        draggable="false"
      />

      <!-- Close button anchored to the photo (top-right) -->
      <button
        class="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 inline-flex items-center justify-center h-9 w-9 rounded-full bg-white text-neutral-900 shadow ring-1 ring-neutral-200 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-100 dark:ring-neutral-700 dark:hover:bg-neutral-800"
        aria-label="Close image"
        onclick={(e) => { e.stopPropagation(); close(); }}
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {#if label}
        <PhotoLabel label={label} class="pointer-events-none absolute left-3 bottom-3 sm:left-4 sm:bottom-4" />
      {/if}

      <!-- Chevron controls for tap navigation on mobile -->
      <div class="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between">
        <button
          class="pointer-events-auto ml-1 sm:ml-2 inline-flex items-center justify-center h-10 w-10 rounded-full bg-neutral-900/70 text-white hover:bg-neutral-900/85 shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          aria-label="Previous image"
          onclick={(e) => { e.stopPropagation(); onPrev?.(); }}
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button
          class="pointer-events-auto mr-1 sm:mr-2 inline-flex items-center justify-center h-10 w-10 rounded-full bg-neutral-900/70 text-white hover:bg-neutral-900/85 shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          aria-label="Next image"
          onclick={(e) => { e.stopPropagation(); onNext?.(); }}
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </figure>
  </div>
</div>

