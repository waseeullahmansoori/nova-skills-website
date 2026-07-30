/**
 * Nova Skills AI Career Advisor — Dashboard Routes
 * GET /api/dashboard
 * GET /api/dashboard/stats
 */

import { DashboardService } from '../services/dashboard.js';
import { createSuccessResponse, createErrorResponse } from '../utils/response.js';
import { HTTP_STATUS } from '../config/constants.js';

export async function handleDashboardRoute(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/$/, '');

  if (request.method === 'GET' && (pathname === '/api/dashboard' || pathname === '/api/dashboard/stats')) {
    const stats = await DashboardService.getStats(env);
    return createSuccessResponse(stats);
  }

  return createErrorResponse('Dashboard endpoint method not allowed', HTTP_STATUS.METHOD_NOT_ALLOWED);
}
