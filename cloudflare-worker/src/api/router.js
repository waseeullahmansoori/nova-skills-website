/**
 * REST API Endpoints Router Module
 * Dispatches requests for Audit Logs (GET /api/admin/activity), Settings Center, AI Gateway, Lead Gateway, Auth MVP, Admin RBAC, Meta Communication, SXP, and Supabase Database.
 */

import { processAIRequest } from '../services/aiService.js';
import { processCounsellorAnalysis } from '../services/counsellorEngine.js';
import { processStudentChat } from '../services/studentAssistant.js';
import { sendLeadToCRM } from '../services/leadCaptureService.js';
import { forwardLeadToAppsScript } from '../services/leadService.js';
import { processContentGeneration } from '../services/contentStudioService.js';
import { processOperationsReport } from '../services/operationsCenterService.js';
import { getRolePermissionsMatrix } from '../services/authService.js';
import { loginUser } from '../auth/loginService.js';
import { logoutUser } from '../auth/logoutService.js';
import { requestPasswordReset } from '../auth/passwordResetService.js';
import { protectRoute } from '../auth/authMiddleware.js';
import { getAuditLogs, logAuditEvent } from '../services/auditLogger.js';
import { sendCommunication } from '../communication/communicationService.js';
import { compileCommunicationTemplate, TEMPLATES } from '../communication/templateManager.js';
import { getMessageStatus, updateMessageStatus, getConversationHistory } from '../communication/conversationStore.js';
import { getStudentDashboardData } from '../services/studentDashboardService.js';
import { processStudentLearningQuery } from '../services/aiLearningService.js';
import { fetchStudentsFromSupabase, createStudentInSupabase, createAdmissionInSupabase } from '../services/supabaseService.js';
import { syncLeadToSupabase } from '../services/migrationService.js';
import { testSupabaseConnection } from '../supabase/index.js';
import { getPlatformSettings, updatePlatformSettings } from '../services/settingsService.js';
import { PERMISSIONS } from '../security/rbacMatrix.js';
import { createJsonResponse, createErrorResponse } from '../utils/response.js';

export async function handleApiRoute(request, path, config, reqOrigin) {
  const url = new URL(request.url);

  // 1. Audit Logs Activity Endpoint (GET /api/admin/activity)
  if (path === '/api/admin/activity') {
    const auth = await protectRoute(request, 'Admin', env, config);
    if (!auth.authorized) {
      return createErrorResponse(auth.error, auth.status, reqOrigin, config.allowedOrigins, 'FORBIDDEN');
    }
    const logs = await getAuditLogs(env, config);
    return createJsonResponse({ success: true, logs: logs }, 200, reqOrigin, config.allowedOrigins);
  }

  // 2. Settings Center Endpoints (GET /api/settings & PUT /api/settings)
  if (path === '/api/settings') {
    if (request.method === 'GET') {
      const settings = await getPlatformSettings(env, config);
      return createJsonResponse({ success: true, settings: settings }, 200, reqOrigin, config.allowedOrigins);
    }
    if (request.method === 'PUT' || request.method === 'POST') {
      const auth = await protectRoute(request, 'Admin', env, config);
      if (!auth.authorized) {
        return createErrorResponse(auth.error, auth.status, reqOrigin, config.allowedOrigins, 'FORBIDDEN');
      }
      let body = {};
      try { body = await request.json(); } catch (e) {}
      const updateResult = await updatePlatformSettings(body, env, config);
      
      await logAuditEvent({
        action: 'Settings Updated',
        entityType: 'Settings',
        description: 'Updated platform configuration settings',
        ipAddress: request.headers.get('CF-Connecting-IP') || '127.0.0.1',
        userAgent: request.headers.get('User-Agent') || 'Unknown'
      }, env, config);

      return createJsonResponse(updateResult, 200, reqOrigin, config.allowedOrigins);
    }
  }

  // 3. Supabase Connection Health Endpoint (GET /api/health/supabase)
  if (path === '/api/health/supabase' && request.method === 'GET') {
    const healthResult = await testSupabaseConnection(env, config);
    return createJsonResponse(healthResult, healthResult.success ? 200 : 503, reqOrigin, config.allowedOrigins);
  }

  // 4. OpenAI GPT-5.5 Health GET Endpoint (GET /api/ai/health)
  if ((path === '/api/ai/health' || path === '/api/health' || path === '/health') && request.method === 'GET') {
    return createJsonResponse({
      success: true,
      service: 'Nova Skills Worker Gateway',
      status: 'Healthy',
      model: config.openaiModel || 'gpt-5.5',
      timestamp: new Date().toISOString()
    }, 200, reqOrigin, config.allowedOrigins);
  }

  // Meta Webhook GET verification
  if (path === '/api/communication/webhook' && request.method === 'GET') {
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    const expectedToken = config.metaWebhookVerifyToken || env?.META_WEBHOOK_VERIFY_TOKEN || 'novaskills_webhook_secret';

    if (mode === 'subscribe' && token === expectedToken) {
      return new Response(challenge, { status: 200 });
    }
    return new Response('Forbidden', { status: 403 });
  }

  let body = {};
  if (request.method === 'POST' || request.method === 'PUT') {
    try {
      body = await request.json();
    } catch (e) {
      return createErrorResponse('Invalid JSON payload in request body.', 400, reqOrigin, config.allowedOrigins, 'INVALID_JSON');
    }
  }

  const { message, messages, userMessage, customInstruction, context, leadData, name, mobile, email, password, role, course, city, topic, contentType, platform, language, tone, focusKeyword, wordCount, crmData, query, recipient, templateKey, dataMap, mediaUrl, messageId, status, studentId } = body;

  switch (path) {
    // 5. Supabase Auth MVP Endpoints
    case '/api/auth/login': {
      if (!email || !password) {
        return createErrorResponse('Email and password are required.', 400, reqOrigin, config.allowedOrigins, 'VALIDATION_ERROR');
      }
      try {
        const loginResult = await loginUser(email, password, env, config);
        await logAuditEvent({
          userId: loginResult.user?.id,
          userRole: loginResult.user?.role || 'Admin',
          action: 'Login',
          entityType: 'Auth',
          description: `User ${email} logged in successfully`,
          ipAddress: request.headers.get('CF-Connecting-IP') || '127.0.0.1',
          userAgent: request.headers.get('User-Agent') || 'Unknown'
        }, env, config);
        return createJsonResponse(loginResult, 200, reqOrigin, config.allowedOrigins);
      } catch (err) {
        return createErrorResponse(err.message, 401, reqOrigin, config.allowedOrigins, 'INVALID_CREDENTIALS');
      }
    }

    case '/api/auth/logout': {
      const authHeader = request.headers.get('Authorization') || '';
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      const logoutResult = await logoutUser(token, env, config);
      await logAuditEvent({
        action: 'Logout',
        entityType: 'Auth',
        description: 'User logged out',
        ipAddress: request.headers.get('CF-Connecting-IP') || '127.0.0.1',
        userAgent: request.headers.get('User-Agent') || 'Unknown'
      }, env, config);
      return createJsonResponse(logoutResult, 200, reqOrigin, config.allowedOrigins);
    }

    case '/api/auth/reset-password': {
      if (!email) {
        return createErrorResponse('Field "email" is required for password reset.', 400, reqOrigin, config.allowedOrigins, 'VALIDATION_ERROR');
      }
      try {
        const resetResult = await requestPasswordReset(email, env, config);
        return createJsonResponse(resetResult, 200, reqOrigin, config.allowedOrigins);
      } catch (err) {
        return createErrorResponse(err.message, 500, reqOrigin, config.allowedOrigins, 'RESET_FAILED');
      }
    }

    case '/api/auth/profile': {
      const auth = await protectRoute(request, null, env, config);
      if (!auth.authorized) {
        return createErrorResponse(auth.error, auth.status, reqOrigin, config.allowedOrigins, 'UNAUTHORIZED');
      }
      return createJsonResponse({ success: true, profile: auth.user }, 200, reqOrigin, config.allowedOrigins);
    }

    // 6. OpenAI GPT-5.5 Chat MVP (POST /api/ai/chat)
    case '/api/ai/chat': {
      const userText = (message || userMessage || (messages && messages[messages.length - 1]?.content) || '').trim();
      
      if (!userText) {
        return createErrorResponse('Field "message" is required and cannot be empty.', 400, reqOrigin, config.allowedOrigins, 'EMPTY_MESSAGE');
      }

      if (userText.length > 1000) {
        return createErrorResponse('Message exceeds maximum limit of 1000 characters.', 400, reqOrigin, config.allowedOrigins, 'MESSAGE_TOO_LONG');
      }

      try {
        const result = await processAIRequest({
          endpoint: '/api/ai/chat',
          promptKey: 'ADMISSION_ASSISTANT',
          systemInstruction: customInstruction,
          userMessage: userText,
          messages: messages,
          config: config,
          reqOrigin: reqOrigin
        });

        return createJsonResponse({
          success: true,
          response: result.data.response,
          model: result.data.model || config.openaiModel || 'gpt-5.5'
        }, 200, reqOrigin, config.allowedOrigins);
      } catch (err) {
        return createErrorResponse(err.message || 'OpenAI AI Gateway processing error.', 500, reqOrigin, config.allowedOrigins, 'OPENAI_API_ERROR');
      }
    }

    // 7. Lead Gateway MVP (POST /api/lead)
    case '/api/lead': {
      if (!name || (!mobile && !email) || !course) {
        return createErrorResponse('Name, course, and at least Mobile or Email are required.', 400, reqOrigin, config.allowedOrigins, 'VALIDATION_ERROR');
      }
      const crmResult = await forwardLeadToAppsScript(body);
      if (crmResult.success) {
        return createJsonResponse(crmResult, 200, reqOrigin, config.allowedOrigins);
      }
      return createErrorResponse(crmResult.message || 'CRM Forwarding Failed', 500, reqOrigin, config.allowedOrigins, crmResult.errorCode || 'CRM_ERROR');
    }

    // 8. Supabase Enterprise Database Endpoints
    case '/api/supabase/sync': {
      const syncResult = await syncLeadToSupabase(body, env, config);
      return createJsonResponse(syncResult, 200, reqOrigin, config.allowedOrigins);
    }

    case '/api/supabase/students': {
      if (request.method === 'GET') {
        const result = await fetchStudentsFromSupabase(env, config);
        return createJsonResponse(result, 200, reqOrigin, config.allowedOrigins);
      }
      const createResult = await createStudentInSupabase(body, env, config);
      await logAuditEvent({
        action: 'Student Created',
        entityType: 'Student',
        description: `Created student profile for ${body.name || body.email}`,
        ipAddress: request.headers.get('CF-Connecting-IP') || '127.0.0.1',
        userAgent: request.headers.get('User-Agent') || 'Unknown'
      }, env, config);
      return createJsonResponse(createResult, 200, reqOrigin, config.allowedOrigins);
    }

    case '/api/supabase/admissions': {
      const admissionResult = await createAdmissionInSupabase(body, env, config);
      return createJsonResponse(admissionResult, 200, reqOrigin, config.allowedOrigins);
    }

    // 9. Student Experience Platform (SXP) Endpoints
    case '/api/student/dashboard':
    case '/api/student/courses':
    case '/api/student/assignments':
    case '/api/student/certificates':
    case '/api/student/payments': {
      const dashboardData = getStudentDashboardData(studentId || 'STU-1001');
      return createJsonResponse({ success: true, ...dashboardData }, 200, reqOrigin, config.allowedOrigins);
    }

    case '/api/student/assistant':
    case '/api/student/progress':
    case '/api/student/roadmap': {
      const userQuery = message || userMessage || query || 'Explain key concepts and career roadmap for my course.';
      const result = await processStudentLearningQuery({
        endpoint: path,
        userQuery: userQuery,
        courseContext: course || 'Digital Marketing',
        config: config
      });
      return createJsonResponse(result, 200, reqOrigin, config.allowedOrigins);
    }

    // 10. Meta WhatsApp & Enterprise Communication Endpoints
    case '/api/communication/send': {
      if (!recipient) {
        return createErrorResponse('Field "recipient" (mobile number) is required.', 400, reqOrigin, config.allowedOrigins, 'VALIDATION_ERROR');
      }
      try {
        const result = await sendCommunication({
          recipient: recipient,
          templateKey: templateKey,
          messageText: message || userMessage,
          dataMap: dataMap || body,
          mediaUrl: mediaUrl,
          languageCode: language || 'en',
          config: config
        });
        return createJsonResponse(result, 200, reqOrigin, config.allowedOrigins);
      } catch (err) {
        return createErrorResponse(err.message, 500, reqOrigin, config.allowedOrigins, 'COMM_ERROR');
      }
    }

    case '/api/communication/template': {
      if (templateKey) {
        const compiled = compileCommunicationTemplate(templateKey, dataMap || body);
        return createJsonResponse({ success: true, templateKey: templateKey, compiled: compiled }, 200, reqOrigin, config.allowedOrigins);
      }
      return createJsonResponse({ success: true, availableTemplates: Object.keys(TEMPLATES) }, 200, reqOrigin, config.allowedOrigins);
    }

    case '/api/communication/status': {
      if (!messageId) {
        return createErrorResponse('Field "messageId" is required.', 400, reqOrigin, config.allowedOrigins, 'VALIDATION_ERROR');
      }
      const log = getMessageStatus(messageId);
      if (!log) {
        return createErrorResponse(`Message ID ${messageId} not found.`, 404, reqOrigin, config.allowedOrigins, 'NOT_FOUND');
      }
      return createJsonResponse({ success: true, log: log }, 200, reqOrigin, config.allowedOrigins);
    }

    case '/api/communication/history': {
      const targetPhone = recipient || mobile;
      if (!targetPhone) {
        return createErrorResponse('Field "recipient" or "mobile" is required.', 400, reqOrigin, config.allowedOrigins, 'VALIDATION_ERROR');
      }
      const history = getConversationHistory(targetPhone);
      return createJsonResponse({ success: true, recipient: targetPhone, history: history }, 200, reqOrigin, config.allowedOrigins);
    }

    case '/api/communication/retry': {
      if (!messageId) {
        return createErrorResponse('Field "messageId" is required for retry.', 400, reqOrigin, config.allowedOrigins, 'VALIDATION_ERROR');
      }
      const updated = updateMessageStatus(messageId, 'Retrying');
      return createJsonResponse({ success: true, messageId: messageId, status: 'Retrying', log: updated }, 200, reqOrigin, config.allowedOrigins);
    }

    case '/api/communication/webhook': {
      if (body.entry && body.entry[0] && body.entry[0].changes) {
        const change = body.entry[0].changes[0].value;
        if (change.statuses && change.statuses[0]) {
          const statusEvent = change.statuses[0];
          updateMessageStatus(statusEvent.id, statusEvent.status);
        }
      }
      return createJsonResponse({ success: true, status: 'Webhook received' }, 200, reqOrigin, config.allowedOrigins);
    }

    // 11. Admin & RBAC Endpoints
    case '/api/admin/users': {
      const auth = await protectRoute(request, 'Admin', env, config);
      if (!auth.authorized) {
        return createErrorResponse(auth.error, auth.status, reqOrigin, config.allowedOrigins, 'FORBIDDEN');
      }
      return createJsonResponse({ success: true, users: [] }, 200, reqOrigin, config.allowedOrigins);
    }

    case '/api/admin/roles': {
      const auth = await protectRoute(request, 'Admin', env, config);
      if (!auth.authorized) {
        return createErrorResponse(auth.error, auth.status, reqOrigin, config.allowedOrigins, 'FORBIDDEN');
      }
      return createJsonResponse({ success: true, matrix: getRolePermissionsMatrix() }, 200, reqOrigin, config.allowedOrigins);
    }

    case '/api/admin/security-logs': {
      const auth = await protectRoute(request, 'Admin', env, config);
      if (!auth.authorized) {
        return createErrorResponse(auth.error, auth.status, reqOrigin, config.allowedOrigins, 'FORBIDDEN');
      }
      const logs = await getAuditLogs(env, config);
      return createJsonResponse({ success: true, logs: logs }, 200, reqOrigin, config.allowedOrigins);
    }

    // 12. AI Operations Center Endpoints
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
        return createErrorResponse('Field "query" or "message" is required for business analysis.', 400, reqOrigin, config.allowedOrigins, 'VALIDATION_ERROR');
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

    // 13. AI Content Studio Endpoints
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

    // 14. AI Student Assistant Endpoints
    case '/api/ai/student-chat':
    case '/api/ai/course-advisor':
    case '/api/ai/admission-faq': {
      const userText = message || userMessage || (messages && messages[messages.length - 1]?.content) || '';
      if (!userText && (!messages || messages.length === 0)) {
        return createErrorResponse('Field "message" or "messages" is required.', 400, reqOrigin, config.allowedOrigins, 'VALIDATION_ERROR');
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
        return createErrorResponse('Name and at least Mobile or Email are required to create a lead.', 400, reqOrigin, config.allowedOrigins, 'VALIDATION_ERROR');
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

    // 15. Additional AI Endpoints
    case '/api/ai/admission': {
      const userText = message || userMessage || '';
      if (!userText) {
        return createErrorResponse('Field "message" is required for admission assistance.', 400, reqOrigin, config.allowedOrigins, 'VALIDATION_ERROR');
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
        return createErrorResponse('Field "message" or "context" (user background/goal) is required.', 400, reqOrigin, config.allowedOrigins, 'VALIDATION_ERROR');
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
        return createErrorResponse('Field "context" or "message" with student enquiry details is required.', 400, reqOrigin, config.allowedOrigins, 'VALIDATION_ERROR');
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
        return createErrorResponse('Field "message" or "context" to summarize is required.', 400, reqOrigin, config.allowedOrigins, 'VALIDATION_ERROR');
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

    // 16. AI Counsellor Engine Endpoints
    case '/api/ai/lead-analysis':
    case '/api/ai/recommendation':
    case '/api/ai/counsellor-summary':
    case '/api/ai/followup-plan': {
      const targetLeadData = leadData || body;
      if (!targetLeadData || (!targetLeadData.course && !targetLeadData.message && !targetLeadData.name && !targetLeadData.mobile)) {
        return createErrorResponse('Valid lead details (course, message, or leadData object) are required.', 400, reqOrigin, config.allowedOrigins, 'VALIDATION_ERROR');
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
      return createErrorResponse(`Endpoint ${path} not found.`, 404, reqOrigin, config.allowedOrigins, 'NOT_FOUND');
  }
}
