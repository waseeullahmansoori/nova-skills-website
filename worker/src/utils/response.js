/**
 * Nova Skills AI Career Advisor Worker — Response Utilities
 */

import { HTTP_STATUS, DEFAULT_CORS_HEADERS } from '../config/constants.js';

export function createJsonResponse(data, status = HTTP_STATUS.OK, customHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    ...DEFAULT_CORS_HEADERS,
    ...customHeaders
  };

  return new Response(JSON.stringify(data), {
    status,
    headers
  });
}

export function createSuccessResponse(payload = {}, status = HTTP_STATUS.OK) {
  return createJsonResponse({
    success: true,
    response: payload.response || '',
    usage: payload.usage || { input_tokens: null, output_tokens: null },
    ...payload
  }, status);
}

export function createErrorResponse(message = 'An unexpected error occurred', status = HTTP_STATUS.INTERNAL_SERVER_ERROR, details = null) {
  const body = {
    success: false,
    error: {
      message,
      status,
      timestamp: new Date().toISOString()
    }
  };

  if (details) {
    body.error.details = details;
  }

  return createJsonResponse(body, status);
}
