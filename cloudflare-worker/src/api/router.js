/**
 * REST API Endpoints Router Module
 */

import { processAIRequest } from '../services/aiService.js';
import { createJsonResponse, createErrorResponse } from '../utils/response.js';

export async function handleApiRoute(request, path, config, reqOrigin) {
  let body = {};
  try {
    body = await request.json();
  } catch (e) {
    return createErrorResponse('Invalid JSON payload in request body.', 400, reqOrigin, config.allowedOrigins);
  }

  const { message, messages, userMessage, customInstruction, context } = body;

  switch (path) {
    case '/api/ai/chat': {
      const userText = message || userMessage || (messages && messages[messages.length - 1]?.content) || '';
      if (!userText && (!messages || messages.length === 0)) {
        return createErrorResponse('Field "message" or "messages" is required.', 400, reqOrigin, config.allowedOrigins);
      }
      const result = await processAIRequest({
        endpoint: '/api/ai/chat',
        promptKey: 'ADMISSION_ASSISTANT',
        systemInstruction: customInstruction,
        userMessage: userText,
        messages: messages,
        config: config,
        reqOrigin: reqOrigin
      });
      return createJsonResponse(result, 200, reqOrigin, config.allowedOrigins);
    }

    case '/api/ai/admission': {
      const userText = message || userMessage || '';
      if (!userText) {
        return createErrorResponse('Field "message" is required for admission assistance.', 400, reqOrigin, config.allowedOrigins);
      }
      const result = await processAIRequest({
        endpoint: '/api/ai/admission',
        promptKey: 'ADMISSION_ASSISTANT',
        systemInstruction: customInstruction || 'Focus on answering course fee, duration, eligibility, and admission process details.',
        userMessage: userText,
        config: config,
        reqOrigin: reqOrigin
      });
      return createJsonResponse(result, 200, reqOrigin, config.allowedOrigins);
    }

    case '/api/ai/course-recommendation': {
      const userText = message || userMessage || context || '';
      if (!userText) {
        return createErrorResponse('Field "message" or "context" (user background/goal) is required.', 400, reqOrigin, config.allowedOrigins);
      }
      const result = await processAIRequest({
        endpoint: '/api/ai/course-recommendation',
        promptKey: 'COURSE_RECOMMENDATION',
        systemInstruction: customInstruction,
        userMessage: `Student Profile & Interest: ${userText}`,
        config: config,
        reqOrigin: reqOrigin
      });
      return createJsonResponse(result, 200, reqOrigin, config.allowedOrigins);
    }

    case '/api/ai/followup': {
      const userText = message || userMessage || context || '';
      if (!userText) {
        return createErrorResponse('Field "context" or "message" with student enquiry details is required.', 400, reqOrigin, config.allowedOrigins);
      }
      const result = await processAIRequest({
        endpoint: '/api/ai/followup',
        promptKey: 'FOLLOWUP_SUGGESTION',
        systemInstruction: customInstruction,
        userMessage: `Enquiry Context: ${userText}`,
        config: config,
        reqOrigin: reqOrigin
      });
      return createJsonResponse(result, 200, reqOrigin, config.allowedOrigins);
    }

    case '/api/ai/summarize': {
      const userText = message || userMessage || context || '';
      if (!userText) {
        return createErrorResponse('Field "message" or "context" to summarize is required.', 400, reqOrigin, config.allowedOrigins);
      }
      const result = await processAIRequest({
        endpoint: '/api/ai/summarize',
        promptKey: 'LEAD_SUMMARY',
        systemInstruction: customInstruction,
        userMessage: `Inquiry to summarize: ${userText}`,
        config: config,
        reqOrigin: reqOrigin
      });
      return createJsonResponse(result, 200, reqOrigin, config.allowedOrigins);
    }

    default:
      return createErrorResponse(`Endpoint ${path} not found.`, 440, reqOrigin, config.allowedOrigins);
  }
}
