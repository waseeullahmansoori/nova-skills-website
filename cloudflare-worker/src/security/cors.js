/**
 * CORS Security Helper
 */

export function getCorsHeaders(origin, allowedOrigins) {
  const reqOrigin = (origin || '').toLowerCase();
  const isAllowed = allowedOrigins.some(o => o === reqOrigin || reqOrigin.endsWith('.novaskills.in') || reqOrigin.includes('localhost') || reqOrigin.includes('127.0.0.1'));
  
  const allowOrigin = isAllowed ? origin : allowedOrigins[0] || 'https://novaskills.in';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

export function handleOptionsRequest(request, allowedOrigins) {
  const origin = request.headers.get('Origin');
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin, allowedOrigins)
  });
}
