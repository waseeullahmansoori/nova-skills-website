/**
 * Nova Skills Platform — Auth Routes
 * POST /api/auth/register
 * POST /api/auth/login
 * POST /api/auth/logout
 * POST /api/auth/reset-password
 * GET /api/auth/me
 * POST /api/auth/refresh
 */

import { AuthService } from '../services/auth.js';
import { authenticateToken } from '../middleware/auth.js';
import { createSuccessResponse, createErrorResponse } from '../utils/response.js';
import { HTTP_STATUS } from '../config/constants.js';

export async function handleAuthRoute(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/$/, '');
  const method = request.method;

  // 1. POST /api/auth/register
  if (method === 'POST' && pathname === '/api/auth/register') {
    let body;
    try { body = await request.json(); } catch(e) {
      return createErrorResponse('Invalid JSON body payload', HTTP_STATUS.BAD_REQUEST);
    }

    const res = await AuthService.registerUser(body, env);
    if (!res.success) {
      return createErrorResponse(res.error, res.status || HTTP_STATUS.BAD_REQUEST);
    }

    return createSuccessResponse({ user: res.user, message: res.message }, HTTP_STATUS.CREATED);
  }

  // 2. POST /api/auth/login
  if (method === 'POST' && pathname === '/api/auth/login') {
    let body;
    try { body = await request.json(); } catch(e) {
      return createErrorResponse('Invalid JSON body payload', HTTP_STATUS.BAD_REQUEST);
    }

    const res = await AuthService.loginUser(body, env);
    if (!res.success) {
      return createErrorResponse(res.error, res.status || HTTP_STATUS.UNAUTHORIZED);
    }

    return createSuccessResponse({
      token: res.token,
      expiresAt: res.expiresAt,
      user: res.user,
      message: res.message
    });
  }

  // 3. POST /api/auth/logout
  if (method === 'POST' && pathname === '/api/auth/logout') {
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    await AuthService.logoutUser(authHeader);
    return createSuccessResponse({ message: 'Logged out successfully' });
  }

  // 4. GET /api/auth/me — Current User Profile
  if (method === 'GET' && pathname === '/api/auth/me') {
    const auth = await authenticateToken(request, env);
    if (!auth.isAuthenticated) {
      return createErrorResponse(auth.error, auth.status);
    }

    return createSuccessResponse({ user: auth.user });
  }

  // 5. POST /api/auth/refresh — Refresh Session
  if (method === 'POST' && pathname === '/api/auth/refresh') {
    const auth = await authenticateToken(request, env);
    if (!auth.isAuthenticated) {
      return createErrorResponse(auth.error, auth.status);
    }

    return createSuccessResponse({
      token: auth.session.token,
      user: auth.user,
      message: 'Session refreshed successfully'
    });
  }

  // 6. POST /api/auth/reset-password
  if (method === 'POST' && pathname === '/api/auth/reset-password') {
    let body;
    try { body = await request.json(); } catch(e) {
      return createErrorResponse('Invalid JSON body payload', HTTP_STATUS.BAD_REQUEST);
    }

    if (!body.email) {
      return createErrorResponse('Email address is required', HTTP_STATUS.BAD_REQUEST);
    }

    return createSuccessResponse({
      message: 'If an account exists with this email, a password reset link has been sent.'
    });
  }

  return createErrorResponse('Auth endpoint method not allowed', HTTP_STATUS.METHOD_NOT_ALLOWED);
}
