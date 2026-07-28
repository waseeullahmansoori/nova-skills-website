/**
 * Enterprise Authentication & Authorization Service
 */

import { ROLES, ROLE_PERMISSION_MATRIX, hasPermission } from '../security/rbacMatrix.js';
import { createSessionToken, verifySession, recordFailedLogin, resetFailedLogin, invalidateSession } from './sessionManager.js';
import { logSecurityEvent } from './auditLogger.js';

// Seed User Accounts
const USERS_DB = [
  {
    id: 'USR-001',
    email: 'admin@novaskills.in',
    name: 'Super Admin',
    role: ROLES.SUPER_ADMIN,
    passwordHash: 'admin123' // In production, replace with bcrypt/argon2 hash
  },
  {
    id: 'USR-002',
    email: 'counsellor@novaskills.in',
    name: 'Senior Counsellor',
    role: ROLES.COUNSELLOR,
    passwordHash: 'counsellor123'
  },
  {
    id: 'USR-003',
    email: 'marketing@novaskills.in',
    name: 'Marketing Lead',
    role: ROLES.MARKETING_EXECUTIVE,
    passwordHash: 'marketing123'
  }
];

export async function authenticateUser(email, password, request) {
  const clientIP = request.headers.get('CF-Connecting-IP') || '127.0.0.1';
  const userAgent = request.headers.get('User-Agent') || 'Unknown';

  const user = USERS_DB.find(u => u.email.toLowerCase() === (email || '').toLowerCase().trim());

  if (!user || user.passwordHash !== password) {
    const lockStatus = recordFailedLogin(email);
    logSecurityEvent({
      user: email,
      role: 'Guest',
      action: 'LOGIN_FAILED',
      status: 'FAILURE',
      ipAddress: clientIP,
      userAgent: userAgent,
      details: lockStatus.locked ? lockStatus.message : 'Invalid credentials'
    });

    if (lockStatus.locked) {
      throw new Error(lockStatus.message);
    }
    throw new Error('Invalid email or password.');
  }

  resetFailedLogin(email);

  const session = createSessionToken(user, request);

  logSecurityEvent({
    user: user.email,
    role: user.role,
    action: 'LOGIN_SUCCESS',
    status: 'SUCCESS',
    ipAddress: clientIP,
    userAgent: userAgent,
    details: 'User authenticated successfully'
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    sessionToken: session.token,
    expiresAt: session.expiresAt
  };
}

export function authorizeRequest(request, requiredPermission) {
  const sessionResult = verifySession(request);

  if (!sessionResult.valid) {
    return { authorized: false, status: 401, error: sessionResult.error };
  }

  const { session } = sessionResult;

  if (requiredPermission && !hasPermission(session.role, requiredPermission)) {
    logSecurityEvent({
      user: session.email,
      role: session.role,
      action: 'PERMISSION_DENIED',
      status: 'FAILURE',
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      details: `Tried accessing permission: ${requiredPermission}`
    });
    return { authorized: false, status: 403, error: `Forbidden: Role '${session.role}' lacks permission '${requiredPermission}'.` };
  }

  return { authorized: true, session: session };
}

export function getAllUsers() {
  return USERS_DB.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role }));
}

export function getRolePermissionsMatrix() {
  return ROLE_PERMISSION_MATRIX;
}
