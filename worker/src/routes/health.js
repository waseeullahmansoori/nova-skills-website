/**
 * Nova Skills AI Career Advisor — Health & Storage Diagnostic Routes
 * GET /api/health
 * GET /api/health/storage
 */

import { createSuccessResponse } from '../utils/response.js';
import { CONFIG_DEFAULTS } from '../config/constants.js';
import { LeadRepository } from '../repositories/leadRepository.js';

export async function handleHealthRoute(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/$/, '');

  // 1. GET /api/health/storage — Storage repository health check
  if (pathname === '/api/health/storage') {
    const health = await LeadRepository.getHealth(env);
    return createSuccessResponse(health);
  }

  // 2. GET /api/health — System health check
  return createSuccessResponse({
    status: 'ok',
    environment: env.ENVIRONMENT || 'production',
    version: CONFIG_DEFAULTS.VERSION
  }, 'Nova Skills AI Worker operational');
}
