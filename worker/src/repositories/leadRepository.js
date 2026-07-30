/**
 * Nova Skills AI Career Advisor — Lead Repository Interface
 * Version: 9.0.0 (Repository Pattern + Google Sheets Delegation)
 * 
 * Decoupled storage repository supporting local memory store, Cloudflare KV,
 * and automatic delegation to Google Sheets CRM (GoogleSheetsRepository).
 */

import { GoogleSheetsRepository } from './googleSheetsRepository.js';

const IN_MEMORY_LEADS = new Map();

export class LeadRepository {
  /**
   * Saves or updates a lead record
   * @param {Object} lead - Structured lead object
   * @param {Object} env - Cloudflare Worker environment bindings
   * @returns {Promise<Object>} Saved lead object
   */
  static async saveLead(lead, env = {}) {
    if (!lead || !lead.leadId) return null;

    const timestamp = new Date().toISOString();
    const existing = await this.getLeadById(lead.leadId, env) || {};

    const updatedLead = {
      ...existing,
      ...lead,
      updatedAt: timestamp
    };

    if (!updatedLead.createdAt) {
      updatedLead.createdAt = timestamp;
    }

    // 1. Always save in local memory cache
    IN_MEMORY_LEADS.set(updatedLead.leadId, updatedLead);
    if (updatedLead.sessionId) {
      IN_MEMORY_LEADS.set(`session:${updatedLead.sessionId}`, updatedLead.leadId);
    }

    // 2. Always save in Cloudflare KV if available
    if (env.AI_LEADS && typeof env.AI_LEADS.put === 'function') {
      try {
        await env.AI_LEADS.put(`lead:${updatedLead.leadId}`, JSON.stringify(updatedLead));
        if (updatedLead.sessionId) {
          await env.AI_LEADS.put(`session:${updatedLead.sessionId}`, updatedLead.leadId);
        }
      } catch (e) {
        console.warn('[LeadRepository] KV Write Error:', e.message);
      }
    }

    // 3. Delegate to Google Sheets CRM if env.GOOGLE_APPS_SCRIPT_URL is configured
    if (env.GOOGLE_APPS_SCRIPT_URL) {
      const sheetsResult = await GoogleSheetsRepository.saveLead(updatedLead, env);
      updatedLead.googleSheetsSync = sheetsResult;
    }

    return updatedLead;
  }

  /**
   * Retrieves a lead by leadId
   */
  static async getLeadById(leadId, env = {}) {
    if (!leadId) return null;

    if (IN_MEMORY_LEADS.has(leadId)) {
      return IN_MEMORY_LEADS.get(leadId);
    }

    if (env.AI_LEADS && typeof env.AI_LEADS.get === 'function') {
      try {
        const raw = await env.AI_LEADS.get(`lead:${leadId}`, { type: 'json' });
        if (raw) return raw;
      } catch (e) {}
    }

    return null;
  }

  /**
   * Retrieves a lead by sessionId
   */
  static async getLeadBySessionId(sessionId, env = {}) {
    if (!sessionId) return null;

    if (IN_MEMORY_LEADS.has(`session:${sessionId}`)) {
      const leadId = IN_MEMORY_LEADS.get(`session:${sessionId}`);
      return this.getLeadById(leadId, env);
    }

    if (env.AI_LEADS && typeof env.AI_LEADS.get === 'function') {
      try {
        const leadId = await env.AI_LEADS.get(`session:${sessionId}`);
        if (leadId) return this.getLeadById(leadId, env);
      } catch (e) {}
    }

    return null;
  }

  /**
   * Returns all stored leads
   */
  static async getAllLeads() {
    const list = [];
    for (const [key, value] of IN_MEMORY_LEADS.entries()) {
      if (!key.startsWith('session:') && typeof value === 'object') {
        list.push(value);
      }
    }
    return list;
  }

  /**
   * Storage Health Check
   */
  static async getHealth(env = {}) {
    return GoogleSheetsRepository.checkHealth(env);
  }
}
