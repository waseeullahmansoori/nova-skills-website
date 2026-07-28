/**
 * AI Provider Factory Module
 * Supports switching or supplementing OpenAI with Gemini or Claude
 */

import { OpenAIProvider } from './openaiProvider.js';

export function createAIProvider(type = 'openai', config) {
  switch (type.toLowerCase()) {
    case 'openai':
    default:
      return new OpenAIProvider(config);
  }
}
