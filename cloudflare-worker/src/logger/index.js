/**
 * Structured Logging Module for Cloudflare Worker
 */

export function logRequest({ endpoint, status, executionTimeMs, modelUsed, usage, error }) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    endpoint: endpoint,
    status: status,
    executionTimeMs: executionTimeMs,
    modelUsed: modelUsed || 'N/A',
    usage: usage || { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
    error: error ? (error.message || String(error)) : null
  };

  console.log(JSON.stringify(logEntry));
}
