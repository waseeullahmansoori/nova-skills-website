/**
 * Nova Skills AI Career Advisor — Dashboard & Analytics Service
 * Version: 9.0.0 (Admin Dashboard & Lead CRM)
 * 
 * Aggregates summary statistics, tracks counselling pipeline stages,
 * handles lead status transitions, and manages administrative notes.
 */

import { LeadRepository } from '../repositories/leadRepository.js';

export class DashboardService {
  /**
   * Generates summary statistics and aggregated metrics for the Admin Dashboard
   * @param {Object} env - Cloudflare Worker environment bindings
   * @returns {Promise<Object>} Aggregated metrics object
   */
  static async getStats(env = {}) {
    const allLeads = await LeadRepository.getAllLeads();
    const todayStr = new Date().toISOString().split('T')[0];

    let totalLeads = allLeads.length;
    let todaysLeads = 0;
    let hotLeads = 0;
    let warmLeads = 0;
    let coldLeads = 0;
    let admissionsBooked = 0;
    let totalScoreSum = 0;

    const pipelineCounts = {
      'New': 0,
      'Contacted': 0,
      'Assessment Completed': 0,
      'Counselling Scheduled': 0,
      'Interested': 0,
      'Admitted': 0,
      'Closed': 0
    };

    const coursePopularityMap = {};

    allLeads.forEach(lead => {
      // Today's leads check
      if (lead.createdAt && lead.createdAt.startsWith(todayStr)) {
        todaysLeads++;
      }

      // Qualification quality
      const quality = lead.qualificationStatus || 'Cold';
      if (quality === 'Hot') hotLeads++;
      else if (quality === 'Warm') warmLeads++;
      else coldLeads++;

      // Pipeline status
      const status = lead.status || 'New';
      if (status === 'Admitted') admissionsBooked++;
      if (pipelineCounts.hasOwnProperty(status)) {
        pipelineCounts[status]++;
      } else {
        pipelineCounts['New']++;
      }

      // Score accumulator
      totalScoreSum += (lead.leadScore || 0);

      // Course popularity
      if (lead.recommendedCourse) {
        coursePopularityMap[lead.recommendedCourse] = (coursePopularityMap[lead.recommendedCourse] || 0) + 1;
      }
    });

    const avgLeadScore = totalLeads > 0 ? Math.round(totalScoreSum / totalLeads) : 0;

    // Recent activity stream (last 5 updated leads)
    const recentActivity = [...allLeads]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, 5)
      .map(lead => ({
        leadId: lead.leadId,
        name: lead.name || 'Anonymous Student',
        status: lead.status || 'New',
        score: lead.leadScore || 0,
        recommendedCourse: lead.recommendedCourse || 'General Guidance',
        updatedAt: lead.updatedAt || lead.createdAt
      }));

    return {
      totalLeads,
      todaysLeads,
      hotLeads,
      warmLeads,
      coldLeads,
      admissionsBooked,
      avgLeadScore,
      totalConversations: totalLeads,
      pipelineCounts,
      coursePopularity: coursePopularityMap,
      recentActivity,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Updates lead pipeline status
   */
  static async updateStatus(leadId, newStatus, env = {}) {
    const lead = await LeadRepository.getLeadById(leadId, env) || await LeadRepository.getLeadBySessionId(leadId, env);
    if (!lead) return null;

    lead.status = newStatus;
    return await LeadRepository.saveLead(lead, env);
  }

  /**
   * Appends an administrative note to a lead record
   */
  static async addNote(leadId, noteText, env = {}) {
    const lead = await LeadRepository.getLeadById(leadId, env) || await LeadRepository.getLeadBySessionId(leadId, env);
    if (!lead) return null;

    const timestamp = new Date().toISOString();
    const formattedNote = `[${timestamp.slice(0, 16).replace('T', ' ')}] ${noteText}`;

    if (Array.isArray(lead.notes)) {
      lead.notes.push(formattedNote);
    } else if (typeof lead.notes === 'string' && lead.notes.trim()) {
      lead.notes = [lead.notes, formattedNote];
    } else {
      lead.notes = [formattedNote];
    }

    return await LeadRepository.saveLead(lead, env);
  }
}
