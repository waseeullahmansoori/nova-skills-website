/**
 * Abstract Base Provider for AI Models
 * Extensible for OpenAI, Gemini, Claude, and Azure OpenAI
 */

export class BaseAIProvider {
  constructor(config) {
    this.config = config;
  }

  async generateCompletion(messages, options = {}) {
    throw new Error('generateCompletion method must be implemented by provider.');
  }
}
