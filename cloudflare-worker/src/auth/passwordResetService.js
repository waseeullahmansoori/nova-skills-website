/**
 * Password Reset & Recovery Flow Service
 */

import { SupabaseAuthHelper } from './authHelper.js';

export async function requestPasswordReset(email, env, config) {
  const authHelper = new SupabaseAuthHelper(env, config);

  if (!authHelper.isConfigured()) {
    return {
      success: true,
      message: 'Password reset recovery email dispatched (Simulated).',
      simulated: true
    };
  }

  const response = await fetch(`${authHelper.supabaseUrl}/auth/v1/recover`, {
    method: 'POST',
    headers: authHelper.getHeaders(),
    body: JSON.stringify({ email: email })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Password reset request failed: ${errText}`);
  }

  return {
    success: true,
    message: 'Password reset recovery email dispatched successfully.'
  };
}
