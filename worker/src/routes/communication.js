/**
 * Nova Skills Platform — Communication & Automation Routes
 * POST /api/email/send
 * POST /api/whatsapp/send
 * POST /api/notifications/send
 * GET /api/notifications
 * GET /api/communications/logs
 * POST /api/automation/run
 */

import { CommunicationService } from '../services/communication.js';
import { CommunicationRepository } from '../repositories/communicationRepository.js';
import { createSuccessResponse, createErrorResponse } from '../utils/response.js';
import { HTTP_STATUS } from '../config/constants.js';

export async function handleCommunicationRoute(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/$/, '');
  const method = request.method;

  // 1. POST /api/email/send
  if (method === 'POST' && pathname === '/api/email/send') {
    let body;
    try { body = await request.json(); } catch(e) {
      return createErrorResponse('Invalid JSON body payload', HTTP_STATUS.BAD_REQUEST);
    }

    const res = await CommunicationService.sendEmail(body, env);
    return createSuccessResponse(res);
  }

  // 2. POST /api/whatsapp/send
  if (method === 'POST' && pathname === '/api/whatsapp/send') {
    let body;
    try { body = await request.json(); } catch(e) {
      return createErrorResponse('Invalid JSON body payload', HTTP_STATUS.BAD_REQUEST);
    }

    const res = await CommunicationService.sendWhatsApp(body, env);
    return createSuccessResponse(res);
  }

  // 3. GET /api/notifications — Get student notifications
  if (method === 'GET' && pathname === '/api/notifications') {
    const userId = url.searchParams.get('userId') || 'usr_student_demo';
    const notifications = await CommunicationRepository.getStudentNotifications(userId);
    return createSuccessResponse({ notifications, unreadCount: notifications.filter(n => !n.isRead).length });
  }

  // 4. POST /api/notifications/send — Create in-app notification
  if (method === 'POST' && pathname === '/api/notifications/send') {
    let body;
    try { body = await request.json(); } catch(e) {
      return createErrorResponse('Invalid JSON body payload', HTTP_STATUS.BAD_REQUEST);
    }

    const notif = await CommunicationRepository.saveNotification(body, env);
    return createSuccessResponse({ notification: notif, message: 'Notification sent' }, HTTP_STATUS.CREATED);
  }

  // 5. GET /api/communications/logs — List communication logs
  if (method === 'GET' && (pathname === '/api/communications/logs' || pathname === '/api/communication/logs')) {
    const channel = url.searchParams.get('channel');
    const logs = await CommunicationRepository.getLogs({ channel });
    return createSuccessResponse({ logs, count: logs.length });
  }

  // 6. POST /api/automation/run — Trigger automation rules
  if (method === 'POST' && pathname === '/api/automation/run') {
    let body;
    try { body = await request.json(); } catch(e) {
      return createErrorResponse('Invalid JSON body payload', HTTP_STATUS.BAD_REQUEST);
    }

    const res = await CommunicationService.runAutomation(body.triggerEvent || 'NEW_LEAD', body.payload || {}, env);
    return createSuccessResponse(res);
  }

  return createErrorResponse('Communication endpoint method not allowed', HTTP_STATUS.METHOD_NOT_ALLOWED);
}
