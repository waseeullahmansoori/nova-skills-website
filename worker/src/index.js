/**
 * Nova Skills Enterprise Platform — AI Career Advisor Worker Entrypoint
 * Version: 14.0.0 (Phase 14 Communication & Automation Hub)
 * ES Module Entrypoint for Cloudflare Workers
 */

import { handleCorsPreflight, applyCorsHeaders } from './middleware/cors.js';
import { logRequest } from './middleware/logger.js';
import { handleGlobalError } from './middleware/error.js';
import { handleHealthRoute } from './routes/health.js';
import { handleChatRoute } from './routes/chat.js';
import { handleLeadRoute } from './routes/lead.js';
import { handleDashboardRoute } from './routes/dashboard.js';
import { handleAuthRoute } from './routes/auth.js';
import { handleProgressRoute } from './routes/progress.js';
import { handleCertificateRoute } from './routes/certificate.js';
import { handleCommunicationRoute } from './routes/communication.js';
import { createErrorResponse } from './utils/response.js';
import { HTTP_STATUS } from './config/constants.js';

export default {
  async fetch(request, env, ctx) {
    // 1. Logger Middleware
    logRequest(request);

    // 2. CORS Preflight Handler
    const preflight = handleCorsPreflight(request);
    if (preflight) return preflight;

    try {
      const url = new URL(request.url);
      const pathname = url.pathname.replace(/\/$/, ''); // Normalize trailing slash

      let response;

      // 3. Route Dispatcher
      if (request.method === 'GET' && pathname.startsWith('/api/health')) {
        response = await handleHealthRoute(request, env);
      } else if (request.method === 'POST' && (pathname === '/api/chat' || pathname === '/api/ai/chat')) {
        response = await handleChatRoute(request, env);
      } else if (pathname.startsWith('/api/auth')) {
        response = await handleAuthRoute(request, env);
      } else if (pathname.startsWith('/api/progress')) {
        response = await handleProgressRoute(request, env);
      } else if (pathname.startsWith('/api/certificates') || pathname.startsWith('/api/verify')) {
        response = await handleCertificateRoute(request, env);
      } else if (pathname.startsWith('/api/email') || pathname.startsWith('/api/whatsapp') || pathname.startsWith('/api/notifications') || pathname.startsWith('/api/communications') || pathname.startsWith('/api/automation')) {
        response = await handleCommunicationRoute(request, env);
      } else if (pathname.startsWith('/api/dashboard')) {
        response = await handleDashboardRoute(request, env);
      } else if (pathname.startsWith('/api/leads') || pathname === '/api/lead') {
        response = await handleLeadRoute(request, env);
      } else {
        response = createErrorResponse(`Route not found: ${request.method} ${url.pathname}`, HTTP_STATUS.NOT_FOUND);
      }

      // 4. Apply CORS Headers & Return
      return applyCorsHeaders(response);

    } catch (error) {
      // 5. Global Error Handler
      const errorResponse = handleGlobalError(error);
      return applyCorsHeaders(errorResponse);
    }
  }
};
