export function sanitizeString(input: unknown, maxLen = 500) {
  const str = typeof input === 'string' ? input : '';
  return str.trim().replace(/\s+/g, ' ').replace(/[<>]/g, '').slice(0, maxLen);
}

export function sanitizeEmail(input: unknown) {
  const str = sanitizeString(input, 254).toLowerCase();
  const ok = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(str);
  return ok ? str : '';
}

export function sanitizePhone(input: unknown) {
  const digits = String(input ?? '').replace(/\D/g, '').slice(0, 20);
  return digits;
}
