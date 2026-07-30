/**
 * Nova Skills Platform — Progress & Learning Engine Routes
 * GET /api/progress/:courseId
 * POST /api/progress/complete-lesson
 * GET /api/progress/stats
 */

import { ProgressService } from '../services/progress.js';
import { createSuccessResponse, createErrorResponse } from '../utils/response.js';
import { HTTP_STATUS } from '../config/constants.js';

export async function handleProgressRoute(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/$/, '');
  const method = request.method;

  // 1. GET /api/progress/stats — Student stats & badges
  if (method === 'GET' && pathname === '/api/progress/stats') {
    const userId = url.searchParams.get('userId') || 'usr_student_demo';
    const stats = await ProgressService.getStudentStats(userId, env);
    return createSuccessResponse(stats);
  }

  // 2. POST /api/progress/complete-lesson — Mark lesson complete
  if (method === 'POST' && (pathname === '/api/progress/complete-lesson' || pathname === '/api/progress/complete')) {
    let body;
    try { body = await request.json(); } catch(e) {
      return createErrorResponse('Invalid JSON payload body', HTTP_STATUS.BAD_REQUEST);
    }

    const { userId = 'usr_student_demo', courseId = 'course-dm-career', lessonId } = body;
    if (!lessonId) {
      return createErrorResponse('Lesson ID is required', HTTP_STATUS.BAD_REQUEST);
    }

    const updated = await ProgressService.markLessonComplete(userId, courseId, lessonId, env);
    return createSuccessResponse({
      progress: updated,
      message: 'Lesson marked complete! +50 XP awarded 🎉'
    });
  }

  // 3. GET /api/progress/:courseId — Course progress metrics
  if (method === 'GET' && pathname.startsWith('/api/progress')) {
    const parts = pathname.split('/');
    const courseId = parts[3] || 'course-dm-career';
    const userId = url.searchParams.get('userId') || 'usr_student_demo';

    const progress = await ProgressService.calculateCourseProgress(userId, courseId, env);
    return createSuccessResponse({ progress });
  }

  return createErrorResponse('Progress endpoint method not allowed', HTTP_STATUS.METHOD_NOT_ALLOWED);
}
