/**
 * In-Memory Response Caching Module for AI Requests
 * Prevents duplicate OpenAI calls within a configurable time window (e.g. 5 minutes)
 */

const cacheStore = new Map();

export function getCachedAIResponse(cacheKey) {
  if (!cacheStore.has(cacheKey)) return null;

  const item = cacheStore.get(cacheKey);
  const now = Date.now();

  if (now > item.expiresAt) {
    cacheStore.delete(cacheKey);
    return null;
  }

  return item.data;
}

export function setCachedAIResponse(cacheKey, data, ttlSeconds = 300) {
  const expiresAt = Date.now() + (ttlSeconds * 1000);
  cacheStore.set(cacheKey, {
    data: data,
    expiresAt: expiresAt
  });

  // Garbage collect if cache grows large
  if (cacheStore.size > 2000) {
    const now = Date.now();
    for (const [k, v] of cacheStore.entries()) {
      if (now > v.expiresAt) cacheStore.delete(k);
    }
  }
}

export function generateCacheKey(endpoint, leadPayload) {
  const keyStr = `${endpoint}:${leadPayload.leadId || ''}:${leadPayload.mobile || ''}:${leadPayload.course || ''}:${leadPayload.message || ''}`;
  let hash = 0;
  for (let i = 0; i < keyStr.length; i++) {
    hash = ((hash << 5) - hash) + keyStr.charCodeAt(i);
    hash |= 0;
  }
  return `ai_cache_${hash}`;
}
