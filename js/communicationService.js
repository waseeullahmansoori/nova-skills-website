/**
 * Nova Skills Platform — Communication Service Interface
 * Version: 14.0.0 (Notifications & Communication Client)
 */

export class CommunicationService {
  static async getNotifications(userId = 'usr_student_demo') {
    try {
      const res = await fetch(`/api/notifications?userId=${userId}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

    return {
      unreadCount: 2,
      notifications: [
        { id: 'n1', category: 'Courses', title: '📖 Module 3 Released', message: 'Google Ads Module 3 is available.', isRead: false },
        { id: 'n2', category: 'Assignments', title: '⏰ Assignment Reminder', message: 'Campaign Audit due Aug 05.', isRead: false }
      ]
    };
  }

  static async getCommunicationLogs() {
    try {
      const res = await fetch('/api/communications/logs');
      if (res.ok) {
        const data = await res.json();
        return data.logs || [];
      }
    } catch (e) {}

    return [];
  }
}
