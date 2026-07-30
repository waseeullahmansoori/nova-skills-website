/**
 * Nova Skills Platform — Progress Service Interface
 * Version: 12.0.0 (Course Progress Tracking & Gamification API Client)
 */

export class ProgressService {
  static async getCourseProgress(courseId = 'course-dm-career') {
    try {
      const res = await fetch(`/api/progress/${courseId}`);
      if (res.ok) {
        const data = await res.json();
        return data.progress;
      }
    } catch (e) {}

    // Fallback default
    return {
      progressPercentage: 60,
      completedLessonsCount: 7,
      totalLessonsCount: 20,
      remainingLessonsCount: 13,
      estimatedHoursRemaining: 7.8,
      xpPoints: 850,
      streakDays: 7,
      completedLessonIds: ['les-1-1', 'les-1-2', 'les-1-3', 'les-1-4', 'les-1-5', 'les-2-1', 'les-2-2']
    };
  }

  static async markLessonComplete(courseId, lessonId) {
    try {
      const res = await fetch('/api/progress/complete-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, lessonId })
      });
      if (res.ok) {
        const data = await res.json();
        return data.progress;
      }
    } catch (e) {}

    return null;
  }

  static async getStudentStats() {
    try {
      const res = await fetch('/api/progress/stats');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

    return {
      totalXp: 850,
      streakDays: 7,
      completedLessonsCount: 7,
      badges: [
        { id: 'FIRST_LESSON', title: 'First Steps 🚀', description: 'Completed first video lesson' },
        { id: 'FIRST_MODULE', title: 'Module Master 🏆', description: 'Completed an entire module' },
        { id: 'STREAK_7', title: '7-Day Flame 🔥', description: 'Maintained 7 consecutive learning days' }
      ]
    };
  }
}
