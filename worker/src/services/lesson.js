/**
 * Nova Skills Platform — Lesson Service Interface
 * Version: 12.0.0 (Lesson Metadata Accessor)
 */

export class LessonService {
  static async getLessonDetails(lessonId) {
    return {
      lessonId: lessonId,
      title: `Lesson ${lessonId} Overview`,
      duration: '35 mins',
      resources: [
        { name: 'Lecture Slides PDF', url: '#' },
        { name: 'Starter Code / Template', url: '#' }
      ]
    };
  }
}
