/**
 * Supabase Client Wrapper for Cloudflare Worker
 * Uses isolated SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY secrets.
 */

export class SupabaseWorkerClient {
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
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }

  async from(tableName) {
    return new SupabaseQueryBuilder(this.supabaseUrl, tableName, this.getHeaders(), this.isConfigured());
  }
}

class SupabaseQueryBuilder {
  constructor(baseUrl, tableName, headers, isConfigured) {
    this.baseUrl = baseUrl;
    this.tableName = tableName;
    this.headers = headers;
    this.configured = isConfigured;
  }

  async select(columns = '*') {
    if (!this.configured) {
      return { data: [], error: null, simulated: true };
    }

    const url = `${this.baseUrl}/rest/v1/${this.tableName}?select=${encodeURIComponent(columns)}`;
    const response = await fetch(url, { method: 'GET', headers: this.headers });

    if (!response.ok) {
      const errText = await response.text();
      return { data: null, error: errText };
    }

    const data = await response.json();
    return { data: data, error: null };
  }

  async insert(record) {
    if (!this.configured) {
      return {
        data: [{ id: `simulated-uuid-${Date.now()}`, ...record }],
        error: null,
        simulated: true
      };
    }

    const url = `${this.baseUrl}/rest/v1/${this.tableName}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(record)
    });

    if (!response.ok) {
      const errText = await response.text();
      return { data: null, error: errText };
    }

    const data = await response.json();
    return { data: data, error: null };
  }
}
