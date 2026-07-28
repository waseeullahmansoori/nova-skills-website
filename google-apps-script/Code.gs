/**
 * ============================================================
 * NOVA SKILLS — Lead Management System & CRM (Backend V2.5)
 * Production Google Apps Script Web App & CRM Engine
 * ============================================================
 * 
 * CRM Features:
 * - Full Lead Status Pipeline (New, Attempted Contact, Contacted, Demo Scheduled, Follow-up, Interested, Admission Confirmed, Enrolled, Lost)
 * - Lead Priority (High, Medium, Low)
 * - Assigned Counsellor Tracking
 * - Follow-up Tracking (Last Contact Date, Next Follow-up Date, Follow-up Counter)
 * - Unlimited Formatted Remarks (YYYY-MM-DD HH:mm - Note)
 * - Automated Real-time Dashboard (Lead Pipeline, Course & Source Analytics)
 * - Configurable CRM Settings (Institute Name, Emails, Working Hours, Counsellor Defaults)
 * - Enterprise Security (Honeypot, 5-Min Rate Limiting, Server Validation, Bot Blocking, Error Logging)
 * - 100% Backward Compatible with Website Frontend
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

// Required Columns for Leads CRM Sheet
const LEADS_COLUMNS = [
  'Lead ID',
  'Timestamp',
  'Status',
  'Priority',
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
  'Assigned Counsellor',
  'Last Contact Date',
  'Next Follow-up Date',
  'Number of Follow-ups',
  'Remarks'
];

/**
 * Main Web App POST Handler
 */
function doPost(e) {
  const startTime = new Date().getTime();
  const lock = LockService.getScriptLock();
  
  // Acquire script lock (10s max) to ensure atomic Lead ID generation & sheet writes
  try {
    lock.waitLock(10000);
  } catch (lockErr) {
    logSecurityError(null, 'Script lock timeout', '', '', '', lockErr.stack || '');
    return createJsonResponse(false, null, 'Error', 'Server busy. Please try again.');
  }

  let payload = {};
  
  try {
    // Parse incoming payload safely
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const ss = getSpreadsheet();
    if (!ss) {
      throw new Error('Spreadsheet could not be accessed.');
    }

    // Ensure all required sheets, columns, formulas, and settings exist
    setupEnvironment(ss);

    const settingsSheet = ss.getSheetByName(SHEETS.SETTINGS);
    const settings = getSettingsMap(settingsSheet);

    // Context metadata
    const publicIP = (payload['public IP'] || payload.publicIP || payload.ip || '').trim();
    const origin = (payload.origin || payload.referrer || (e && e.parameter ? e.parameter.origin : '') || '').trim();
    const userAgent = (payload.userAgent || payload.browser || '').trim();

    // 1. HONEYPOT SPAM PROTECTION ('website' field)
    const spamProtectionEnabled = settings['Spam Protection Enabled'] !== 'false';
    const honeypotValue = (payload.website || '').trim();

    if (spamProtectionEnabled && honeypotValue !== '') {
      logSecurityError(ss, 'Spam detected.', publicIP, origin, userAgent, 'Honeypot website field filled: ' + honeypotValue);
      return createJsonResponse(false, null, 'Spam', 'Spam detected.');
    }

    // 2. BOT USER-AGENT CHECK
    const botDetectionEnabled = settings['Bot Detection Enabled'] !== 'false';
    if (botDetectionEnabled && isBotUserAgent(userAgent)) {
      logSecurityError(ss, 'Bot detected.', publicIP, origin, userAgent, 'Blocked bot user-agent');
      return createJsonResponse(false, null, 'BotBlocked', 'Access denied.');
    }

    // 3. ORIGIN VALIDATION
    const originValidationEnabled = String(settings['Origin Validation Enabled']).toLowerCase() === 'true';
    const allowedDomains = settings['Allowed Domains'] || 'https://novaskills.in,https://www.novaskills.in';

    if (originValidationEnabled && !isValidOrigin(origin, allowedDomains)) {
      logSecurityError(ss, 'Unauthorized origin.', publicIP, origin, userAgent, 'Origin not allowed');
      return createJsonResponse(false, null, 'UnauthorizedOrigin', 'Unauthorized origin.');
    }

    // 4. SERVER-SIDE FIELD VALIDATION
    const validationResult = validatePayloadFields(payload);
    if (!validationResult.valid) {
      logSecurityError(ss, 'Validation failed.', publicIP, origin, userAgent, validationResult.error);
      return createJsonResponse(false, null, 'ValidationError', validationResult.error);
    }

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
    const browser = (payload.browser || '').trim();
    const device = (payload.device || '').trim();
    const os = (payload.os || '').trim();
    const screenResolution = (payload.screenResolution || '').trim();
    const timezone = (payload.timezone || '').trim();
    const whatsAppNumber = (payload.whatsAppNumber || mobile || '').trim();

    const leadsSheet = ss.getSheetByName(SHEETS.LEADS);

    // 5. RATE LIMITING (5-minute window per Mobile/Email)
    const rateLimitMinutes = parseInt(settings['Rate Limit Minutes'], 10) || 5;
    if (isRateLimited(leadsSheet, mobile, email, rateLimitMinutes)) {
      logSecurityError(ss, 'Rate limit exceeded.', publicIP, origin, userAgent, 'Submission within ' + rateLimitMinutes + ' min window');
      return createJsonResponse(false, null, 'RateLimited', 'Please wait before submitting again.');
    }

    // 6. DUPLICATE DETECTION & LEAD STATUS
    const isDuplicate = checkDuplicate(leadsSheet, mobile, email);
    const leadStatus = isDuplicate ? 'Duplicate' : 'New';
    const leadPriority = payload.priority || 'Medium';

    // Auto-generate Lead ID (e.g. NS000001)
    const leadId = generateLeadId(ss);

    // Assign default counsellor if specified
    const defaultCounsellor = settings['Default Counsellor'] && settings['Default Counsellor'] !== 'Unassigned' 
      ? settings['Default Counsellor'] 
      : '';

    const timestamp = new Date();
    
    // Initial Remark format: YYYY-MM-DD HH:mm - Remark
    const initialRemark = message ? `${formatDateFormatted(timestamp)} - ${message}` : `${formatDateFormatted(timestamp)} - Initial Web Form Enquiry`;

    const rowData = [
      leadId,
      timestamp,
      leadStatus,
      leadPriority,
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
      defaultCounsellor, // Assigned Counsellor
      '',                // Last Contact Date
      '',                // Next Follow-up Date
      0,                 // Number of Follow-ups
      initialRemark      // Remarks
    ];

    leadsSheet.appendRow(rowData);

    const endTime = new Date().getTime();
    const executionTimeMs = endTime - startTime;

    // Log successful submission
    logSubmission(ss, leadId, leadStatus, executionTimeMs);

    return createJsonResponse(true, leadId, leadStatus, 'Enquiry submitted successfully');

  } catch (err) {
    logSecurityError(getSpreadsheet(), 'Unhandled Exception', '', '', '', (err.message || String(err)) + '\n' + (err.stack || ''));
    return createJsonResponse(false, null, 'Error', 'An error occurred while saving enquiry.');
  } finally {
    lock.releaseLock();
  }
}

/**
 * Web App GET Handler (Status & CRM Health Check)
 */
function doGet(e) {
  return createJsonResponse(true, null, 'Active', 'Nova Skills Lead Management System & CRM v2.5 is running.');
}

/**
 * Server-Side Field Validation Rules
 */
function validatePayloadFields(payload) {
  const name = (payload.name || payload.fullName || '').trim();
  const mobile = (payload.mobile || payload.phone || '').trim().replace(/\D/g, '');
  const email = (payload.email || '').trim().toLowerCase();
  const course = (payload.course || payload.interest || '').trim();
  const message = (payload.message || payload.comment || '').trim();

  // Name: Min 2, Max 100
  if (!name || name.length < 2 || name.length > 100) {
    return { valid: false, error: 'Name must be between 2 and 100 characters.' };
  }

  // Mobile: Exactly 10 digits
  if (!mobile || mobile.length !== 10) {
    return { valid: false, error: 'Please enter a valid 10-digit mobile number.' };
  }

  // Email: Valid format if provided
  if (email && email.length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, error: 'Please enter a valid email address.' };
    }
  }

  // Course: Required
  if (!course) {
    return { valid: false, error: 'Course selection is required.' };
  }

  // Message: Maximum 1000 characters
  if (message && message.length > 1000) {
    return { valid: false, error: 'Message cannot exceed 1000 characters.' };
  }

  return { valid: true };
}

/**
 * Bot User Agent Detection
 */
function isBotUserAgent(userAgent) {
  if (!userAgent) return false;
  const ua = String(userAgent).toLowerCase();
  const botPatterns = ['curl', 'wget', 'python', 'scrapy', 'postman', 'headlesschrome', 'phantomjs', 'axios/'];
  return botPatterns.some(pattern => ua.includes(pattern));
}

/**
 * Origin Validation Check
 */
function isValidOrigin(originStr, allowedDomainsStr) {
  if (!originStr) return true;
  if (!allowedDomainsStr) return true;

  const origin = originStr.toLowerCase();
  const domains = allowedDomainsStr.split(',').map(d => d.trim().toLowerCase());
  return domains.some(domain => domain && origin.includes(domain));
}

/**
 * Rate Limiting Check (5-minute sliding window)
 */
function isRateLimited(leadsSheet, mobile, email, rateLimitMinutes) {
  const lastRow = leadsSheet.getLastRow();
  if (lastRow <= 1) return false;

  const headers = leadsSheet.getRange(1, 1, 1, leadsSheet.getLastColumn()).getValues()[0];
  const timeIdx = headers.indexOf('Timestamp');
  const mobileIdx = headers.indexOf('Mobile');
  const emailIdx = headers.indexOf('Email');

  if (timeIdx === -1) return false;

  const data = leadsSheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  const nowMs = new Date().getTime();
  const windowMs = (rateLimitMinutes || 5) * 60 * 1000;

  const cleanMobile = mobile ? mobile.replace(/\D/g, '') : '';
  const cleanEmail = email ? email.trim().toLowerCase() : '';

  for (let i = data.length - 1; i >= 0; i--) {
    const row = data[i];
    const rowDate = new Date(row[timeIdx]);
    const rowMs = rowDate.getTime();

    if (isNaN(rowMs)) continue;

    if (nowMs - rowMs > windowMs) {
      break;
    }

    if (cleanMobile && mobileIdx !== -1) {
      const rowMobile = String(row[mobileIdx] || '').replace(/\D/g, '');
      if (rowMobile && rowMobile === cleanMobile) {
        return true;
      }
    }

    if (cleanEmail && emailIdx !== -1) {
      const rowEmail = String(row[emailIdx] || '').trim().toLowerCase();
      if (rowEmail && rowEmail === cleanEmail) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Environment Setup: Auto-creates required sheets, headers, formulas & settings
 */
function setupEnvironment(ss) {
  // 1. Leads Sheet
  let leadsSheet = ss.getSheetByName(SHEETS.LEADS);
  if (!leadsSheet) {
    leadsSheet = ss.insertSheet(SHEETS.LEADS);
    leadsSheet.appendRow(LEADS_COLUMNS);
    styleHeaderRow(leadsSheet);
  } else {
    ensureHeaders(leadsSheet, LEADS_COLUMNS);
  }

  // Add Data Validation dropdowns for Status & Priority if possible
  addLeadDataValidations(leadsSheet);

  // 2. Logs Sheet
  let logsSheet = ss.getSheetByName(SHEETS.LOGS);
  if (!logsSheet) {
    logsSheet = ss.insertSheet(SHEETS.LOGS);
    logsSheet.appendRow(['Timestamp', 'Lead ID', 'Status', 'Execution Time', 'Message']);
    styleHeaderRow(logsSheet);
  }

  // 3. Errors Sheet
  let errorsSheet = ss.getSheetByName(SHEETS.ERRORS);
  if (!errorsSheet) {
    errorsSheet = ss.insertSheet(SHEETS.ERRORS);
    errorsSheet.appendRow(['Timestamp', 'Reason', 'IP', 'Origin', 'User Agent', 'Details']);
    styleHeaderRow(errorsSheet);
  } else {
    ensureHeaders(errorsSheet, ['Timestamp', 'Reason', 'IP', 'Origin', 'User Agent', 'Details']);
  }

  // 4. Dashboard Sheet (Comprehensive CRM Metrics & Analytics)
  setupDashboardSheet(ss);

  // 5. Settings Sheet (Institute & CRM Config)
  setupSettingsSheet(ss);
}

/**
 * Setup Dashboard Sheet with Metrics, Course & Source Analytics
 */
function setupDashboardSheet(ss) {
  let dashboardSheet = ss.getSheetByName(SHEETS.DASHBOARD);
  if (!dashboardSheet) {
    dashboardSheet = ss.insertSheet(SHEETS.DASHBOARD);
  }

  // Re-build Dashboard structure safely
  dashboardSheet.clear();

  // Title Banner
  dashboardSheet.getRange(1, 1, 1, 4).merge()
    .setValue('📊 NOVA SKILLS CRM — EXECUTIVE DASHBOARD')
    .setBackground('#011731')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  // Section 1: Lead Pipeline Overview
  dashboardSheet.getRange(3, 1, 1, 3).merge()
    .setValue('📌 LEAD PIPELINE METRICS')
    .setBackground('#0599a8')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold');

  const pipelineRows = [
    ['Metric Name', 'Formula / Value', 'Last Updated'],
    ['Total Leads', '=COUNTA(Leads!A2:A)', '=NOW()'],
    ['Today\'s Leads', '=COUNTIF(Leads!B2:B, ">=" & TODAY())', '=NOW()'],
    ['This Week', '=COUNTIFS(Leads!B2:B, ">=" & (TODAY()-WEEKDAY(TODAY(),2)+1), Leads!B2:B, "<=" & (TODAY()+7-WEEKDAY(TODAY(),2)))', '=NOW()'],
    ['This Month', '=COUNTIFS(Leads!B2:B, ">=" & DATE(YEAR(TODAY()), MONTH(TODAY()), 1))', '=NOW()'],
    ['New Leads', '=COUNTIF(Leads!C2:C, "New")', '=NOW()'],
    ['Duplicate Leads', '=COUNTIF(Leads!C2:C, "Duplicate")', '=NOW()'],
    ['Attempted / Contacted', '=COUNTIF(Leads!C2:C, "Contacted") + COUNTIF(Leads!C2:C, "Attempted Contact")', '=NOW()'],
    ['Interested / Demo', '=COUNTIF(Leads!C2:C, "Interested") + COUNTIF(Leads!C2:C, "Demo Scheduled")', '=NOW()'],
    ['Admissions / Enrolled', '=COUNTIF(Leads!C2:C, "Admission Confirmed") + COUNTIF(Leads!C2:C, "Enrolled")', '=NOW()'],
    ['Lost Leads', '=COUNTIF(Leads!C2:C, "Lost")', '=NOW()']
  ];

  dashboardSheet.getRange(4, 1, pipelineRows.length, 3).setValues(pipelineRows);
  dashboardSheet.getRange(4, 1, 1, 3).setFontWeight('bold').setBackground('#F1F5F9');

  // Section 2: Course Analytics
  dashboardSheet.getRange(16, 1, 1, 3).merge()
    .setValue('🎓 COURSE ANALYTICS')
    .setBackground('#0599a8')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold');

  const courseRows = [
    ['Academy Niche', 'Total Enquiries', 'Share %'],
    ['Digital Marketing', '=COUNTIF(Leads!H2:H, "*Digital Marketing*")', '=IF(B18>0, B18/B5, 0)'],
    ['Graphic Design', '=COUNTIF(Leads!H2:H, "*Design*")', '=IF(B19>0, B19/B5, 0)'],
    ['Video Editing', '=COUNTIF(Leads!H2:H, "*Video*")', '=IF(B20>0, B20/B5, 0)'],
    ['Motion Graphics', '=COUNTIF(Leads!H2:H, "*Motion*")', '=IF(B21>0, B21/B5, 0)'],
    ['Python', '=COUNTIF(Leads!H2:H, "*Python*")', '=IF(B22>0, B22/B5, 0)'],
    ['Web Development', '=COUNTIF(Leads!H2:H, "*Web*") + COUNTIF(Leads!H2:H, "*Coding*")', '=IF(B23>0, B23/B5, 0)'],
    ['AI & Automation', '=COUNTIF(Leads!H2:H, "*AI*")', '=IF(B24>0, B24/B5, 0)']
  ];

  dashboardSheet.getRange(17, 1, courseRows.length, 3).setValues(courseRows);
  dashboardSheet.getRange(17, 1, 1, 3).setFontWeight('bold').setBackground('#F1F5F9');
  dashboardSheet.getRange(18, 3, 7, 1).setNumberFormat('0.0%');

  // Section 3: Source Analytics
  dashboardSheet.getRange(26, 1, 1, 3).merge()
    .setValue('🌐 TRAFFIC & SOURCE ANALYTICS')
    .setBackground('#0599a8')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold');

  const sourceRows = [
    ['Traffic Source', 'Lead Count', 'Conversion Share'],
    ['Organic Search', '=COUNTIFS(Leads!M2:M, "", Leads!L2:L, "*google*") + COUNTIFS(Leads!M2:M, "", Leads!L2:L, "*bing*")', '=IF(B28>0, B28/B5, 0)'],
    ['Google Ads', '=COUNTIF(Leads!M2:M, "*google*")', '=IF(B29>0, B29/B5, 0)'],
    ['Facebook Ads', '=COUNTIF(Leads!M2:M, "*facebook*") + COUNTIF(Leads!M2:M, "*fb*")', '=IF(B30>0, B30/B5, 0)'],
    ['Instagram Ads', '=COUNTIF(Leads!M2:M, "*instagram*") + COUNTIF(Leads!M2:M, "*ig*")', '=IF(B31>0, B31/B5, 0)'],
    ['WhatsApp', '=COUNTIF(Leads!M2:M, "*whatsapp*")', '=IF(B32>0, B32/B5, 0)'],
    ['Direct Traffic', '=COUNTIFS(Leads!M2:M, "", Leads!L2:L, "")', '=IF(B33>0, B33/B5, 0)'],
    ['Referral', '=COUNTIF(Leads!M2:M, "*referral*")', '=IF(B34>0, B34/B5, 0)']
  ];

  dashboardSheet.getRange(27, 1, sourceRows.length, 3).setValues(sourceRows);
  dashboardSheet.getRange(27, 1, 1, 3).setFontWeight('bold').setBackground('#F1F5F9');
  dashboardSheet.getRange(28, 3, 7, 1).setNumberFormat('0.0%');

  // Auto-fit columns
  try {
    dashboardSheet.autoResizeColumns(1, 3);
  } catch (e) {}
}

/**
 * Setup Settings Sheet with CRM & Security Defaults
 */
function setupSettingsSheet(ss) {
  let settingsSheet = ss.getSheetByName(SHEETS.SETTINGS);
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet(SHEETS.SETTINGS);
    settingsSheet.appendRow(['Key', 'Value', 'Description']);
    styleHeaderRow(settingsSheet);
  }

  const defaultSettings = [
    { key: 'Institute Name', value: 'Nova Skills', desc: 'Official Institute Name for communications' },
    { key: 'Admin Email', value: 'admin@novaskills.in', desc: 'Primary administrator notification email' },
    { key: 'Support Email', value: 'hello@novaskills.in', desc: 'Student support email' },
    { key: 'WhatsApp Number', value: '+91 XXXXX XXXXX', desc: 'Institute WhatsApp business number' },
    { key: 'Default Counsellor', value: 'Unassigned', desc: 'Default assigned counsellor for incoming leads' },
    { key: 'Working Hours', value: 'Mon–Sat: 9:00 AM – 7:00 PM', desc: 'Institute operational hours' },
    { key: 'Business Days', value: 'Mon,Tue,Wed,Thu,Fri,Sat', desc: 'Active business days' },

    { key: 'Last Lead ID Number', value: 0, desc: 'Last numeric ID counter for Lead ID generation' },
    { key: 'Rate Limit Minutes', value: 5, desc: 'Minutes window to block repeated submissions by same Mobile/Email' },
    { key: 'Spam Protection Enabled', value: 'true', desc: 'Enable/Disable Honeypot spam rejection' },
    { key: 'Origin Validation Enabled', value: 'false', desc: 'Enable/Disable strict domain origin checking' },
    { key: 'Allowed Domains', value: 'https://novaskills.in,https://www.novaskills.in', desc: 'Comma separated list of allowed domain origins' },
    { key: 'Bot Detection Enabled', value: 'true', desc: 'Enable/Disable bot User-Agent blocking' },

    { key: 'WhatsApp Enabled', value: 'false', desc: 'Enable/Disable automatic WhatsApp notification' },
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
 * Data Validation Dropdowns for Leads Sheet (Status & Priority)
 */
function addLeadDataValidations(leadsSheet) {
  try {
    const headers = leadsSheet.getRange(1, 1, 1, leadsSheet.getLastColumn()).getValues()[0];
    const statusColIdx = headers.indexOf('Status') + 1;
    const priorityColIdx = headers.indexOf('Priority') + 1;

    if (statusColIdx > 0) {
      const statusRule = SpreadsheetApp.newDataValidation()
        .requireValueInList([
          'New',
          'Attempted Contact',
          'Contacted',
          'Demo Scheduled',
          'Follow-up',
          'Interested',
          'Admission Confirmed',
          'Enrolled',
          'Lost',
          'Duplicate'
        ], true)
        .build();
      leadsSheet.getRange(2, statusColIdx, 500, 1).setDataValidation(statusRule);
    }

    if (priorityColIdx > 0) {
      const priorityRule = SpreadsheetApp.newDataValidation()
        .requireValueInList(['High', 'Medium', 'Low'], true)
        .build();
      leadsSheet.getRange(2, priorityColIdx, 500, 1).setDataValidation(priorityRule);
    }
  } catch (e) {}
}

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

function checkDuplicate(leadsSheet, mobile, email) {
  const lastRow = leadsSheet.getLastRow();
  if (lastRow <= 1) return false;

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

  updateSettingValue(settingsSheet, 'Last Lead ID Number', nextNum);
  return newLeadId;
}

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

  settingsSheet.appendRow([key, value, 'Auto-generated setting']);
}

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

function logSecurityError(ssInstance, reason, ip, origin, userAgent, details) {
  try {
    const ss = ssInstance || getSpreadsheet();
    if (ss) {
      let errorsSheet = ss.getSheetByName(SHEETS.ERRORS);
      if (!errorsSheet) {
        errorsSheet = ss.insertSheet(SHEETS.ERRORS);
        errorsSheet.appendRow(['Timestamp', 'Reason', 'IP', 'Origin', 'User Agent', 'Details']);
      }
      errorsSheet.appendRow([
        new Date(),
        reason || 'Error',
        ip || '',
        origin || '',
        userAgent || '',
        details || ''
      ]);
    }
  } catch (e) {
    console.error('Failed to log security error:', e);
  }
}

function formatDateFormatted(dateObj) {
  try {
    const date = dateObj || new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  } catch (e) {
    return String(dateObj);
  }
}

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
