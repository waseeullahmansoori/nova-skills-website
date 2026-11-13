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

    // 1. If no course ID is specified, redirect permanently to course catalog
    if (!rawId) {
      return Response.redirect('https://novaskills.in/courses', 301);
    }

    // 2. Resolve alias or legacy parameter
    const id = COURSE_ALIASES[rawId] || rawId;
    const hasLegacyCourseParam = url.searchParams.has('course');
    const isAliased = Boolean(COURSE_ALIASES[rawId] && COURSE_ALIASES[rawId] !== rawId);
    const isCleanPath = pathname === '/course-detail.html';

    // 3. Permanent 301 redirect if using legacy parameter, alias ID, or path without .html
    if (hasLegacyCourseParam || isAliased || !isCleanPath) {
      const redirectUrl = new URL('https://novaskills.in/course-detail.html');
      redirectUrl.searchParams.set('id', id);
      for (const [key, value] of url.searchParams.entries()) {
        if (key !== 'id' && key !== 'course') {
          redirectUrl.searchParams.set(key, value);
        }
      }
      return Response.redirect(redirectUrl.toString(), 301);
    }

    // 4. Environment-specific robots tag (production index vs preview noindex)
    const isProduction = url.hostname === 'novaskills.in';
    const robotsTag = isProduction ? 'index, follow' : 'noindex, nofollow';

    // 5. If pre-rendered, return course-specific HTML with status 200 OK
    if (RENDERED_COURSES[id]) {
      return new Response(RENDERED_COURSES[id], {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=0, must-revalidate',
          'X-Robots-Tag': robotsTag
        }
      });
    }

    // 6. If unknown/invalid course ID, return 404 Not Found response
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

    // 7. For any other course ID, pass through to shared client template
    return context.next();
  }

  return context.next();
}
