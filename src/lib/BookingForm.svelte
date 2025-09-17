<script>
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<div>
	{#if form?.error}
		<p class="error">{form.error}</p>
	{/if}
	
	<form method="POST" use:enhance>
		<label>
			First Name
			<input
				name="firstName"
				value={form?.firstName ?? ''}
				placeholder="First Name"
				required
			/>
		</label>
		
		<label>
			Last Name
			<input
				name="lastName"
				value={form?.lastName ?? ''}
				placeholder="Last Name"
				required
			/>
		</label>
		
		<label>
			Email Address
			<input
				type="email"
				name="email"
				value={form?.email ?? ''}
				placeholder="Email Address"
				required
			/>
		</label>
		
		<label>
			Phone Number
			<input
				type="tel"
				name="phone"
				value={form?.phone ?? ''}
				placeholder="Phone Number"
				required
			/>
		</label>
		
		<label>
			Home Address
			<input
				name="address"
				value={form?.address ?? ''}
				placeholder="Home Address"
				required
			/>
		</label>
		
		<button type="submit">Submit</button>
	</form>
</div>