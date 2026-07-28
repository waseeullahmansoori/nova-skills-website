/**
 * Audit Trail & Security Event Logger
 */

const securityLogsStore = [];

export function logSecurityEvent({ user, role, action, status, ipAddress, userAgent, details }) {
  const logEntry = {
    id: `LOG-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    user: user || 'Anonymous',
    role: role || 'Guest',
    action: action || 'UNKNOWN_ACTION',
    status: status || 'SUCCESS',
    ipAddress: ipAddress || 'Unknown IP',
    userAgent: userAgent || 'Unknown Agent',
    details: details || ''
  };

  securityLogsStore.push(logEntry);

  if (securityLogsStore.length > 5000) {
    securityLogsStore.shift();
  }

  console.log(`[SECURITY AUDIT] ${logEntry.timestamp} | ${logEntry.action} | User: ${logEntry.user} (${logEntry.role}) | Status: ${logEntry.status}`);
}

export function getSecurityLogs(limit = 100) {
  return securityLogsStore.slice(-limit).reverse();
}
