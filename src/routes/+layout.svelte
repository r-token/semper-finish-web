<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav>
	<a href="/">Home</a>
	<a href="/book-with-us">Book With Us</a>
	<a href="/customer-testimony">Customer Testimony</a>
	<a href="/meet-the-team">Meet the Team</a>
</nav>

{@render children?.()}
