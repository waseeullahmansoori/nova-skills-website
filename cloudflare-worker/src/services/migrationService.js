/**
 * Staged Lead Sync & Migration Service
 * Syncs Google Sheets CRM leads into Supabase Database safely.
 */

import { createStudentInSupabase } from './supabaseService.js';

export async function syncLeadToSupabase(leadPayload, env, config) {
  try {
    const studentResult = await createStudentInSupabase({
      name: leadPayload.name || leadPayload.fullName,
      mobile: leadPayload.mobile,
      email: leadPayload.email,
      city: leadPayload.city,
      studentCode: leadPayload.leadId || `LEAD-${Date.now().toString().slice(-4)}`
    }, env, config);

    return {
      success: true,
      syncedToSupabase: true,
      simulated: studentResult.simulated || false,
      data: studentResult.data
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}
