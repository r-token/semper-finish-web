<script>
	let { onclick, children } = $props();
</script>

<button
	{onclick}
	class="bg-primary text-white rounded-lg px-4 py-2 text-lg font-semibold shadow-lg hover:brightness-95 transition"
>
	{#if children}
		{@render children()}
	{/if}
</button>
