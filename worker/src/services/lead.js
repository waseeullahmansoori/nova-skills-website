/**
 * Nova Skills AI Career Advisor — Lead Capture & CRM Service
 * Version: 7.0.0 (Lead Capture & Qualification Engine)
 * 
 * Manages lead creation, scoring, categorization, summary generation,
 * and persistence using the decoupled LeadRepository.
 */

import { LeadRepository } from '../repositories/leadRepository.js';
import { normalizeLeadData, validatePhone, validateEmail } from '../utils/leadValidation.js';

export class LeadService {
  /**
   * Calculates Lead Score (0–100) based on profile completeness and qualification
   */
  static calculateLeadScore(lead = {}) {
    let score = 0;

    const phoneRes = validatePhone(lead.phone);
    if (phoneRes.isValid) score += 25;

    const emailRes = validateEmail(lead.email);
    if (emailRes.isValid) score += 15;

    if (lead.careerGoal) score += 15;
    if (lead.qualification) score += 10;
    if (lead.budget) score += 10;
    if (lead.recommendedCourse) score += 10;
    if (lead.name) score += 10;
    if (lead.preferredLearningMode || lead.preferredMode) score += 5;

    return Math.min(score, 100);
  }

  /**
   * Categorizes lead based on score threshold
   * @returns {'Hot' | 'Warm' | 'Cold'}
   */
  static categorizeLead(score = 0) {
    if (score >= 70) return 'Hot';
    if (score >= 40) return 'Warm';
    return 'Cold';
  }

  /**
   * Generates automatic human-readable conversation summary
   */
  static generateSummary(lead = {}) {
    const parts = [];
    parts.push(`Student ${lead.name || 'Candidate'} profile:`);
    if (lead.qualification) parts.push(`- Qualification: ${lead.qualification}`);
    if (lead.currentStatus) parts.push(`- Current Status: ${lead.currentStatus}`);
    if (lead.careerGoal) parts.push(`- Career Goal: ${lead.careerGoal}`);
    if (lead.budget) parts.push(`- Budget: ${lead.budget}`);
    if (lead.preferredLearningMode || lead.preferredMode) parts.push(`- Learning Mode: ${lead.preferredLearningMode || lead.preferredMode}`);
    if (lead.recommendedCourse) parts.push(`- Recommended Course: ${lead.recommendedCourse}`);
    parts.push(`- Lead Quality: ${lead.qualificationStatus || 'Cold'} (Score: ${lead.leadScore || 0}/100)`);

    return parts.join('\n');
  }

  /**
   * Processes session memory and user message to create or update a lead
   * @param {Object} session - Session object containing memory & history
   * @param {Object} extraDetails - Additional lead fields (e.g. phone, email, city)
   * @param {Object} env - Cloudflare Worker environment bindings
   * @returns {Promise<Object>} Processed lead object
   */
  static async processLeadFromSession(session = {}, extraDetails = {}, env = {}) {
    const memory = session.memory || {};
    const sessionId = session.sessionId || extraDetails.sessionId;

    // Check for pre-existing lead by session ID
    let existingLead = null;
    if (sessionId) {
      existingLead = await LeadRepository.getLeadBySessionId(sessionId, env);
    }

    const leadId = existingLead ? existingLead.leadId : `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const rawLead = {
      leadId: leadId,
      sessionId: sessionId || null,
      name: extraDetails.name || memory.name || existingLead?.name || null,
      phone: extraDetails.phone || memory.phone || existingLead?.phone || null,
      email: extraDetails.email || memory.email || existingLead?.email || null,
      city: extraDetails.city || memory.city || existingLead?.city || null,
      qualification: memory.qualification || existingLead?.qualification || null,
      currentStatus: memory.currentStatus || existingLead?.currentStatus || null,
      careerGoal: memory.careerGoal || existingLead?.careerGoal || null,
      interest: memory.interest || existingLead?.interest || null,
      recommendedCourse: memory.recommendedCourse || existingLead?.recommendedCourse || null,
      budget: memory.budget || existingLead?.budget || null,
      preferredLearningMode: memory.preferredMode || existingLead?.preferredLearningMode || null,
      leadSource: extraDetails.leadSource || 'Nova AI Career Advisor Widget',
      status: existingLead?.status || 'NEW'
    };

    // Normalize & validate
    const normalized = normalizeLeadData(rawLead);

    // Calculate score & categorization
    const score = this.calculateLeadScore(normalized);
    const category = this.categorizeLead(score);

    normalized.leadScore = score;
    normalized.qualificationStatus = category;
    normalized.conversationSummary = this.generateSummary(normalized);

    // Persist lead
    return await LeadRepository.saveLead(normalized, env);
  }

  /**
   * Retrieves a lead by ID or session ID
   */
  static async getLead(leadIdOrSessionId, env = {}) {
    let lead = await LeadRepository.getLeadById(leadIdOrSessionId, env);
    if (!lead) {
      lead = await LeadRepository.getLeadBySessionId(leadIdOrSessionId, env);
    }
    return lead;
  }
}
