/**
 * Nova Skills Platform — Course Service Interface
 * Version: 11.0.0 (Student Portal Course Service Stub)
 */

export class CourseService {
  static async getEnrolledCourses() {
    return [
      {
        id: 'course-dm-career',
        name: 'Master in Digital Marketing & Performance Marketing',
        category: 'Digital Marketing Academy',
        progress: 60,
        currentModule: 'Module 3: Google Ads & Performance Marketing',
        trainer: 'Priya Mehta (Ex-Google Marketer)',
        duration: '12 Months',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
        nextLesson: 'Lesson 3.4 — Setting up Conversion Value Tracking'
      },
      {
        id: 'course-fullstack-dev',
        name: 'Full-Stack Web Development (MERN Stack)',
        category: 'Programming Academy',
        progress: 35,
        currentModule: 'Module 2: JavaScript ES6+ & Async Programming',
        trainer: 'Aman Verma (Senior Tech Lead)',
        duration: '12 Months',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
        nextLesson: 'Lesson 2.2 — Promises, Async/Await & Event Loop'
      }
    ];
  }

  static async getCourseDetails(courseId) {
    const courses = await this.getEnrolledCourses();
    return courses.find(c => c.id === courseId) || courses[0];
  }
}
