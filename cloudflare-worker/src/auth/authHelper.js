/**
 * Supabase Auth API Helper Module
 */

export class SupabaseAuthHelper {
  constructor(env, config) {
    this.supabaseUrl = config.supabaseUrl || env?.SUPABASE_URL || '';
    this.anonKey = config.supabaseAnonKey || env?.SUPABASE_ANON_KEY || '';
    this.serviceRoleKey = config.supabaseServiceRoleKey || env?.SUPABASE_SERVICE_ROLE_KEY || '';
  }

  isConfigured() {
    return Boolean(this.supabaseUrl && (this.anonKey || this.serviceRoleKey));
  }

  getHeaders(token = null) {
    const key = this.anonKey || this.serviceRoleKey;
    const headers = {
      'apikey': key,
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      headers['Authorization'] = `Bearer ${key}`;
    }
    return headers;
  }
}
