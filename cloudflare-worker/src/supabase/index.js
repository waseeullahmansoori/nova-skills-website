/**
 * Shared Supabase Client Module for Cloudflare Worker
 * Uses SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY
 */

import { SupabaseWorkerClient } from './client.js';

export function getSupabaseClient(env, config) {
  return new SupabaseWorkerClient(env, config);
}

export async function testSupabaseConnection(env, config) {
  const supabaseUrl = config.supabaseUrl || env?.SUPABASE_URL || '';
  const serviceRoleKey = config.supabaseServiceRoleKey || env?.SUPABASE_SERVICE_ROLE_KEY || '';
  const anonKey = config.supabaseAnonKey || env?.SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || (!serviceRoleKey && !anonKey)) {
    return {
      success: false,
      database: "disconnected",
      error: "Supabase environment variables (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY) are missing."
    };
  }

  try {
    const keyToUse = serviceRoleKey || anonKey;
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': keyToUse,
        'Authorization': `Bearer ${keyToUse}`
      }
    });

    if (response.ok || response.status === 200 || response.status === 404) {
      return {
        success: true,
        database: "connected"
      };
    }

    const errText = await response.text();
    return {
      success: false,
      database: "disconnected",
      error: `Supabase ping returned status ${response.status}: ${errText}`
    };

  } catch (err) {
    return {
      success: false,
      database: "disconnected",
      error: err.message
    };
  }
}
