/**
 * Nova Skills AI Career Advisor — AI Service Interface
 * Integrates securely with OpenAI API via env.OPENAI_API_KEY, PromptService, Knowledge Base, and multi-turn Session Memory
 */

import { CONFIG_DEFAULTS, HTTP_STATUS } from '../config/constants.js';
import { PromptService } from './prompt.js';

export class AIService {
  /**
   * Generates chat completion response from OpenAI API with Knowledge Base recommendations and session memory
   * @param {string} userMessage - User query text
   * @param {Array} sessionHistory - Array of previous chat history turns
   * @param {Object} studentMemory - Active student memory profile object
   * @param {Object} env - Cloudflare Worker environment bindings
   * @returns {Promise<Object>} Formatted AI completion object
   */
  static async generateCompletion(userMessage, sessionHistory = [], studentMemory = {}, env = {}) {
    const apiKey = env.OPENAI_API_KEY;
    const model = env.OPENAI_MODEL || CONFIG_DEFAULTS.DEFAULT_MODEL;

    // 1. Fallback when OPENAI_API_KEY is not configured
    if (!apiKey) {
      console.warn('[AIService Warning] OPENAI_API_KEY is not configured in Worker environment. Returning local fallback.');
      return {
        text: "Backend ready for GPT integration. (API key not set in environment)",
        usage: { input_tokens: 0, output_tokens: 0 },
        isFallback: true,
        status: HTTP_STATUS.UNAUTHORIZED
      };
    }

    // 2. Assemble system prompt with Knowledge Base recommendations & FAQ facts
    const systemPrompt = PromptService.buildSystemPrompt(studentMemory, userMessage);
    const messages = PromptService.buildOpenAIMessages(systemPrompt, sessionHistory, userMessage);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG_DEFAULTS.TIMEOUT_MS);
    const startTime = Date.now();

    try {
      const response = await fetch(CONFIG_DEFAULTS.OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: CONFIG_DEFAULTS.TEMPERATURE,
          max_tokens: CONFIG_DEFAULTS.MAX_TOKENS
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const latencyMs = Date.now() - startTime;

      // Handle OpenAI API error responses
      if (!response.ok) {
        let errMessage = `OpenAI API returned status ${response.status}`;
        try {
          const errJson = await response.json();
          if (errJson.error && errJson.error.message) {
            errMessage = errJson.error.message;
          }
        } catch (e) {}

        console.error(`[AIService API Error] Latency: ${latencyMs}ms | Status: ${response.status} | Error: ${errMessage}`);

        return {
          text: "I'm experiencing a brief connection delay. Please try asking again in a moment.",
          usage: { input_tokens: 0, output_tokens: 0 },
          isFallback: true,
          status: response.status === 401 ? HTTP_STATUS.UNAUTHORIZED :
                  response.status === 429 ? HTTP_STATUS.TOO_MANY_REQUESTS : HTTP_STATUS.INTERNAL_SERVER_ERROR,
          errorMessage: errMessage
        };
      }

      const data = await response.json();

      const choice = data.choices && data.choices[0];
      const responseText = choice?.message?.content?.trim() || "Thank you for reaching out to Nova Skills AI Career Advisor.";
      
      const usage = {
        input_tokens: data.usage?.prompt_tokens ?? null,
        output_tokens: data.usage?.completion_tokens ?? null
      };

      console.log(`[AIService Success] Latency: ${latencyMs}ms | Status: 200 | Input Tokens: ${usage.input_tokens} | Output Tokens: ${usage.output_tokens}`);

      return {
        text: responseText,
        usage: usage,
        isFallback: false,
        status: HTTP_STATUS.OK
      };

    } catch (err) {
      clearTimeout(timeoutId);
      const latencyMs = Date.now() - startTime;

      const isTimeout = err.name === 'AbortError';
      console.error(`[AIService Exception] Latency: ${latencyMs}ms | Aborted: ${isTimeout} | Message: ${err.message}`);

      return {
        text: "I'm having trouble connecting right now. Please try again shortly.",
        usage: { input_tokens: null, output_tokens: null },
        isFallback: true,
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR
      };
    }
  }
}
