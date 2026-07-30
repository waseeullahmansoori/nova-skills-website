/**
 * Nova Skills AI Career Advisor Worker — Error Handling Middleware
 */

import { createErrorResponse } from '../utils/response.js';
import { HTTP_STATUS } from '../config/constants.js';

export function handleGlobalError(err) {
  console.error('[Worker Unhandled Error]', err);
  const status = err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || 'An unexpected error occurred processing your request.';
  return createErrorResponse(message, status);
}
