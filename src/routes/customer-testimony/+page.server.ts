import type { PageServerLoad } from './$types';
import { issueCsrf } from '$lib/server/csrf';

export const load: PageServerLoad = async ({ cookies }) => {
  const { csrfToken } = issueCsrf(cookies);
  return { csrfToken };
};
