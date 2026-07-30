/**
 * Nova Skills AI Career Advisor — Lead Capture & Admin Routes
 * GET /api/leads
 * GET /api/leads/:id
 * POST /api/leads
 * PATCH /api/leads/:id/status
 * POST /api/leads/:id/notes
 */

import { LeadService } from '../services/lead.js';
import { DashboardService } from '../services/dashboard.js';
import { LeadRepository } from '../repositories/leadRepository.js';
import { createSuccessResponse, createErrorResponse } from '../utils/response.js';
import { HTTP_STATUS } from '../config/constants.js';

export async function handleLeadRoute(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/$/, '');
  const method = request.method;

  // 1. POST /api/leads — Create or update lead
  if (method === 'POST' && (pathname === '/api/leads' || pathname === '/api/lead')) {
    let body;
    try {
      body = await request.json();
    } catch (err) {
      return createErrorResponse('Invalid JSON payload body', HTTP_STATUS.BAD_REQUEST);
    }

    const lead = await LeadService.processLeadFromSession({ sessionId: body.sessionId }, body, env);
    return createSuccessResponse({
      leadId: lead.leadId,
      sessionId: lead.sessionId,
      leadScore: lead.leadScore,
      qualificationStatus: lead.qualificationStatus,
      message: 'Lead captured successfully'
    }, HTTP_STATUS.CREATED);
  }

  // 2. PATCH /api/leads/:id/status or PATCH /api/leads/:id — Update lead status
  if (method === 'PATCH' && pathname.includes('/api/leads')) {
    const parts = pathname.split('/');
    const leadId = parts[3]; // e.g. /api/leads/lead_123/status
    if (!leadId) {
      return createErrorResponse('Lead ID required in URL path', HTTP_STATUS.BAD_REQUEST);
    }

    let body;
    try {
      body = await request.json();
    } catch (err) {
      return createErrorResponse('Invalid JSON payload body', HTTP_STATUS.BAD_REQUEST);
    }

    const newStatus = body.status || body.qualificationStatus;
    if (!newStatus) {
      return createErrorResponse('Status field required', HTTP_STATUS.BAD_REQUEST);
    }

    const updated = await DashboardService.updateStatus(leadId, newStatus, env);
    if (!updated) {
      return createErrorResponse('Lead not found', HTTP_STATUS.NOT_FOUND);
    }

    return createSuccessResponse({ lead: updated, message: 'Status updated successfully' });
  }

  // 3. POST /api/leads/:id/notes — Add note to lead
  if (method === 'POST' && pathname.includes('/notes')) {
    const parts = pathname.split('/');
    const leadId = parts[3];
    if (!leadId) {
      return createErrorResponse('Lead ID required in URL path', HTTP_STATUS.BAD_REQUEST);
    }

    let body;
    try {
      body = await request.json();
    } catch (err) {
      return createErrorResponse('Invalid JSON payload body', HTTP_STATUS.BAD_REQUEST);
    }

    if (!body.note && !body.text) {
      return createErrorResponse('Note content required', HTTP_STATUS.BAD_REQUEST);
    }

    const updated = await DashboardService.addNote(leadId, body.note || body.text, env);
    if (!updated) {
      return createErrorResponse('Lead not found', HTTP_STATUS.NOT_FOUND);
    }

    return createSuccessResponse({ lead: updated, message: 'Note added successfully' });
  }

  // 4. GET /api/leads — List all leads
  if (method === 'GET' && (pathname === '/api/leads' || pathname === '/api/leads/')) {
    const leads = await LeadRepository.getAllLeads();
    return createSuccessResponse({ leads, count: leads.length });
  }

  // 5. GET /api/leads/:id — Retrieve single lead details
  if (method === 'GET' && pathname.startsWith('/api/leads')) {
    const segments = pathname.split('/');
    let targetId = segments[3];

    if (!targetId) {
      targetId = url.searchParams.get('id') || url.searchParams.get('sessionId');
    }

    if (!targetId) {
      const leads = await LeadRepository.getAllLeads();
      return createSuccessResponse({ leads, count: leads.length });
    }

    const lead = await LeadService.getLead(targetId, env);
    if (!lead) {
      return createErrorResponse('Lead record not found', HTTP_STATUS.NOT_FOUND);
    }

    return createSuccessResponse({ lead });
  }

  return createErrorResponse('Lead endpoint method not allowed', HTTP_STATUS.METHOD_NOT_ALLOWED);
}
