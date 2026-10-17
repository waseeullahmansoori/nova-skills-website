/**
 * Cloudflare Pages Edge Middleware for Course-Specific Initial HTML
 * Intercepts /course-detail and /course-detail.html to serve course-specific initial HTML
 * before client JavaScript execution, preserving existing public URLs.
 */

import { RENDERED_COURSES, ALL_VALID_COURSE_IDS, COURSE_ALIASES, COURSE_NOT_FOUND_HTML } from './_rendered_courses.js';

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/$/, '');

  // Intercept /course-detail and /course-detail.html
  if (pathname === '/course-detail' || pathname === '/course-detail.html') {
    const rawId = (url.searchParams.get('id') || url.searchParams.get('course') || '').trim();

    if (rawId) {
      const id = COURSE_ALIASES[rawId] || rawId;

      // 1. If pre-rendered, return course-specific HTML with status 200 OK
      if (RENDERED_COURSES[id]) {
        return new Response(RENDERED_COURSES[id], {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=0, must-revalidate',
            'X-Robots-Tag': 'index, follow'
          }
        });
      }

      // 2. If unknown/invalid course ID, return 404 Not Found response
      if (!ALL_VALID_COURSE_IDS.has(id)) {
        return new Response(COURSE_NOT_FOUND_HTML, {
          status: 404,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'X-Robots-Tag': 'noindex, follow'
          }
        });
      }
    } else {
      // If no ID is specified, default flagship course: dm-mastery
      if (RENDERED_COURSES['dm-mastery']) {
        return new Response(RENDERED_COURSES['dm-mastery'], {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=0, must-revalidate',
            'X-Robots-Tag': 'index, follow'
          }
        });
      }
    }

    // 3. For any other course ID, pass through to shared client template
    return context.next();
  }

  return context.next();
}
