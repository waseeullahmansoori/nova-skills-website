/**
 * REST API Endpoints Router Module
 * Dispatches requests for AI Gateway, AI Counsellor Engine, AI Student Assistant, AI Content Studio, AI Operations Center, Auth & Admin RBAC.
 */

import { processAIRequest } from '../services/aiService.js';
import { processCounsellorAnalysis } from '../services/counsellorEngine.js';
import { processStudentChat } from '../services/studentAssistant.js';
import { sendLeadToCRM } from '../services/leadCaptureService.js';
import { processContentGeneration } from '../services/contentStudioService.js';
import { processOperationsReport } from '../services/operationsCenterService.js';
import { authenticateUser, authorizeRequest, getAllUsers, getRolePermissionsMatrix } from '../services/authService.js';
import { invalidateSession } from '../services/sessionManager.js';
import { getSecurityLogs, logSecurityEvent } from '../services/auditLogger.js';
import { PERMISSIONS } from '../security/rbacMatrix.js';
import { createJsonResponse, createErrorResponse } from '../utils/response.js';

export async function handleApiRoute(request, path, config, reqOrigin) {
  let body = {};
  if (request.method === 'POST' || request.method === 'PUT') {
    try {
      body = await request.json();
    } catch (e) {
      return createErrorResponse('Invalid JSON payload in request body.', 400, reqOrigin, config.allowedOrigins);
    }
  }

  const { message, messages, userMessage, customInstruction, context, leadData, name, mobile, email, password, course, city, topic, contentType, platform, language, tone, focusKeyword, wordCount, crmData, query } = body;

  switch (path) {
    // 1. Enterprise Auth Endpoints
    case '/api/auth/login': {
      if (!email || !password) {
        return createErrorResponse('Email and password are required.', 400, reqOrigin, config.allowedOrigins);
      }
      try {
        const authResult = await authenticateUser(email, password, request);
        return createJsonResponse({
          success: true,
          message: 'Login successful.',
          user: authResult.user,
          token: authResult.sessionToken,
          expiresAt: authResult.expiresAt
        }, 200, reqOrigin, config.allowedOrigins);
      } catch (err) {
        return createErrorResponse(err.message, 401, reqOrigin, config.allowedOrigins);
      }
    }

    case '/api/auth/logout': {
      const authHeader = request.headers.get('Authorization') || '';
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      if (token) invalidateSession(token);
      return createJsonResponse({ success: true, message: 'Logged out successfully.' }, 200, reqOrigin, config.allowedOrigins);
    }

    case '/api/auth/me': {
      const auth = authorizeRequest(request);
      if (!auth.authorized) {
        return createErrorResponse(auth.error, auth.status, reqOrigin, config.allowedOrigins);
      }
      return createJsonResponse({ success: true, user: auth.session }, 200, reqOrigin, config.allowedOrigins);
    }

    // 2. Admin & RBAC Endpoints (Protected by Permissions)
    case '/api/admin/users': {
      const auth = authorizeRequest(request, PERMISSIONS.MANAGE_USERS);
      if (!auth.authorized) {
        return createErrorResponse(auth.error, auth.status, reqOrigin, config.allowedOrigins);
      }
      return createJsonResponse({ success: true, users: getAllUsers() }, 200, reqOrigin, config.allowedOrigins);
    }

    case '/api/admin/roles': {
      const auth = authorizeRequest(request, PERMISSIONS.MANAGE_ROLES);
      if (!auth.authorized) {
        return createErrorResponse(auth.error, auth.status, reqOrigin, config.allowedOrigins);
      }
      return createJsonResponse({ success: true, matrix: getRolePermissionsMatrix() }, 200, reqOrigin, config.allowedOrigins);
    }

    case '/api/admin/security-logs': {
      const auth = authorizeRequest(request, PERMISSIONS.MANAGE_USERS);
      if (!auth.authorized) {
        return createErrorResponse(auth.error, auth.status, reqOrigin, config.allowedOrigins);
      }
      return createJsonResponse({ success: true, logs: getSecurityLogs(100) }, 200, reqOrigin, config.allowedOrigins);
    }

    // 3. AI Operations Center Endpoints
    case '/api/ai/dashboard':
    case '/api/ai/daily-brief':
    case '/api/ai/weekly-report':
    case '/api/ai/monthly-report': {
      const reportName = path.replace('/api/ai/', '').replace('-', ' ').toUpperCase();
      const result = await processOperationsReport({
        endpoint: path,
        reportType: reportName,
        crmData: crmData || body,
        config: config
      });
      return createJsonResponse(result, 200, reqOrigin, config.allowedOrigins);
    }

    case '/api/ai/business-query': {
      const queryText = query || message || userMessage || '';
      if (!queryText) {
        return createErrorResponse('Field "query" or "message" is required for business analysis.', 400, reqOrigin, config.allowedOrigins);
      }
      const result = await processOperationsReport({
        endpoint: '/api/ai/business-query',
        reportType: 'Management Q&A Analysis',
        crmData: crmData || {},
        queryText: queryText,
        config: config
      });
      return createJsonResponse(result, 200, reqOrigin, config.allowedOrigins);
    }

    // 4. AI Content Studio Endpoints
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

    // 5. AI Student Assistant Endpoints
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

    // 6. General Gateway AI Endpoints
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

    // 7. AI Counsellor Engine Endpoints
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
