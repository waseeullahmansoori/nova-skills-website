/**
 * AI Counsellor Engine Service
 * Executes lead analysis & recommendation tasks with structured JSON responses, caching, and audit logging.
 */

import { createAIProvider } from '../providers/index.js';
import { COUNSELLOR_SYSTEM_PROMPT, PROMPT_VERSION } from '../prompts/counsellorPrompts.js';
import { prepareLeadContext } from './leadAnalyzer.js';
import { getCachedAIResponse, setCachedAIResponse, generateCacheKey } from '../cache/aiCache.js';
import { logRequest } from '../logger/index.js';

export async function processCounsellorAnalysis({ endpoint, leadData, customInstruction, config }) {
  const startTime = Date.now();
  const leadContext = prepareLeadContext(leadData);

  // 1. Cache Check
  const cacheKey = generateCacheKey(endpoint, leadData);
  const cachedResponse = getCachedAIResponse(cacheKey);
  if (cachedResponse) {
    return {
      success: true,
      cached: true,
      data: cachedResponse
    };
  }

  const provider = createAIProvider('openai', config);

  const promptContent = `
ANALYZE THIS STUDENT LEAD context:
${JSON.stringify(leadContext, null, 2)}

${customInstruction ? `Specific Directive: ${customInstruction}` : ''}

Generate structured JSON evaluation following the required JSON schema strictly.
`;

  const messages = [
    { role: 'system', content: COUNSELLOR_SYSTEM_PROMPT },
    { role: 'user', content: promptContent }
  ];

  try {
    const completion = await provider.generateCompletion(messages, {
      model: config.openaiModel
    });

    const executionTimeMs = Date.now() - startTime;

    // 2. Parse & Validate Structured JSON Response
    let parsedData = {};
    try {
      // Strip markdown block syntax if model wraps response in ```json ... ```
      let cleanText = completion.text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```/, '').replace(/```$/, '').trim();
      }
      parsedData = JSON.parse(cleanText);
    } catch (jsonErr) {
      // Fallback structured object if JSON parsing fails
      parsedData = {
        leadSummary: completion.text.slice(0, 300),
        admissionProbability: 50,
        priority: leadContext.priority || "Medium",
        recommendedAction: "Call lead to assess interest",
        recommendedCourse: leadContext.courseInterest || "Digital Marketing Master Program",
        riskLevel: "Medium",
        riskFactors: ["Model response was unformatted text"],
        nextFollowUp: "Tomorrow 11:00 AM",
        confidence: 70,
        studentIntent: "Enquiry submitted",
        counsellingNotes: completion.text,
        objectionHandling: ["Highlight 100% practical training"],
        upsellOpportunity: "Explore Master Certification Package"
      };
    }

    // Ensure required fields
    parsedData.promptVersion = PROMPT_VERSION;
    parsedData.leadId = leadContext.leadId;

    // 3. Cache the parsed JSON response for 5 minutes
    setCachedAIResponse(cacheKey, parsedData, 300);

    // 4. Audit Logging
    logRequest({
      endpoint: endpoint,
      status: 'success',
      executionTimeMs: executionTimeMs,
      modelUsed: completion.modelUsed,
      usage: completion.usage
    });

    return {
      success: true,
      cached: false,
      data: parsedData
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
