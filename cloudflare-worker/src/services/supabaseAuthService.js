/**
 * Core Enterprise Identity Service (Supabase Auth Backend)
 */

import { SupabaseAuthClient } from '../supabase/authClient.js';
import { logSecurityEvent } from './auditLogger.js';
import { ROLES } from '../security/rbacMatrix.js';

export async function registerSupabaseUser({ email, password, name, role = ROLES.STUDENT, mobile, department }, env, config, request) {
  const authClient = new SupabaseAuthClient(env, config);
  const clientIP = request.headers.get('CF-Connecting-IP') || '127.0.0.1';
  const userAgent = request.headers.get('User-Agent') || 'Unknown';

  const authResult = await authClient.signUp(email, password, {
    full_name: name,
    role: role,
    mobile: mobile,
    department: department || 'Academy'
  });

  logSecurityEvent({
    user: email,
    role: role,
    action: 'USER_REGISTERED',
    status: 'SUCCESS',
    ipAddress: clientIP,
    userAgent: userAgent,
    details: 'Registered user in Supabase Auth'
  });

  return {
    success: true,
    user: {
      id: authResult.user?.id || `usr-${Date.now()}`,
      email: email,
      name: name,
      role: role
    },
    simulated: authResult.simulated || false
  };
}

export async function loginSupabaseUser(email, password, env, config, request) {
  const authClient = new SupabaseAuthClient(env, config);
  const clientIP = request.headers.get('CF-Connecting-IP') || '127.0.0.1';
  const userAgent = request.headers.get('User-Agent') || 'Unknown';

  try {
    const authResult = await authClient.signInWithPassword(email, password);

    logSecurityEvent({
      user: email,
      role: authResult.user?.role || 'User',
      action: 'SUPABASE_LOGIN_SUCCESS',
      status: 'SUCCESS',
      ipAddress: clientIP,
      userAgent: userAgent,
      details: 'Authenticated via Supabase Auth'
    });

    return {
      success: true,
      user: authResult.user,
      accessToken: authResult.access_token,
      expiresIn: authResult.expires_in || 3600,
      simulated: authResult.simulated || false
    };

  } catch (err) {
    logSecurityEvent({
      user: email,
      role: 'Guest',
      action: 'SUPABASE_LOGIN_FAILED',
      status: 'FAILURE',
      ipAddress: clientIP,
      userAgent: userAgent,
      details: err.message
    });
    throw err;
  }
}

export async function resetSupabasePassword(email, env, config, request) {
  const authClient = new SupabaseAuthClient(env, config);
  const result = await authClient.resetPassword(email);

  logSecurityEvent({
    user: email,
    role: 'Guest',
    action: 'PASSWORD_RESET_REQUESTED',
    status: 'SUCCESS',
    ipAddress: request.headers.get('CF-Connecting-IP') || '127.0.0.1',
    userAgent: request.headers.get('User-Agent') || 'Unknown'
  });

  return {
    success: true,
    message: 'Password reset recovery email dispatched.',
    simulated: result.simulated || false
  };
}
