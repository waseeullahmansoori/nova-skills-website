/**
 * REST API Endpoints Router Module
 * Dispatches requests for AI Gateway, AI Counsellor Engine, AI Student Assistant, and AI Content Studio.
 */

import { processAIRequest } from '../services/aiService.js';
import { processCounsellorAnalysis } from '../services/counsellorEngine.js';
import { processStudentChat } from '../services/studentAssistant.js';
import { sendLeadToCRM } from '../services/leadCaptureService.js';
import { processContentGeneration } from '../services/contentStudioService.js';
import { createJsonResponse, createErrorResponse } from '../utils/response.js';

export async function handleApiRoute(request, path, config, reqOrigin) {
  let body = {};
  try {
    body = await request.json();
  } catch (e) {
    return createErrorResponse('Invalid JSON payload in request body.', 400, reqOrigin, config.allowedOrigins);
  }

  const { message, messages, userMessage, customInstruction, context, leadData, name, mobile, email, course, city, topic, contentType, platform, language, tone, focusKeyword, wordCount } = body;

  switch (path) {
    // 1. AI Content Studio Endpoints
    case '/api/ai/content':
    case '/api/ai/blog':
    case '/api/ai/social':
    case '/api/ai/email':
    case '/api/ai/whatsapp':
    case '/api/ai/ads': {
      const targetTopic = topic || message || userMessage || 'Nova Skills Courses & Admissions';
      const targetCategory = contentType || path.replace('/api/ai/', '');
      
      const result = await processContentGeneration({
        endpoint: path,
        contentType: targetCategory,
        topic: targetTopic,
        platform: platform || targetCategory,
        language: language || 'English',
        tone: tone || 'Professional',
        focusKeyword: focusKeyword || '',
        wordCount: wordCount || 300,
        config: config
      });
      return createJsonResponse(result, 200, reqOrigin, config.allowedOrigins);
    }

    // 2. AI Student Assistant Endpoints
    case '/api/ai/student-chat':
    case '/api/ai/course-advisor':
    case '/api/ai/admission-faq': {
      const userText = message || userMessage || (messages && messages[messages.length - 1]?.content) || '';
      if (!userText && (!messages || messages.length === 0)) {
        return createErrorResponse('Field "message" or "messages" is required.', 400, reqOrigin, config.allowedOrigins);
      }
      const result = await processStudentChat({
        endpoint: path,
        userMessage: userText,
        messages: messages,
        config: config,
        reqOrigin: reqOrigin
      });
      return createJsonResponse(result, 200, reqOrigin, config.allowedOrigins);
    }

    case '/api/ai/create-lead': {
      if (!name || (!mobile && !email)) {
        return createErrorResponse('Name and at least Mobile or Email are required to create a lead.', 400, reqOrigin, config.allowedOrigins);
      }
      const crmPayload = {
        name: name,
        mobile: mobile || '',
        email: email || '',
        course: course || 'General Enquiry',
        city: city || 'AI Student Chat',
        message: message || 'Direct Lead Capture via AI Student Assistant'
      };
      const crmResult = await sendLeadToCRM(crmPayload);
      return createJsonResponse(crmResult, 200, reqOrigin, config.allowedOrigins);
    }

    // 3. General Gateway AI Endpoints
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

    // 4. AI Counsellor Engine Endpoints
    case '/api/ai/lead-analysis':
    case '/api/ai/recommendation':
    case '/api/ai/counsellor-summary':
    case '/api/ai/followup-plan': {
      const targetLeadData = leadData || body;
      if (!targetLeadData || (!targetLeadData.course && !targetLeadData.message && !targetLeadData.name && !targetLeadData.mobile)) {
        return createErrorResponse('Valid lead details (course, message, or leadData object) are required.', 400, reqOrigin, config.allowedOrigins);
      }
      const result = await processCounsellorAnalysis({
        endpoint: path,
        leadData: targetLeadData,
        customInstruction: customInstruction,
        config: config
      });
      return createJsonResponse(result, 200, reqOrigin, config.allowedOrigins);
    }

    default:
      return createErrorResponse(`Endpoint ${path} not found.`, 404, reqOrigin, config.allowedOrigins);
  }
}
