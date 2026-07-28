/**
 * Route Protection Middleware for Supabase Auth MVP
 * Validates Bearer Session Token and user role (Admin / Student)
 */

import { SupabaseAuthHelper } from './authHelper.js';

export async function protectRoute(request, requiredRole = null, env, config) {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (!token) {
    return {
      authorized: false,
      status: 401,
      error: 'Missing Authorization header or Bearer token.'
    };
  }

  const authHelper = new SupabaseAuthHelper(env, config);

  if (!authHelper.isConfigured()) {
    // Simulated token pass for dev testing
    return {
      authorized: true,
      user: { id: 'usr-simulated-01', email: 'user@novaskills.in', role: requiredRole || 'Student' }
    };
  }

  try {
    const response = await fetch(`${authHelper.supabaseUrl}/auth/v1/user`, {
      method: 'GET',
      headers: authHelper.getHeaders(token)
    });

    if (!response.ok) {
      return { authorized: false, status: 401, error: 'Invalid or expired session token.' };
    }

    const userData = await response.json();
    const userRole = userData.user_metadata?.role || 'Student';

    if (requiredRole && userRole !== requiredRole && userRole !== 'Admin') {
      return { authorized: false, status: 403, error: `Access denied. ${requiredRole} role required.` };
    }

    return {
      authorized: true,
      user: {
        id: userData.id,
        email: userData.email,
        role: userRole
      }
    };

  } catch (err) {
    return { authorized: false, status: 500, error: `Session verification error: ${err.message}` };
  }
}
