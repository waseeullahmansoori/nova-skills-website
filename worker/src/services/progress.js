/**
 * Nova Skills Platform — Course Progress & Learning Engine Service
 * Version: 12.0.0 (Progress Engine, XP System & Gamification)
 */

import { XP_RULES } from '../config/constants.js';
import { ProgressRepository } from '../repositories/progressRepository.js';

// Curriculum structure definitions
const COURSE_CURRICULUM = {
  'course-dm-career': {
    totalLessons: 20,
    estimatedTotalHours: 40,
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Foundations of Digital & Performance Marketing',
        totalLessons: 5,
        lessons: [
          { id: 'les-1-1', title: 'Lesson 1.1 — Marketing Funnels & Customer Lifecycle', duration: '25 mins' },
          { id: 'les-1-2', title: 'Lesson 1.2 — Audience Targeting & Persona Creation', duration: '30 mins' },
          { id: 'les-1-3', title: 'Lesson 1.3 — Landing Page Conversion Architecture', duration: '35 mins' },
          { id: 'les-1-4', title: 'Lesson 1.4 — Copywriting for High-Converting Ads', duration: '20 mins' },
          { id: 'les-1-5', title: 'Lesson 1.5 — Module 1 Capstone Quiz & Assignment', duration: '40 mins' }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: Search Engine Optimization (SEO)',
        totalLessons: 5,
        lessons: [
          { id: 'les-2-1', title: 'Lesson 2.1 — Keyword Research & Search Intent', duration: '30 mins' },
          { id: 'les-2-2', title: 'Lesson 2.2 — Technical & On-Page SEO Audit', duration: '45 mins' },
          { id: 'les-2-3', title: 'Lesson 2.3 — Schema Markup & Structured Data', duration: '35 mins' },
          { id: 'les-2-4', title: 'Lesson 2.4 — Backlink Building & Authority Score', duration: '40 mins' },
          { id: 'les-2-5', title: 'Lesson 2.5 — SEO Audit Assignment', duration: '50 mins' }
        ]
      },
      {
        id: 'mod-3',
        title: 'Module 3: Google Ads & Performance Marketing',
        totalLessons: 10,
        lessons: [
          { id: 'les-3-1', title: 'Lesson 3.1 — Google Search Campaign Architecture', duration: '30 mins' },
          { id: 'les-3-2', title: 'Lesson 3.2 — Keyword Match Types & Negative Lists', duration: '25 mins' },
          { id: 'les-3-3', title: 'Lesson 3.3 — Bidding Strategies & Smart Bidding', duration: '40 mins' },
          { id: 'les-3-4', title: 'Lesson 3.4 — Conversion Value & GA4 Event Tracking', duration: '35 mins' }
        ]
      }
    ]
  }
};

export class ProgressService {
  /**
   * Calculates course progress metrics for a student
   */
  static async calculateCourseProgress(userId, courseId, env = {}) {
    const progressRecord = await ProgressRepository.getProgress(userId, courseId, env);
    const curriculum = COURSE_CURRICULUM[courseId] || COURSE_CURRICULUM['course-dm-career'];

    const completedLessonIds = progressRecord.completedLessonIds || ['les-1-1', 'les-1-2', 'les-1-3', 'les-1-4', 'les-1-5', 'les-2-1', 'les-2-2'];
    const completedCount = completedLessonIds.length;
    const totalCount = curriculum.totalLessons;
    const progressPercentage = Math.round((completedCount / totalCount) * 100);

    const remainingLessons = totalCount - completedCount;
    const estimatedHoursRemaining = Math.round((remainingLessons * 0.6) * 10) / 10;

    return {
      userId: userId,
      courseId: courseId,
      progressPercentage: progressPercentage,
      completedLessonsCount: completedCount,
      totalLessonsCount: totalCount,
      remainingLessonsCount: remainingLessons,
      estimatedHoursRemaining: estimatedHoursRemaining,
      xpPoints: progressRecord.xpPoints || 850,
      streakDays: progressRecord.streakDays || 7,
      completedLessonIds: completedLessonIds,
      curriculum: curriculum.modules.map(mod => ({
        ...mod,
        completedCount: mod.lessons.filter(l => completedLessonIds.includes(l.id)).length,
        isCompleted: mod.lessons.every(l => completedLessonIds.includes(l.id))
      }))
    };
  }

  /**
   * Marks a lesson as complete and awards XP points
   */
  static async markLessonComplete(userId, courseId, lessonId, env = {}) {
    const progressRecord = await ProgressRepository.getProgress(userId, courseId, env);

    if (!progressRecord.completedLessonIds.includes(lessonId)) {
      progressRecord.completedLessonIds.push(lessonId);
      progressRecord.xpPoints = (progressRecord.xpPoints || 850) + XP_RULES.LESSON_COMPLETE;
    }

    const saved = await ProgressRepository.saveProgress(progressRecord, env);
    return await this.calculateCourseProgress(userId, courseId, env);
  }

  /**
   * Returns student overall learning stats
   */
  static async getStudentStats(userId, env = {}) {
    return await ProgressRepository.getStudentStats(userId, env);
  }
}
