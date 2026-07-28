/**
 * ============================================================
 * NOVA SKILLS — AI Gateway Cloudflare Worker (Main Entry Point)
 * Target Model: OpenAI GPT-5.5 API
 * ============================================================
 */

import { getConfig } from './config/index.js';
import { handleOptionsRequest } from './security/cors.js';
import { validateOrigin } from './security/originValidator.js';
import { checkRateLimit } from './security/rateLimiter.js';
import { handleApiRoute } from './api/router.js';
import { createJsonResponse, createErrorResponse } from './utils/response.js';

export default {
  async fetch(request, env, ctx) {
    const config = getConfig(env);
    const url = new URL(request.url);
    const path = url.pathname;
    const reqOrigin = request.headers.get('Origin') || request.headers.get('Referer') || '';

    // 1. Handle CORS Preflight OPTIONS requests
    if (request.method === 'OPTIONS') {
      return handleOptionsRequest(request, config.allowedOrigins);
    }

    // Health check endpoint
    if (request.method === 'GET' && (path === '/' || path === '/health')) {
      return createJsonResponse({
        status: 'healthy',
        service: 'Nova Skills AI Gateway Worker',
        model: config.openaiModel,
        version: '1.0.0'
      }, 200, reqOrigin, config.allowedOrigins);
    }

    // Reject non-POST requests for API routes
    if (request.method !== 'POST') {
      return createErrorResponse('Method Not Allowed. Only POST requests are accepted.', 405, reqOrigin, config.allowedOrigins);
    }

    // 2. Validate Origin
    const originCheck = validateOrigin(request, config.allowedOrigins, config.environment);
    if (!originCheck.valid) {
      return createErrorResponse(originCheck.error, 403, reqOrigin, config.allowedOrigins);
    }

    // 3. Rate Limit Check
    const rateCheck = checkRateLimit(request, config.rateLimitPerMinute);
    if (rateCheck.limited) {
      return createErrorResponse(rateCheck.error, 429, reqOrigin, config.allowedOrigins);
    }

    // 4. API Routing & Execution
    try {
      return await handleApiRoute(request, path, config, reqOrigin);
    } catch (err) {
      console.error('Unhandled Worker Exception:', err);
      return createErrorResponse(
        err.message || 'An internal AI Gateway error occurred.',
        500,
        reqOrigin,
        config.allowedOrigins,
        config.environment === 'development' ? err.stack : null
      );
    }
  }
};
