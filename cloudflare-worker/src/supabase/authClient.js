/**
 * Supabase Auth API Adapter for Cloudflare Worker
 */

export class SupabaseAuthClient {
  constructor(env, config) {
    this.supabaseUrl = config.supabaseUrl || env?.SUPABASE_URL || '';
    this.serviceRoleKey = config.supabaseServiceRoleKey || env?.SUPABASE_SERVICE_ROLE_KEY || '';
  }

  isConfigured() {
    return Boolean(this.supabaseUrl && this.serviceRoleKey);
  }

  getHeaders() {
    return {
      'apikey': this.serviceRoleKey,
      'Authorization': `Bearer ${this.serviceRoleKey}`,
      'Content-Type': 'application/json'
    };
  }

  async signUp(email, password, userData = {}) {
    if (!this.isConfigured()) {
      return {
        user: { id: `supabase-user-${Date.now()}`, email: email, ...userData },
        session: { access_token: `sb_simulated_token_${Date.now()}` },
        simulated: true
      };
    }

    const response = await fetch(`${this.supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        email: email,
        password: password,
        data: userData
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Supabase Auth SignUp failed: ${errText}`);
    }

    return await response.json();
  }

  async signInWithPassword(email, password) {
    if (!this.isConfigured()) {
      return {
        user: { id: `sb-user-01`, email: email, role: 'Student' },
        access_token: `sb_access_token_${Date.now()}`,
        expires_in: 3600,
        simulated: true
      };
    }

    const response = await fetch(`${this.supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Supabase Auth Password Sign-in failed: ${errText}`);
    }

    return await response.json();
  }

  async resetPassword(email) {
    if (!this.isConfigured()) {
      return { success: true, simulated: true };
    }

    const response = await fetch(`${this.supabaseUrl}/auth/v1/recover`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email: email })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Supabase Auth Password Recover failed: ${errText}`);
    }

    return await response.json();
  }
}
