/**
 * Nova Skills Platform — Announcement Service Interface
 * Version: 11.0.0 (Student Portal Announcement Service Stub)
 */

export class AnnouncementService {
  static async getAnnouncements() {
    return [
      {
        id: 'ann-1',
        title: '🔥 Exclusive Live Masterclass: AI Tools for Marketers & Coders',
        category: 'Live Event',
        date: '2026-08-02',
        pinned: true,
        description: 'Join industry experts this Saturday at 05:00 PM IST for a live interactive masterclass on leveraging ChatGPT & Claude for rapid workflow automation.'
      },
      {
        id: 'ann-2',
        title: '💼 Hiring Drive: 15+ Tech & Marketing Companies Recruiting',
        category: 'Placement Alert',
        date: '2026-07-29',
        pinned: true,
        description: 'Nova Placement Cell is hosting a campus hiring drive for Full-Stack Developers and Performance Marketers. Submit your portfolio by Friday.'
      },
      {
        id: 'ann-3',
        title: '📚 Updated Curriculum Resources Uploaded',
        category: 'Course Notice',
        date: '2026-07-25',
        pinned: false,
        description: 'New cheatsheets for Figma Design Systems and GA4 Analytics custom reports have been uploaded to your downloads section.'
      }
    ];
  }
}
