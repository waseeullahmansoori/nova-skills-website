/**
 * Nova Skills AI Career Advisor Worker — CORS Middleware
 */

import { DEFAULT_CORS_HEADERS, HTTP_STATUS } from '../config/constants.js';

export function handleCorsPreflight(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: HTTP_STATUS.OK,
      headers: DEFAULT_CORS_HEADERS
    });
  }
  return null;
}

export function applyCorsHeaders(response) {
  const newHeaders = new Headers(response.headers);
  Object.entries(DEFAULT_CORS_HEADERS).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}
