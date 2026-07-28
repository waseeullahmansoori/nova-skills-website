/**
 * In-Memory Sliding Window Rate Limiter for Cloudflare Worker
 */

const rateLimitMap = new Map();

export function checkRateLimit(request, limitPerMinute = 30) {
  const clientIP = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown-ip';
  const now = Date.now();
  const windowMs = 60 * 1000;

  if (!rateLimitMap.has(clientIP)) {
    rateLimitMap.set(clientIP, []);
  }

  const timestamps = rateLimitMap.get(clientIP).filter(time => now - time < windowMs);

  if (timestamps.length >= limitPerMinute) {
    return { limited: true, error: 'Rate limit exceeded. Please wait 1 minute before retrying.' };
  }

  timestamps.push(now);
  rateLimitMap.set(clientIP, timestamps);

  // Periodically clean up stale entries
  if (rateLimitMap.size > 10000) {
    rateLimitMap.clear();
  }

  return { limited: false };
}
