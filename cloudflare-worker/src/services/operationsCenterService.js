/**
 * Core AI Operations Center Service
 * Handles Executive Briefings, Weekly/Monthly Reports, Anomaly Alerts & Business Q&A.
 */

import { createAIProvider } from '../providers/index.js';
import { OPERATIONS_ANALYST_SYSTEM_PROMPT, OPERATIONS_PROMPT_VERSION } from '../prompts/operationsPrompts.js';
import { detectBusinessAnomalies } from './anomalyDetector.js';
import { calculateForecasts } from './forecastEngine.js';
import { getCachedAIResponse, setCachedAIResponse, generateCacheKey } from '../cache/aiCache.js';
import { logRequest } from '../logger/index.js';

export async function processOperationsReport({ endpoint, reportType, crmData = {}, queryText = '', config }) {
  const startTime = Date.now();

  // 1. Cache Check
  const cacheKey = generateCacheKey(endpoint, { reportType, queryText, ...crmData });
  const cachedResponse = getCachedAIResponse(cacheKey);
  if (cachedResponse) {
    return {
      success: true,
      cached: true,
      data: cachedResponse
    };
  }

  const provider = createAIProvider('openai', config);

  const anomalies = detectBusinessAnomalies(crmData);
  const forecasts = calculateForecasts(crmData);

  const analysisPayload = {
    reportType: reportType || 'Executive Dashboard Analysis',
    queryText: queryText || undefined,
    crmMetrics: crmData,
    anomaliesDetected: anomalies,
    forecasts: forecasts
  };

  const userPrompt = `
ANALYZE THESE EXECUTIVE CRM OPERATIONAL DATA:
${JSON.stringify(analysisPayload, null, 2)}

${queryText ? `Management Question to Answer: "${queryText}"` : `Task: Generate ${reportType || 'Daily Executive Briefing'}`}

Return strict JSON output matching the required Operations Analyst schema.
`;

  const messages = [
    { role: 'system', content: OPERATIONS_ANALYST_SYSTEM_PROMPT },
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
        executiveSummary: completion.text.slice(0, 400),
        businessMetrics: {
          totalLeads: crmData.totalLeads || 0,
          admissions: crmData.admissions || 0,
          conversionRate: crmData.conversionRate || '0.0%',
          revenueEstimated: forecasts.expectedRevenue,
          pendingFollowUps: crmData.pendingFollowUps || 0
        },
        keyHighlights: ["Admissions pipeline active", "AI Business Analyst active"],
        anomaliesDetected: anomalies,
        predictiveForecast: forecasts,
        actionableRecommendations: [
          "Follow up with pending Hot intent leads immediately",
          "Optimize Google Ads campaign keywords for higher conversion"
        ],
        reportTitle: `${reportType || 'Executive Briefing'} — Nova Skills`
      };
    }

    parsedJSON.promptVersion = OPERATIONS_PROMPT_VERSION;
    parsedJSON.generatedAt = new Date().toISOString();

    // Cache report for 10 minutes
    setCachedAIResponse(cacheKey, parsedJSON, 600);

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
      data: parsedJSON
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
