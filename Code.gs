/**
 * ============================================================
 * NOVA SKILLS — Lead Management System (Backend V2)
 * Production Google Apps Script Web App
 * ============================================================
 * 
 * Instructions:
 * 1. Open your Google Sheet linked to the Web App (or Apps Script Editor).
 * 2. Paste this complete script into Code.gs.
 * 3. Deploy as Web App (Execute as: Me, Access: Anyone).
 * 4. Keep existing Web App URL unchanged.
 */

'use strict';

// Global Configuration
const SPREADSHEET_ID = ''; // Optional fallback ID if script is not bound to a Sheet

// Sheet Names
const SHEETS = {
  LEADS: 'Leads',
  LOGS: 'Logs',
  ERRORS: 'Errors',
  DASHBOARD: 'Dashboard',
  SETTINGS: 'Settings'
};

// Required Columns for Leads Sheet
const LEADS_COLUMNS = [
  'Lead ID',
  'Timestamp',
  'Status',
  'Name',
  'Mobile',
  'Email',
  'Course',
  'City',
  'Message',
  'Page URL',
  'Referrer',
  'UTM Source',
  'UTM Medium',
  'UTM Campaign',
  'UTM Content',
  'UTM Term',
  'Public IP',
  'Browser',
  'Device',
  'OS',
  'Screen Resolution',
  'Timezone',
  'WhatsApp Number',
  'Counsellor',
  'Remarks',
  'Follow-up Date'
];

/**
 * Main Web App POST Handler
 */
function doPost(e) {
  const startTime = new Date().getTime();
  const lock = LockService.getScriptLock();
  
  // Acquire lock up to 10 seconds to prevent race conditions & duplicate Lead IDs
  try {
    lock.waitLock(10000);
  } catch (lockErr) {
    logError('doPost', 'Script lock timeout', lockErr.stack, '');
    return createJsonResponse(false, null, 'Error', 'Server busy. Please try again.');
  }

  let payload = {};
  
  try {
    // Parse incoming payload safely
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        // Fallback for form-encoded parameter data
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const ss = getSpreadsheet();
    if (!ss) {
      throw new Error('Spreadsheet could not be accessed.');
    }

    // Ensure all required sheets and structures exist
    setupEnvironment(ss);

    // Extract & sanitize lead fields
    const name = (payload.name || payload.fullName || '').trim();
    const mobile = (payload.mobile || payload.phone || '').trim();
    const email = (payload.email || '').trim().toLowerCase();
    const course = (payload.course || payload.interest || '').trim();
    const city = (payload.city || '').trim();
    const message = (payload.message || payload.comment || '').trim();
    const pageUrl = (payload.pageUrl || payload.url || '').trim();
    const referrer = (payload.referrer || '').trim();
    const utmSource = (payload.utmSource || payload.utm_source || '').trim();
    const utmMedium = (payload.utmMedium || payload.utm_medium || '').trim();
    const utmCampaign = (payload.utmCampaign || payload.utm_campaign || '').trim();
    const utmContent = (payload.utmContent || payload.utm_content || '').trim();
    const utmTerm = (payload.utmTerm || payload.utm_term || '').trim();
    const publicIP = (payload['public IP'] || payload.publicIP || payload.ip || '').trim();
    const browser = (payload.browser || '').trim();
    const device = (payload.device || '').trim();
    const os = (payload.os || '').trim();
    const screenResolution = (payload.screenResolution || '').trim();
    const timezone = (payload.timezone || '').trim();
    const whatsAppNumber = (payload.whatsAppNumber || mobile || '').trim();

    const leadsSheet = ss.getSheetByName(SHEETS.LEADS);

    // Perform Duplicate Detection (Mobile OR Email)
    const isDuplicate = checkDuplicate(leadsSheet, mobile, email);
    const leadStatus = isDuplicate ? 'Duplicate' : 'New';

    // Auto-generate sequential Lead ID (e.g. NS000001)
    const leadId = generateLeadId(ss);

    // Prepare row matching LEADS_COLUMNS order
    const timestamp = new Date();
    const rowData = [
      leadId,
      timestamp,
      leadStatus,
      name,
      mobile,
      email,
      course,
      city,
      message,
      pageUrl,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      publicIP,
      browser,
      device,
      os,
      screenResolution,
      timezone,
      whatsAppNumber,
      '', // Counsellor (blank for assignment)
      '', // Remarks
      ''  // Follow-up Date
    ];

    // Append lead row to Leads Sheet
    leadsSheet.appendRow(rowData);

    const endTime = new Date().getTime();
    const executionTimeMs = endTime - startTime;

    // Log successful submission
    logSubmission(ss, leadId, leadStatus, executionTimeMs);

    return createJsonResponse(true, leadId, leadStatus, 'Enquiry submitted successfully');

  } catch (err) {
    logError('doPost', err.message || String(err), err.stack || '', JSON.stringify(payload));
    return createJsonResponse(false, null, 'Error', 'An error occurred while saving enquiry.');
  } finally {
    lock.releaseLock();
  }
}

/**
 * Web App GET Handler (Status check)
 */
function doGet(e) {
  return createJsonResponse(true, null, 'Active', 'Nova Skills Lead Management API v2.0 is running.');
}

/**
 * Gets Active Spreadsheet or opens by ID fallback
 */
function getSpreadsheet() {
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {}

  if (SPREADSHEET_ID) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return null;
}

/**
 * Environment Setup: Auto-creates required sheets & column headers
 */
function setupEnvironment(ss) {
  // 1. Leads Sheet Setup
  let leadsSheet = ss.getSheetByName(SHEETS.LEADS);
  if (!leadsSheet) {
    leadsSheet = ss.insertSheet(SHEETS.LEADS);
    leadsSheet.appendRow(LEADS_COLUMNS);
    styleHeaderRow(leadsSheet);
  } else {
    ensureHeaders(leadsSheet, LEADS_COLUMNS);
  }

  // 2. Logs Sheet Setup
  let logsSheet = ss.getSheetByName(SHEETS.LOGS);
  if (!logsSheet) {
    logsSheet = ss.insertSheet(SHEETS.LOGS);
    logsSheet.appendRow(['Timestamp', 'Lead ID', 'Status', 'Execution Time', 'Message']);
    styleHeaderRow(logsSheet);
  }

  // 3. Errors Sheet Setup
  let errorsSheet = ss.getSheetByName(SHEETS.ERRORS);
  if (!errorsSheet) {
    errorsSheet = ss.insertSheet(SHEETS.ERRORS);
    errorsSheet.appendRow(['Timestamp', 'Error Message', 'Function', 'Stack', 'Payload']);
    styleHeaderRow(errorsSheet);
  }

  // 4. Dashboard Sheet Setup
  let dashboardSheet = ss.getSheetByName(SHEETS.DASHBOARD);
  if (!dashboardSheet) {
    dashboardSheet = ss.insertSheet(SHEETS.DASHBOARD);
    dashboardSheet.appendRow(['Metric', 'Value', 'Last Updated']);
    dashboardSheet.appendRow(['Total Leads', '=COUNTA(Leads!A2:A)', '=NOW()']);
    dashboardSheet.appendRow(['New Leads', '=COUNTIF(Leads!C2:C, "New")', '=NOW()']);
    dashboardSheet.appendRow(['Duplicate Leads', '=COUNTIF(Leads!C2:C, "Duplicate")', '=NOW()']);
    styleHeaderRow(dashboardSheet);
  }

  // 5. Settings Sheet Setup (WhatsApp Architecture Preparation)
  let settingsSheet = ss.getSheetByName(SHEETS.SETTINGS);
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet(SHEETS.SETTINGS);
    settingsSheet.appendRow(['Key', 'Value', 'Description']);
    styleHeaderRow(settingsSheet);
  }

  // Ensure default Settings keys exist
  const defaultSettings = [
    { key: 'Last Lead ID Number', value: 0, desc: 'Last numeric ID counter for Lead ID generation' },
    { key: 'WhatsApp Enabled', value: 'false', desc: 'Enable/Disable automatic WhatsApp notification' },
    { key: 'WhatsApp Number', value: '', desc: 'Business WhatsApp phone number' },
    { key: 'WhatsApp API Mode', value: '', desc: 'API Provider mode (e.g. Meta Cloud API)' },
    { key: 'Meta Access Token', value: '', desc: 'Meta Business API Permanent Access Token' },
    { key: 'Phone Number ID', value: '', desc: 'Meta Business Phone Number ID' },
    { key: 'Template Name', value: '', desc: 'Approved Meta WhatsApp Template Name' }
  ];

  const existingSettings = getSettingsMap(settingsSheet);

  defaultSettings.forEach(setting => {
    if (!(setting.key in existingSettings)) {
      settingsSheet.appendRow([setting.key, setting.value, setting.desc]);
    }
  });
}

/**
 * Ensures header row contains all required columns without duplicating existing ones
 */
function ensureHeaders(sheet, requiredColumns) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(requiredColumns);
    styleHeaderRow(sheet);
    return;
  }

  const existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] || [];
  const missingColumns = [];

  requiredColumns.forEach(col => {
    if (!existingHeaders.includes(col)) {
      missingColumns.push(col);
    }
  });

  if (missingColumns.length > 0) {
    const nextCol = sheet.getLastColumn() + 1;
    sheet.getRange(1, nextCol, 1, missingColumns.length).setValues([missingColumns]);
  }
}

/**
 * Header Row Styling Helper
 */
function styleHeaderRow(sheet) {
  try {
    const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
    headerRange.setBackground('#011731')
               .setFontColor('#FFFFFF')
               .setFontWeight('bold')
               .setFontFamily('Plus Jakarta Sans');
    sheet.setFrozenRows(1);
  } catch (e) {}
}

/**
 * Duplicate Detection: Checks Mobile or Email
 */
function checkDuplicate(leadsSheet, mobile, email) {
  const lastRow = leadsSheet.getLastRow();
  if (lastRow <= 1) return false; // Only headers present

  const headers = leadsSheet.getRange(1, 1, 1, leadsSheet.getLastColumn()).getValues()[0];
  const mobileColIdx = headers.indexOf('Mobile');
  const emailColIdx = headers.indexOf('Email');

  if (mobileColIdx === -1 && emailColIdx === -1) return false;

  const dataRange = leadsSheet.getRange(2, 1, lastRow - 1, headers.length).getValues();

  const cleanMobile = mobile.replace(/\D/g, '');
  const cleanEmail = email.trim().toLowerCase();

  for (let i = 0; i < dataRange.length; i++) {
    const row = dataRange[i];

    if (cleanMobile && mobileColIdx !== -1) {
      const rowMobile = String(row[mobileColIdx] || '').replace(/\D/g, '');
      if (rowMobile && rowMobile === cleanMobile) {
        return true;
      }
    }

    if (cleanEmail && emailColIdx !== -1) {
      const rowEmail = String(row[emailColIdx] || '').trim().toLowerCase();
      if (rowEmail && rowEmail === cleanEmail) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Lead ID Generator: Sequential NS000001 format
 */
function generateLeadId(ss) {
  const settingsSheet = ss.getSheetByName(SHEETS.SETTINGS);
  let lastNum = 0;

  if (settingsSheet && settingsSheet.getLastRow() > 1) {
    const data = settingsSheet.getRange(2, 1, settingsSheet.getLastRow() - 1, 2).getValues();
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === 'Last Lead ID Number') {
        lastNum = parseInt(data[i][1], 10) || 0;
        break;
      }
    }
  }

  // If lastNum is 0, check max existing lead ID in Leads sheet
  if (lastNum === 0) {
    const leadsSheet = ss.getSheetByName(SHEETS.LEADS);
    if (leadsSheet && leadsSheet.getLastRow() > 1) {
      const leadIds = leadsSheet.getRange(2, 1, leadsSheet.getLastRow() - 1, 1).getValues();
      leadIds.forEach(row => {
        const match = String(row[0] || '').match(/^NS(\d+)$/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > lastNum) lastNum = num;
        }
      });
    }
  }

  const nextNum = lastNum + 1;
  const newLeadId = 'NS' + String(nextNum).padStart(6, '0');

  // Update Settings Sheet
  updateSettingValue(settingsSheet, 'Last Lead ID Number', nextNum);

  return newLeadId;
}

/**
 * Settings Reader Helper
 */
function getSettingsMap(settingsSheet) {
  const settingsMap = {};
  if (!settingsSheet || settingsSheet.getLastRow() <= 1) return settingsMap;

  const data = settingsSheet.getRange(2, 1, settingsSheet.getLastRow() - 1, 2).getValues();
  data.forEach(row => {
    if (row[0]) {
      settingsMap[row[0]] = row[1];
    }
  });

  return settingsMap;
}

/**
 * Updates a setting key-value pair in Settings sheet
 */
function updateSettingValue(settingsSheet, key, value) {
  if (!settingsSheet) return;
  const lastRow = settingsSheet.getLastRow();
  if (lastRow <= 1) {
    settingsSheet.appendRow([key, value, 'Auto-generated setting']);
    return;
  }

  const keys = settingsSheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (let i = 0; i < keys.length; i++) {
    if (keys[i][0] === key) {
      settingsSheet.getRange(i + 2, 2).setValue(value);
      return;
    }
  }

  // Key not found, append
  settingsSheet.appendRow([key, value, 'Auto-generated setting']);
}

/**
 * Log successful submission to Logs sheet
 */
function logSubmission(ss, leadId, status, executionTimeMs) {
  try {
    const logsSheet = ss.getSheetByName(SHEETS.LOGS);
    if (logsSheet) {
      logsSheet.appendRow([
        new Date(),
        leadId,
        status,
        executionTimeMs + ' ms',
        'Lead processed successfully'
      ]);
    }
  } catch (e) {}
}

/**
 * Log exception to Errors sheet
 */
function logError(funcName, errorMsg, stack, payloadStr) {
  try {
    const ss = getSpreadsheet();
    if (ss) {
      let errorsSheet = ss.getSheetByName(SHEETS.ERRORS);
      if (!errorsSheet) {
        errorsSheet = ss.insertSheet(SHEETS.ERRORS);
        errorsSheet.appendRow(['Timestamp', 'Error Message', 'Function', 'Stack', 'Payload']);
      }
      errorsSheet.appendRow([
        new Date(),
        errorMsg,
        funcName,
        stack,
        payloadStr
      ]);
    }
  } catch (e) {
    console.error('Failed to log error to Errors sheet:', e);
  }
}

/**
 * Standardized JSON Output Helper
 */
function createJsonResponse(success, leadId, status, message) {
  const response = {
    success: success,
    leadId: leadId || '',
    status: status || '',
    message: message || ''
  };

  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}
