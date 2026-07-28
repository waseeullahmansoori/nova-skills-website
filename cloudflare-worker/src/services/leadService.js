/**
 * Lead Forwarder Service for Cloudflare Worker Backend Gateway
 * Forwards validated leads to live Google Apps Script CRM Web App
 */

const APPS_SCRIPT_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbzRHK2n1D0WjWw4NxcwtH7FQb7eRsZxVagFnYtiz5quAFec2BLfwgJ26C0OG6FTKcPB/exec';

export async function forwardLeadToAppsScript(leadPayload) {
  try {
    const response = await fetch(APPS_SCRIPT_WEBAPP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(leadPayload)
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        success: false,
        message: 'Apps Script CRM returned non-200 status.',
        errorCode: `CRM_HTTP_${response.status}`,
        details: errText
      };
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error forwarding lead to Apps Script CRM:', err);
    return {
      success: false,
      message: 'Failed to communicate with Google Apps Script CRM.',
      errorCode: 'CRM_NETWORK_ERROR',
      details: err.message
    };
  }
}
