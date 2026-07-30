/**
 * Nova Skills Platform — Student Service Interface
 * Version: 11.0.0 (Student Portal Service Stub)
 */

export class StudentService {
  static async getProfile() {
    const rawUser = localStorage.getItem('novaskills_user');
    if (rawUser) {
      try { return JSON.parse(rawUser); } catch(e) {}
    }

    return {
      userId: 'usr_student_demo',
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'rahul.sharma@example.com',
      phone: '9876543210',
      role: 'Student',
      avatar: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=0599a8&color=fff',
      registrationDate: '2026-07-15T10:00:00.000Z',
      streakDays: 7,
      enrolledCoursesCount: 2
    };
  }

  static async updatePreferences(preferences = {}) {
    localStorage.setItem('novaskills_preferences', JSON.stringify(preferences));
    return { success: true, message: 'Preferences updated successfully' };
  }
}
