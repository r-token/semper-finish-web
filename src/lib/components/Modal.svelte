<script>
	import { fade, scale } from 'svelte/transition';

	let { open = $bindable(false), children } = $props();

	function handleKeydown(event) {
		if (event.key === 'Escape') {
			open = false;
		}
	}

	function handleBackdropClick(event) {
		if (event.target === event.currentTarget) {
			open = false;
		}
	}

	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
		transition:fade={{ duration: 150 }}
	>
		<div 
			class="absolute inset-0 bg-black/50" 
			aria-hidden="true"
			onclick={handleBackdropClick}
		></div>
		<div
			class="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-900 rounded-3xl shadow-xl"
			transition:scale={{ duration: 150, start: 0.95 }}
		>
			<button
				onclick={() => open = false}
				class="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
				aria-label="Close modal"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
			{#if children}
				{@render children()}
			{/if}
		</div>
	</div>
{/if}
