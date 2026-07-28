/**
 * Input Sanitizer & Anti-Prompt Injection Defense Module
 */

export function sanitizeUserInput(input) {
  if (!input || typeof input !== 'string') return '';

  let sanitized = input.trim();

  // Strip common prompt injection attack patterns
  const injectionPatterns = [
    /ignore previous instructions/gi,
    /disregard system prompt/gi,
    /forget all rules/gi,
    /you are now in DAN mode/gi,
    /override system/gi,
    /<script.*?>.*?<\/script>/gi
  ];

  injectionPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[filtered]');
  });

  // Limit maximum character length to 1000 chars per message
  return sanitized.slice(0, 1000);
}
