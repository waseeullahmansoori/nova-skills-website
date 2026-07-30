/**
 * Nova Skills AI Career Advisor — Google Sheets CRM Repository
 * Version: 8.0.0 (Google Sheets Repository + Exponential Backoff Retry)
 * 
 * Communicates securely with Google Apps Script Web App using env.GOOGLE_APPS_SCRIPT_URL.
 * Features automatic retries with exponential backoff and connection status monitoring.
 */

import { CONFIG_DEFAULTS, HTTP_STATUS } from '../config/constants.js';

let lastSuccessfulWriteTimestamp = null;
let lastConnectionStatus = 'untested';

export class GoogleSheetsRepository {
  /**
   * Saves or updates a lead record in Google Sheets
   * @param {Object} lead - Structured lead object
   * @param {Object} env - Cloudflare Worker environment bindings
   * @returns {Promise<Object>} Save result status
   */
  static async saveLead(lead, env = {}) {
    const webAppUrl = env.GOOGLE_APPS_SCRIPT_URL;

    if (!webAppUrl) {
      console.warn('[GoogleSheetsRepository Warning] GOOGLE_APPS_SCRIPT_URL is not set in environment. Skipping Google Sheets sync.');
      lastConnectionStatus = 'not_configured';
      return { success: false, reason: 'GOOGLE_APPS_SCRIPT_URL missing' };
    }

    let attempt = 0;
    let delay = CONFIG_DEFAULTS.INITIAL_RETRY_DELAY_MS;
    let lastError = null;

    while (attempt < CONFIG_DEFAULTS.MAX_CRM_RETRIES) {
      attempt++;
      const startTime = Date.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG_DEFAULTS.CRM_TIMEOUT_MS);

      try {
        const response = await fetch(webAppUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(lead),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        const latencyMs = Date.now() - startTime;

        if (response.ok) {
          const resData = await response.json();
          if (resData && resData.success !== false) {
            lastSuccessfulWriteTimestamp = new Date().toISOString();
            lastConnectionStatus = 'connected';
            console.log(`[GoogleSheetsRepository Success] Attempt: ${attempt} | Latency: ${latencyMs}ms | Action: ${resData.action || 'saved'}`);
            return { success: true, action: resData.action || 'saved', attempts: attempt };
          }
        }

        lastError = `Google Apps Script returned status ${response.status}`;
        console.warn(`[GoogleSheetsRepository Retry] Attempt ${attempt} failed: ${lastError}`);

      } catch (err) {
        clearTimeout(timeoutId);
        const latencyMs = Date.now() - startTime;
        lastError = err.name === 'AbortError' ? 'Request Timeout (10s)' : err.message;
        console.warn(`[GoogleSheetsRepository Exception] Attempt ${attempt}/${CONFIG_DEFAULTS.MAX_CRM_RETRIES} failed (${latencyMs}ms): ${lastError}`);
      }

      // Exponential backoff delay before retrying
      if (attempt < CONFIG_DEFAULTS.MAX_CRM_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // 500ms -> 1000ms -> 2000ms
      }
    }

    lastConnectionStatus = 'error';
    console.error(`[GoogleSheetsRepository Error] Failed after ${CONFIG_DEFAULTS.MAX_CRM_RETRIES} attempts. Last error: ${lastError}`);

    return {
      success: false,
      error: lastError,
      attempts: CONFIG_DEFAULTS.MAX_CRM_RETRIES
    };
  }

  /**
   * Health Check: Retrieves repository connection status
   * @param {Object} env - Cloudflare Worker environment bindings
   */
  static async checkHealth(env = {}) {
    const isConfigured = Boolean(env.GOOGLE_APPS_SCRIPT_URL);

    return {
      repositoryType: 'GoogleSheetsRepository',
      isConfigured: isConfigured,
      connectionStatus: isConfigured ? lastConnectionStatus : 'not_configured',
      lastSuccessfulWrite: lastSuccessfulWriteTimestamp,
      timestamp: new Date().toISOString()
    };
  }
}
