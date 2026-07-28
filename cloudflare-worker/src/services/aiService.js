/**
 * Core AI Service Module
 * Handles prompt assembly, provider execution, performance timing & token tracking
 */

import { createAIProvider } from '../providers/index.js';
import { getPrompt } from '../prompts/index.js';
import { logRequest } from '../logger/index.js';

export async function processAIRequest({ endpoint, promptKey, systemInstruction, userMessage, messages = [], config, reqOrigin }) {
  const startTime = Date.now();
  const provider = createAIProvider('openai', config);

  try {
    const systemPromptText = getPrompt(promptKey, systemInstruction);

    const apiMessages = [
      { role: 'system', content: systemPromptText }
    ];

    if (Array.isArray(messages) && messages.length > 0) {
      messages.forEach(msg => {
        if (msg.role && msg.content) {
          apiMessages.push({ role: msg.role, content: msg.content });
        }
      });
    }

    if (userMessage) {
      apiMessages.push({ role: 'user', content: userMessage });
    }

    const completion = await provider.generateCompletion(apiMessages, {
      model: config.openaiModel
    });

    const executionTimeMs = Date.now() - startTime;

    logRequest({
      endpoint: endpoint,
      status: 'success',
      executionTimeMs: executionTimeMs,
      modelUsed: completion.modelUsed,
      usage: completion.usage
    });

    return {
      success: true,
      data: {
        response: completion.text,
        model: completion.modelUsed,
        usage: completion.usage,
        executionTimeMs: executionTimeMs
      }
    };

  } catch (err) {
    const executionTimeMs = Date.now() - startTime;

    logRequest({
      endpoint: endpoint,
      status: 'error',
      executionTimeMs: executionTimeMs,
      error: err
    });

    throw err;
  }
}
