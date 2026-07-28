/**
 * ============================================================
 * NOVA SKILLS — AI Gateway & Enterprise Platform Cloudflare Worker
 * Target Model: OpenAI GPT-5.5 API
 * Features: AI Gateway, AI Student Assistant, AI Counsellor Engine, AI Content Studio, AI Operations Center, Enterprise Auth & RBAC Security Headers.
 * ============================================================
 */

import { getConfig } from './config/index.js';
import { handleOptionsRequest } from './security/cors.js';
import { applySecurityHeaders } from './security/securityHeaders.js';
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
      return applySecurityHeaders(handleOptionsRequest(request, config.allowedOrigins));
    }

    // Health check endpoint
    if (request.method === 'GET' && (path === '/' || path === '/health')) {
      const response = createJsonResponse({
        status: 'healthy',
        service: 'Nova Skills Enterprise AI Platform & Security Worker',
        model: config.openaiModel,
        version: '1.0.0'
      }, 200, reqOrigin, config.allowedOrigins);
      return applySecurityHeaders(response);
    }

    // 2. Validate Origin (Skip for GET health / OPTIONS)
    const originCheck = validateOrigin(request, config.allowedOrigins, config.environment);
    if (!originCheck.valid) {
      const response = createErrorResponse(originCheck.error, 403, reqOrigin, config.allowedOrigins);
      return applySecurityHeaders(response);
    }

    // 3. Rate Limit Check
    const rateCheck = checkRateLimit(request, config.rateLimitPerMinute);
    if (rateCheck.limited) {
      const response = createErrorResponse(rateCheck.error, 429, reqOrigin, config.allowedOrigins);
      return applySecurityHeaders(response);
    }

    // 4. API Routing & Execution
    try {
      const response = await handleApiRoute(request, path, config, reqOrigin);
      return applySecurityHeaders(response);
    } catch (err) {
      console.error('Unhandled Worker Exception:', err);
      const response = createErrorResponse(
        err.message || 'An internal AI Gateway error occurred.',
        500,
        reqOrigin,
        config.allowedOrigins,
        config.environment === 'development' ? err.stack : null
      );
      return applySecurityHeaders(response);
    }
  }
};
