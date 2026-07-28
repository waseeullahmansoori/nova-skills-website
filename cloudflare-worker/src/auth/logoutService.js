/**
 * Logout Service for Supabase Auth MVP
 * Revokes current session bearer token.
 */

import { SupabaseAuthHelper } from './authHelper.js';

export async function logoutUser(accessToken, env, config) {
  const authHelper = new SupabaseAuthHelper(env, config);

  if (!authHelper.isConfigured() || !accessToken) {
    return { success: true, message: 'Logged out successfully (Simulated).' };
  }

  try {
    await fetch(`${authHelper.supabaseUrl}/auth/v1/logout`, {
      method: 'POST',
      headers: authHelper.getHeaders(accessToken)
    });
  } catch (err) {
    console.warn('Supabase remote logout warning:', err.message);
  }

  return { success: true, message: 'Logged out successfully.' };
}
