/**
 * OpenAI GPT Provider (Default GPT-5.5 Integration)
 */

import { BaseAIProvider } from './baseProvider.js';

export class OpenAIProvider extends BaseAIProvider {
  async generateCompletion(messages, options = {}) {
    if (!this.config.openaiApiKey) {
      throw new Error('OPENAI_API_KEY environment secret is not configured in Cloudflare Worker.');
    }

    const model = options.model || this.config.openaiModel || 'gpt-5.5';
    const temperature = options.temperature ?? this.config.temperature ?? 0.7;
    const maxTokens = options.maxTokens || this.config.maxTokens || 1500;

    const payload = {
      model: model,
      messages: messages,
      temperature: temperature,
      max_tokens: maxTokens
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.openaiApiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson = {};
      try { errorJson = JSON.parse(errorText); } catch (e) {}
      throw new Error(errorJson.error?.message || `OpenAI API returned status ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    const resultText = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : '';

    return {
      text: resultText,
      modelUsed: data.model || model,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0
      }
    };
  }
}
