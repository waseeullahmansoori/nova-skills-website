/**
 * Nova Skills Platform — Assignment Service Interface
 * Version: 11.0.0 (Student Portal Assignment Service Stub)
 */

export class AssignmentService {
  static async getAssignments() {
    return [
      {
        id: 'assign-dm-1',
        title: 'Google Ads Search Campaign Audit & Budget Strategy',
        course: 'Master in Digital Marketing',
        dueDate: '2026-08-05',
        status: 'Pending',
        downloadUrl: '#',
        description: 'Audit the provided Google Ads account dataset, create 3 ad groups, and structure negative keyword lists.'
      },
      {
        id: 'assign-fs-1',
        title: 'RESTful API Server with Node.js & Express',
        course: 'Full-Stack Web Development',
        dueDate: '2026-07-28',
        status: 'Submitted',
        downloadUrl: '#',
        description: 'Build a CRUD REST API with JWT authentication and MongoDB schema validation.'
      },
      {
        id: 'assign-dm-2',
        title: 'SEO On-Page Audit & Schema Markup Implementation',
        course: 'Master in Digital Marketing',
        dueDate: '2026-07-20',
        status: 'Graded (95/100)',
        downloadUrl: '#',
        description: 'Perform complete On-Page SEO optimization and generate JSON-LD schema.'
      }
    ];
  }
}
