/**
 * Standardized JSON Response Helpers
 */

import { getCorsHeaders } from '../security/cors.js';

export function createJsonResponse(data, status = 200, reqOrigin = '', allowedOrigins = []) {
  const headers = {
    'Content-Type': 'application/json',
    ...getCorsHeaders(reqOrigin, allowedOrigins)
  };

  return new Response(JSON.stringify(data), {
    status: status,
    headers: headers
  });
}

export function createErrorResponse(message, status = 400, reqOrigin = '', allowedOrigins = [], details = null) {
  const payload = {
    success: false,
    error: {
      message: message,
      status: status,
      details: details
    }
  };

  return createJsonResponse(payload, status, reqOrigin, allowedOrigins);
}
