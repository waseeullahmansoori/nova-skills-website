/**
 * Nova Skills AI Career Advisor Worker — Request Logger Middleware
 */

export function logRequest(request) {
  const url = new URL(request.url);
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${request.method} ${url.pathname}`);
}
