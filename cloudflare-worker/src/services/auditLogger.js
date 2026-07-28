/**
 * Audit Logger Service
 * Logs key platform events (Login, Logout, Student Created, Student Updated, Student Disabled, Course Created, Course Updated, Course Archived, Settings Updated)
 */

import { SupabaseWorkerClient } from '../supabase/client.js';

const auditBuffer = [
  {
    id: 'log-01',
    user_id: 'usr-admin-01',
    user_role: 'Admin',
    action: 'Login',
    entity_type: 'Auth',
    entity_id: null,
    description: 'Admin user logged in successfully',
    ip_address: '127.0.0.1',
    user_agent: 'Mozilla/5.0',
    created_at: new Date().toISOString()
  },
  {
    id: 'log-02',
    user_id: 'usr-admin-01',
    user_role: 'Admin',
    action: 'Student Created',
    entity_type: 'Student',
    entity_id: null,
    description: 'Created student profile for STU-1001 (Rohan Verma)',
    ip_address: '127.0.0.1',
    user_agent: 'Mozilla/5.0',
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'log-03',
    user_id: 'usr-admin-01',
    user_role: 'Admin',
    action: 'Settings Updated',
    entity_type: 'Settings',
    entity_id: null,
    description: 'Updated platform support contact & tagline settings',
    ip_address: '127.0.0.1',
    user_agent: 'Mozilla/5.0',
    created_at: new Date(Date.now() - 7200000).toISOString()
  }
];

export async function logAuditEvent({ userId, userRole = 'Admin', action, entityType, entityId, description, ipAddress = '127.0.0.1', userAgent = 'Unknown' }, env, config) {
  const entry = {
    id: `log-${Date.now()}`,
    user_id: userId || 'system',
    user_role: userRole,
    action: action,
    entity_type: entityType,
    entity_id: entityId || null,
    description: description,
    ip_address: ipAddress,
    user_agent: userAgent,
    created_at: new Date().toISOString()
  };

  auditBuffer.unshift(entry);

  const client = new SupabaseWorkerClient(env, config);
  if (client.isConfigured()) {
    try {
      const builder = await client.from('audit_logs');
      await builder.insert(entry);
    } catch (err) {
      console.warn('Error persisting audit log to Supabase:', err.message);
    }
  }

  return entry;
}

export async function getAuditLogs(env, config) {
  const client = new SupabaseWorkerClient(env, config);
  if (client.isConfigured()) {
    try {
      const builder = await client.from('audit_logs');
      const result = await builder.select('*');
      if (result.data && result.data.length > 0) {
        return result.data;
      }
    } catch (err) {
      console.warn('Error fetching audit logs from Supabase:', err.message);
    }
  }
  return auditBuffer;
}
