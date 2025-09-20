<script lang="ts">
  import { browser } from '$app/environment';
  let { src, alt = 'Image', onClose = () => {}, onPrev, onNext, class: className = '', ...rest } = $props<{ src: string; alt?: string; onClose?: () => void; onPrev?: () => void; onNext?: () => void; class?: string }>();

  let dialogEl: HTMLDivElement | null = null;

  const close = () => {
    onClose?.();
  };

  // Lock background scroll while open (client-only)
  $effect(() => {
    if (!browser) return;
    document.documentElement.classList.add('overflow-hidden');
    return () => {
      document.documentElement.classList.remove('overflow-hidden');
    };
  });


  // Ensure the dialog receives keyboard focus for reliable key handling
  $effect(() => {
    if (!browser) return;
    if (dialogEl) {
      try { dialogEl.focus({ preventScroll: true } as any); } catch {}
    }
  });
</script>

<div class={`fixed inset-0 z-50 ${className}`.trim()} {...rest}>
  <!-- Dim background (click to close) -->
  <div class="absolute inset-0 bg-black/70" aria-hidden="true" onclick={close}></div>

  <!-- Close button pinned to viewport corner with safe-area support -->
  <button
    class="absolute z-10 inline-flex items-center justify-center h-9 w-9 rounded-full bg-white text-neutral-900 shadow ring-1 ring-neutral-200 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-100 dark:ring-neutral-700 dark:hover:bg-neutral-800 top-3 right-3 sm:top-4 sm:right-4 [top:calc(env(safe-area-inset-top)+0.75rem)] [right:calc(env(safe-area-inset-right)+0.75rem)]"
    aria-label="Close image"
    onclick={close}
  >
    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </button>

  <!-- Dialog container; clicking outside the figure closes -->
  <div
    class="relative z-10 h-full w-full grid place-items-center p-4"
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
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      (e.currentTarget as any)._startX = e.clientX;
      (e.currentTarget as any)._startY = e.clientY;
      (e.currentTarget as any)._dragging = true;
    }}
    onpointermove={(e) => {
      // No visual drag effect for simplicity; just track movement
      if (!(e.currentTarget as any)._dragging) return;
      (e.currentTarget as any)._dx = e.clientX - (e.currentTarget as any)._startX;
      (e.currentTarget as any)._dy = e.clientY - (e.currentTarget as any)._startY;
    }}
    onpointerup={(e) => {
      const el: any = e.currentTarget;
      if (!el._dragging) return;
      el._dragging = false;
      const dx = el._dx ?? 0;
      const dy = el._dy ?? 0;
      el._dx = 0; el._dy = 0;
      const threshold = 48; // px
      if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) onNext?.(); else onPrev?.();
      }
    }}
    onpointercancel={(e) => {
      const el: any = e.currentTarget; el._dragging = false; el._dx = 0; el._dy = 0;
    }}
  >
    <figure class="relative max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)]">
      <img
        src={src}
        alt={alt}
        class="max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] object-contain rounded-lg shadow-2xl border border-neutral-200 dark:border-neutral-700 bg-white/5"
        draggable="false"
      />

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

