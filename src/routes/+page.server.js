import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const firstName = data.get('firstName');
		const lastName = data.get('lastName');
		const email = data.get('email');
		const phone = data.get('phone');
		const address = data.get('address');
		
		try {
			// make api request submit form
			
			// On success, either redirect or return success
			// throw redirect(303, '/success');
			
		} catch (error) {
			return fail(422, {
				firstName,
				lastName,
				email,
				phone,
				address,
				error: error.message
			});
		}
	}
};