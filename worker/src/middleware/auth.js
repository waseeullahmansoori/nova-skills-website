/**
 * Nova Skills Platform — Auth Middleware
 * Version: 10.0.0 (Route Protection & Role Authorization)
 */

import { AuthService } from '../services/auth.js';
import { createErrorResponse } from '../utils/response.js';
import { HTTP_STATUS } from '../config/constants.js';

export async function authenticateToken(request, env) {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  if (!authHeader) {
    return { isAuthenticated: false, error: 'Authentication token required', status: HTTP_STATUS.UNAUTHORIZED };
  }

  const result = await AuthService.validateSession(authHeader, env);
  if (!result) {
    return { isAuthenticated: false, error: 'Invalid or expired session token', status: HTTP_STATUS.UNAUTHORIZED };
  }

  return { isAuthenticated: true, user: result.user, session: result.session };
}

export function requireRole(allowedRoles = []) {
  return (user) => {
    if (!user || !user.role) return false;
    if (allowedRoles.length === 0) return true;
    return allowedRoles.includes(user.role);
  };
}
