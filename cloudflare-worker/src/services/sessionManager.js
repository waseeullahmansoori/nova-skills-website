/**
 * Session Management & Token Verification Module
 */

const activeSessions = new Map();
const failedLoginAttempts = new Map();

export function createSessionToken(user, request) {
  const token = `ns_session_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  const clientIP = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || '127.0.0.1';
  const userAgent = request.headers.get('User-Agent') || 'Unknown Browser';

  const session = {
    token: token,
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: Date.now(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    ipAddress: clientIP,
    userAgent: userAgent
  };

  activeSessions.set(token, session);
  return session;
}

export function verifySession(request) {
  const authHeader = request.headers.get('Authorization') || '';
  let token = '';

  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else {
    return { valid: false, error: 'Missing or invalid Authorization Bearer header.' };
  }

  if (!activeSessions.has(token)) {
    return { valid: false, error: 'Session expired or invalid.' };
  }

  const session = activeSessions.get(token);
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return { valid: false, error: 'Session expired. Please log in again.' };
  }

  return { valid: true, session: session };
}

export function invalidateSession(token) {
  if (activeSessions.has(token)) {
    activeSessions.delete(token);
    return true;
  }
  return false;
}

export function recordFailedLogin(email) {
  const key = (email || '').toLowerCase();
  const attempts = (failedLoginAttempts.get(key) || 0) + 1;
  failedLoginAttempts.set(key, attempts);

  if (attempts >= 5) {
    return { locked: true, message: 'Account temporarily locked due to 5 failed login attempts. Try again in 15 minutes.' };
  }
  return { locked: false, attempts: attempts };
}

export function resetFailedLogin(email) {
  failedLoginAttempts.delete((email || '').toLowerCase());
}
