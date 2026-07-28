/**
 * Core AI Content Studio Service
 * Handles multi-platform content generation, SEO enrichment, brand checks, and JSON response assembly.
 */

import { createAIProvider } from '../providers/index.js';
import { CONTENT_STUDIO_SYSTEM_PROMPT, CONTENT_PROMPT_VERSION } from '../prompts/contentStudioPrompts.js';
import { validateBrandCompliance } from './brandValidationService.js';
import { formatSEOMetadata } from './seoService.js';
import { logRequest } from '../logger/index.js';

export async function processContentGeneration({ endpoint, contentType, topic, platform, language = 'English', tone = 'Professional', focusKeyword = '', wordCount = 300, config }) {
  const startTime = Date.now();
  const provider = createAIProvider('openai', config);

  const contentId = `CONTENT-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

  const userPrompt = `
GENERATE CONTENT FOR NOVA SKILLS:
- Content Type / Category: ${contentType || platform || 'General Marketing'}
- Topic / Focus: ${topic || 'Nova Skills Practical Training Courses'}
- Target Platform: ${platform || 'Website / Social'}
- Language: ${language} (English, Hindi, or Hinglish)
- Tone: ${tone}
- Target Word Count: ${wordCount} words
- SEO Focus Keyword: ${focusKeyword || 'Nova Skills Course'}

Generate strict JSON output adhering to the system schema.
`;

  const messages = [
    { role: 'system', content: CONTENT_STUDIO_SYSTEM_PROMPT },
    { role: 'user', content: userPrompt }
  ];

  try {
    const completion = await provider.generateCompletion(messages, {
      model: config.openaiModel
    });

    const executionTimeMs = Date.now() - startTime;

    let parsedJSON = {};
    try {
      let cleanText = completion.text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```/, '').replace(/```$/, '').trim();
      }
      parsedJSON = JSON.parse(cleanText);
    } catch (jsonErr) {
      parsedJSON = {
        title: `${topic || contentType} — Nova Skills`,
        content: completion.text,
        seo: formatSEOMetadata(topic, completion.text, focusKeyword),
        suggestedCTA: "Book a Free Demo Class at Nova Skills Today!",
        version: "1.0"
      };
    }

    // Fallback SEO metadata if empty
    if (!parsedJSON.seo || !parsedJSON.seo.metaTitle) {
      parsedJSON.seo = formatSEOMetadata(parsedJSON.title || topic, parsedJSON.content, focusKeyword);
    }

    // Brand Quality & Compliance Check
    const brandCheck = validateBrandCompliance(parsedJSON.content, parsedJSON.title);

    logRequest({
      endpoint: endpoint,
      status: 'success',
      executionTimeMs: executionTimeMs,
      modelUsed: completion.modelUsed,
      usage: completion.usage
    });

    return {
      success: true,
      contentId: contentId,
      title: parsedJSON.title || topic,
      content: parsedJSON.content,
      platform: platform || contentType,
      language: language,
      seo: parsedJSON.seo,
      brandValidation: {
        compliant: brandCheck.compliant,
        grammarCheck: brandCheck.grammarCheck,
        safetyCheck: brandCheck.safetyCheck,
        violations: brandCheck.violations
      },
      qualityScore: brandCheck.qualityScore,
      suggestedCTA: parsedJSON.suggestedCTA || "Enroll Now at Nova Skills",
      promptVersion: CONTENT_PROMPT_VERSION,
      executionTimeMs: executionTimeMs
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
