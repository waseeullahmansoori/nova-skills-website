/**
 * Enterprise Security Headers Middleware
 * Enforces HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and CSP
 */

export function applySecurityHeaders(response) {
  const headers = new Headers(response.headers);

  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Content-Security-Policy', "default-src 'self' https://novaskills.in https://www.novaskills.in; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
}
