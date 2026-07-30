/**
 * Nova Skills Platform — Communication & Automation Repository
 * Version: 14.0.0 (Logs, Queue, and Notification Storage)
 * 
 * Supports local memory cache and Cloudflare KV (env.AI_COMMUNICATIONS).
 */

const IN_MEMORY_LOGS = [];
const IN_MEMORY_NOTIFICATIONS = new Map();

export class CommunicationRepository {
  /**
   * Logs a sent or queued communication event
   */
  static async logCommunication(logEntry, env = {}) {
    const timestamp = new Date().toISOString();
    const entry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: timestamp,
      channel: logEntry.channel || 'EMAIL',
      event: logEntry.event || 'GENERAL_NOTICE',
      recipient: logEntry.recipient || 'student@example.com',
      subject: logEntry.subject || logEntry.title || '',
      status: logEntry.status || 'SENT',
      durationMs: logEntry.durationMs || 45,
      retries: logEntry.retries || 0,
      createdAt: timestamp
    };

    IN_MEMORY_LOGS.unshift(entry);
    if (IN_MEMORY_LOGS.length > 500) IN_MEMORY_LOGS.pop();

    if (env.AI_COMMUNICATIONS && typeof env.AI_COMMUNICATIONS.put === 'function') {
      try {
        await env.AI_COMMUNICATIONS.put(`log:${entry.id}`, JSON.stringify(entry));
      } catch (e) {
        console.warn('[CommunicationRepository] KV Write Error:', e.message);
      }
    }

    return entry;
  }

  /**
   * Retrieves communication logs
   */
  static async getLogs(filter = {}) {
    let logs = [...IN_MEMORY_LOGS];
    if (filter.channel) {
      logs = logs.filter(l => l.channel === filter.channel);
    }
    if (filter.status) {
      logs = logs.filter(l => l.status === filter.status);
    }
    return logs;
  }

  /**
   * Saves an in-app student notification
   */
  static async saveNotification(notif, env = {}) {
    const timestamp = new Date().toISOString();
    const notification = {
      id: notif.id || `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: notif.userId || 'usr_student_demo',
      category: notif.category || 'General',
      title: notif.title || 'Notification',
      message: notif.message || '',
      isRead: false,
      timestamp: timestamp,
      createdAt: timestamp
    };

    const userNotifs = IN_MEMORY_NOTIFICATIONS.get(notification.userId) || [];
    userNotifs.unshift(notification);
    IN_MEMORY_NOTIFICATIONS.set(notification.userId, userNotifs);

    return notification;
  }

  /**
   * Gets in-app notifications for a student
   */
  static async getStudentNotifications(userId = 'usr_student_demo') {
    const list = IN_MEMORY_NOTIFICATIONS.get(userId) || [
      {
        id: 'notif-1',
        userId: userId,
        category: 'Courses',
        title: '📖 Module 3 Video Released',
        message: 'Google Ads & Performance Marketing Module 3 is now live in your student portal.',
        isRead: false,
        timestamp: new Date().toISOString()
      },
      {
        id: 'notif-2',
        userId: userId,
        category: 'Assignments',
        title: '⏰ Assignment Due Tomorrow',
        message: 'Google Ads Search Campaign Strategy assignment is due Aug 05.',
        isRead: false,
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'notif-3',
        userId: userId,
        category: 'Certificates',
        title: '📜 Certificate Verification Ready',
        message: 'Your official certificate NS-DM-2026-000124 is verified and available for download.',
        isRead: true,
        timestamp: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    return list;
  }
}
