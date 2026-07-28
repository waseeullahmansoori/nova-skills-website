/**
 * Strict Origin Validation Module
 */

export function validateOrigin(request, allowedOrigins, environment) {
  // In development, allow localhost/staging testing if configured
  if (environment === 'development') {
    return { valid: true };
  }

  const origin = request.headers.get('Origin') || request.headers.get('Referer');
  if (!origin) {
    // Standard browser fetch always sends Origin or Referer for POST requests
    return { valid: false, error: 'Origin or Referer header missing.' };
  }

  const reqOrigin = origin.toLowerCase();
  const isAllowed = allowedOrigins.some(allowed => 
    reqOrigin.startsWith(allowed) || reqOrigin.includes('novaskills.in')
  );

  if (!isAllowed) {
    return { valid: false, error: `Unauthorized origin: ${origin}` };
  }

  return { valid: true };
}
