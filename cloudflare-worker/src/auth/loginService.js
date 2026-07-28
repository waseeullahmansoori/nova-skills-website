/**
 * Login Service for Supabase Auth MVP
 * Supports Admin and Student role login. Public registration remains disabled.
 */

import { SupabaseAuthHelper } from './authHelper.js';

export async function loginUser(email, password, env, config) {
  const authHelper = new SupabaseAuthHelper(env, config);

  if (!authHelper.isConfigured()) {
    // Simulated fallback for local dev / unconfigured secrets
    return {
      success: true,
      user: {
        id: `usr-simulated-01`,
        email: email,
        role: email.includes('admin') ? 'Admin' : 'Student'
      },
      accessToken: `sb_simulated_access_token_${Date.now()}`,
      refreshToken: `sb_simulated_refresh_token_${Date.now()}`,
      expiresIn: 86400,
      simulated: true
    };
  }

  const response = await fetch(`${authHelper.supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: authHelper.getHeaders(),
    body: JSON.stringify({ email: email, password: password })
  });

  if (!response.ok) {
    const errText = await response.text();
    let errJson = {};
    try { errJson = JSON.parse(errText); } catch (e) {}
    throw new Error(errJson.error_description || errJson.msg || `Invalid login credentials.`);
  }

  const data = await response.json();
  const role = data.user?.user_metadata?.role || (email.includes('admin') ? 'Admin' : 'Student');

  return {
    success: true,
    user: {
      id: data.user.id,
      email: data.user.email,
      role: role
    },
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in
  };
}
