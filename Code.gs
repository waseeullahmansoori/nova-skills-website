/**
 * ============================================================
 * NOVA SKILLS — Lead Management System & CRM (Backend V4.0)
 * Event-Driven Automation Engine & Notification Center
 * ============================================================
 * 
 * Features:
 * - Event-Driven Architecture (NEW_LEAD, LEAD_UPDATED, STATUS_CHANGED, FOLLOWUP_DUE, ADMISSION_CONFIRMED, ENROLLED)
 * - Centralized Notification Module (EMAIL, WHATSAPP ClickToChat & Business API Ready, SYSTEM_LOG)
 * - Dynamic WhatsApp Click-to-Chat Link Generation (https://wa.me/919695904440?text=...)
 * - Extended JSON Success Response including "whatsappUrl"
 * - Configurable Settings (Institute Name, Website, Emails, WhatsApp Defaults)
 * - Automation Event & Security Error Logging
 * - Automated Daily, Weekly & Monthly Reports
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

// Automation Event Names
const AUTOMATION_EVENTS = {
  NEW_LEAD: 'NEW_LEAD',
  LEAD_UPDATED: 'LEAD_UPDATED',
  STATUS_CHANGED: 'STATUS_CHANGED',
  FOLLOWUP_DUE: 'FOLLOWUP_DUE',
  ADMISSION_CONFIRMED: 'ADMISSION_CONFIRMED',
  ENROLLED: 'ENROLLED'
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
  
  try {
    lock.waitLock(10000);
  } catch (lockErr) {
    logSecurityError(null, 'Script lock timeout', '', '', '', lockErr.stack || '');
    return createJsonResponse(false, null, 'Error', 'Server busy. Please try again.');
  }

  let payload = {};
  
  try {
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

    setupEnvironment(ss);

    const settingsSheet = ss.getSheetByName(SHEETS.SETTINGS);
    const settings = getSettingsMap(settingsSheet);

    const publicIP = (payload['public IP'] || payload.publicIP || payload.ip || '').trim();
    const origin = (payload.origin || payload.referrer || (e && e.parameter ? e.parameter.origin : '') || '').trim();
    const userAgent = (payload.userAgent || payload.browser || '').trim();

    // 1. HONEYPOT SPAM PROTECTION
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

    // 5. RATE LIMITING (5-min window)
    const rateLimitMinutes = parseInt(settings['Rate Limit Minutes'], 10) || 5;
    if (isRateLimited(leadsSheet, mobile, email, rateLimitMinutes)) {
      logSecurityError(ss, 'Rate limit exceeded.', publicIP, origin, userAgent, 'Submission within ' + rateLimitMinutes + ' min window');
      return createJsonResponse(false, null, 'RateLimited', 'Please wait before submitting again.');
    }

    // 6. DUPLICATE DETECTION & LEAD CREATION
    const isDuplicate = checkDuplicate(leadsSheet, mobile, email);
    const leadStatus = isDuplicate ? 'Duplicate' : 'New';
    const leadPriority = payload.priority || 'Medium';

    const leadId = generateLeadId(ss);
    const defaultCounsellor = settings['Default Counsellor'] && settings['Default Counsellor'] !== 'Unassigned' 
      ? settings['Default Counsellor'] 
      : '';

    const timestamp = new Date();
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
      defaultCounsellor,
      '', // Last Contact Date
      '', // Next Follow-up Date
      0,  // Number of Follow-ups
      initialRemark
    ];

    leadsSheet.appendRow(rowData);

    // 7. GENERATE WHATSAPP CLICK TO CHAT LINK
    const instituteWhatsAppNumber = settings['WhatsApp Number'] || '9695904440';
    const whatsappUrl = generateWhatsAppClickToChatUrl(instituteWhatsAppNumber, name, course);

    // 8. TRIGGER AUTOMATION EVENT (NEW_LEAD)
    try {
      dispatchEvent(AUTOMATION_EVENTS.NEW_LEAD, {
        leadId: leadId,
        name: name,
        mobile: mobile,
        email: email,
        course: course,
        city: city,
        message: message,
        status: leadStatus,
        whatsappUrl: whatsappUrl
      }, ss);
    } catch (autoErr) {
      logSecurityError(ss, 'Automation Engine Error (NEW_LEAD)', publicIP, origin, userAgent, autoErr.message || String(autoErr));
    }

    const endTime = new Date().getTime();
    const executionTimeMs = endTime - startTime;

    logSubmission(ss, leadId, leadStatus, executionTimeMs);

    return createJsonResponse(true, leadId, leadStatus, 'Enquiry submitted successfully.', whatsappUrl);

  } catch (err) {
    logSecurityError(getSpreadsheet(), 'Unhandled Exception', '', '', '', (err.message || String(err)) + '\n' + (err.stack || ''));
    return createJsonResponse(false, null, 'Error', 'An error occurred while saving enquiry.');
  } finally {
    lock.releaseLock();
  }
}

/**
 * Web App GET Handler
 */
function doGet(e) {
  return createJsonResponse(true, null, 'Active', 'Nova Skills Event-Driven CRM & Automation Engine v4.0 is running.');
}

/* ============================================================
   EVENT-DRIVEN AUTOMATION ENGINE & HANDLERS
   ============================================================ */

/**
 * Central Event Dispatcher
 */
function dispatchEvent(eventName, payload, ssInstance) {
  const ss = ssInstance || getSpreadsheet();
  const startTime = new Date().getTime();

  try {
    switch (eventName) {
      case AUTOMATION_EVENTS.NEW_LEAD:
        handleNewLeadEvent(payload, ss);
        break;
      case AUTOMATION_EVENTS.LEAD_UPDATED:
        handleLeadUpdatedEvent(payload, ss);
        break;
      case AUTOMATION_EVENTS.STATUS_CHANGED:
        handleStatusChangedEvent(payload, ss);
        break;
      case AUTOMATION_EVENTS.FOLLOWUP_DUE:
        handleFollowupDueEvent(payload, ss);
        break;
      case AUTOMATION_EVENTS.ADMISSION_CONFIRMED:
        handleAdmissionConfirmedEvent(payload, ss);
        break;
      case AUTOMATION_EVENTS.ENROLLED:
        handleEnrolledEvent(payload, ss);
        break;
      default:
        console.warn('Unknown event dispatched:', eventName);
        return;
    }

    const execTime = new Date().getTime() - startTime;
    logAutomationEvent(ss, eventName, payload.leadId || '', 'Handled event successfully', 'Success', execTime);
  } catch (err) {
    const execTime = new Date().getTime() - startTime;
    logAutomationEvent(ss, eventName, payload.leadId || '', 'Failed handling event: ' + err.message, 'Failure', execTime);
    logSecurityError(ss, 'Event Execution Failed: ' + eventName, '', '', '', err.stack || String(err));
  }
}

function handleNewLeadEvent(payload, ss) {
  const settings = getSettingsMap(ss.getSheetByName(SHEETS.SETTINGS));
  const adminEmail = settings['Admin Email'] || 'novaskills.official@gmail.com';

  // 1. Admin Email Notification
  const adminSubject = `🆕 New Lead Received: ${payload.name} (${payload.course})`;
  const adminBody = `
    <h2>New Lead Registered on Nova Skills</h2>
    <p><strong>Lead ID:</strong> ${payload.leadId}</p>
    <p><strong>Name:</strong> ${payload.name}</p>
    <p><strong>Mobile:</strong> ${payload.mobile}</p>
    <p><strong>Email:</strong> ${payload.email}</p>
    <p><strong>Course:</strong> ${payload.course}</p>
    <p><strong>City:</strong> ${payload.city || 'N/A'}</p>
    <p><strong>Status:</strong> ${payload.status}</p>
    <p><strong>Message:</strong> ${payload.message || 'N/A'}</p>
  `;
  sendNotification('EMAIL', adminEmail, { subject: adminSubject, body: adminBody }, { leadId: payload.leadId, event: 'NEW_LEAD' }, ss);

  // 2. Student Auto-Reply Email (if email provided)
  if (payload.email) {
    const studentSubject = `Thank you for your enquiry, ${payload.name} — Nova Skills`;
    const studentBody = `
      <p>Dear ${payload.name},</p>
      <p>Thank you for contacting Nova Skills! We have received your enquiry for the <strong>${payload.course}</strong> course.</p>
      <p>Our senior career counsellor will call you within 2 hours to provide complete course details, fee structure, and syllabus.</p>
      <br/>
      <p>Warm regards,<br/><strong>Nova Skills Admissions Team</strong><br/>https://novaskills.in</p>
    `;
    sendNotification('EMAIL', payload.email, { subject: studentSubject, body: studentBody }, { leadId: payload.leadId, event: 'NEW_LEAD_STUDENT' }, ss);
  }

  // 3. WhatsApp Notification Log / Click-to-chat
  if (settings['WhatsApp Enabled'] !== 'false') {
    sendNotification('WHATSAPP', payload.mobile, { message: payload.whatsappUrl, name: payload.name, course: payload.course }, { leadId: payload.leadId, event: 'NEW_LEAD_WHATSAPP' }, ss);
  }
}

function handleLeadUpdatedEvent(payload, ss) {
  sendNotification('SYSTEM_LOG', '', { message: `Lead ${payload.leadId} updated.` }, { leadId: payload.leadId, event: 'LEAD_UPDATED' }, ss);
}

function handleStatusChangedEvent(payload, ss) {
  sendNotification('SYSTEM_LOG', '', { message: `Lead ${payload.leadId} status changed to ${payload.status}.` }, { leadId: payload.leadId, event: 'STATUS_CHANGED' }, ss);
  
  if (payload.status === 'Admission Confirmed') {
    dispatchEvent(AUTOMATION_EVENTS.ADMISSION_CONFIRMED, payload, ss);
  } else if (payload.status === 'Enrolled') {
    dispatchEvent(AUTOMATION_EVENTS.ENROLLED, payload, ss);
  }
}

function handleFollowupDueEvent(payload, ss) {
  const settings = getSettingsMap(ss.getSheetByName(SHEETS.SETTINGS));
  const adminEmail = settings['Admin Email'] || 'novaskills.official@gmail.com';
  sendNotification('EMAIL', adminEmail, { subject: `⏰ Follow-up Due for Lead ${payload.leadId}`, body: `<p>Follow-up scheduled for lead ${payload.name} (${payload.mobile}).</p>` }, { leadId: payload.leadId, event: 'FOLLOWUP_DUE' }, ss);
}

function handleAdmissionConfirmedEvent(payload, ss) {
  const settings = getSettingsMap(ss.getSheetByName(SHEETS.SETTINGS));
  const adminEmail = settings['Admin Email'] || 'novaskills.official@gmail.com';
  sendNotification('EMAIL', adminEmail, { subject: `🎉 Admission Confirmed: ${payload.name}`, body: `<h2>Admission Confirmed!</h2><p>Student ${payload.name} has confirmed admission for ${payload.course}.</p>` }, { leadId: payload.leadId, event: 'ADMISSION_CONFIRMED' }, ss);
}

function handleEnrolledEvent(payload, ss) {
  const settings = getSettingsMap(ss.getSheetByName(SHEETS.SETTINGS));
  const adminEmail = settings['Admin Email'] || 'novaskills.official@gmail.com';
  sendNotification('EMAIL', adminEmail, { subject: `🎓 Student Enrolled: ${payload.name}`, body: `<h2>New Student Enrolled!</h2><p>Student ${payload.name} is now officially enrolled in ${payload.course}.</p>` }, { leadId: payload.leadId, event: 'ENROLLED' }, ss);
}

/* ============================================================
   NOTIFICATION CENTER & MODULES
   ============================================================ */

/**
 * Centralized Notification Dispatcher
 * Supported Types: EMAIL, WHATSAPP, SYSTEM_LOG (Hooks: SMS, Telegram, Push)
 */
function sendNotification(type, recipient, payload, context, ssInstance) {
  const ss = ssInstance || getSpreadsheet();
  
  try {
    switch (type.toUpperCase()) {
      case 'EMAIL':
        if (recipient && payload.subject && payload.body) {
          MailApp.sendEmail({
            to: recipient,
            subject: payload.subject,
            htmlBody: payload.body
          });
        }
        break;

      case 'WHATSAPP':
        sendWhatsAppNotification(recipient, payload, context, ss);
        break;

      case 'SYSTEM_LOG':
        logAutomationEvent(ss, context.event || 'NOTIFICATION', context.leadId || '', payload.message || 'Notification dispatched', 'Success', 0);
        break;

      case 'SMS':
      case 'TELEGRAM':
      case 'PUSH':
        // Extensible hook for future integration providers
        logAutomationEvent(ss, type, context.leadId || '', 'Future notification channel placeholder triggered', 'Success', 0);
        break;

      default:
        console.warn('Unsupported notification type:', type);
    }
  } catch (err) {
    logSecurityError(ss, `Notification Error (${type})`, '', '', '', err.message || String(err));
  }
}

/**
 * WhatsApp Notification Handler (ClickToChat & Future Business API Hook)
 */
function sendWhatsAppNotification(recipient, payload, context, ss) {
  const settings = getSettingsMap(ss.getSheetByName(SHEETS.SETTINGS));
  const whatsappMode = settings['WhatsApp Mode'] || 'ClickToChat';
  const apiEnabled = String(settings['Business API Enabled']).toLowerCase() === 'true';

  if (apiEnabled && whatsappMode === 'BusinessAPI') {
    // Hook for Meta WhatsApp Business API Cloud Send
    sendWhatsAppMetaCloudAPI(recipient, payload, settings);
  } else {
    // ClickToChat Mode: URL is generated & stored in Logs
    logAutomationEvent(ss, 'WHATSAPP_CLICK_TO_CHAT', context.leadId || '', 'Generated ClickToChat URL: ' + (payload.message || ''), 'Success', 0);
  }
}

/**
 * WhatsApp Meta Cloud API Future Handler Hook
 */
function sendWhatsAppMetaCloudAPI(recipient, payload, settings) {
  const token = settings['Meta Access Token'];
  const phoneId = settings['Phone Number ID'];
  if (!token || !phoneId) {
    throw new Error('Meta Access Token or Phone Number ID missing in Settings');
  }
  // Meta Cloud API HTTP Fetch architecture prepared for zero-refactoring activation
}

/**
 * WhatsApp Click to Chat Link Generator
 * Format: https://wa.me/919695904440?text=<encoded_message>
 */
function generateWhatsAppClickToChatUrl(whatsAppNumber, name, course) {
  const cleanNumber = String(whatsAppNumber || '9695904440').replace(/\D/g, '');
  const phone = cleanNumber.length === 10 ? '91' + cleanNumber : cleanNumber;

  const rawMessage = `Hello Nova Skills,\n\nI have successfully submitted my enquiry on your website.\n\nMy Name:\n${name}\n\nCourse:\n${course}\n\nPlease contact me.\n\nThank you.`;

  const encodedMessage = encodeURIComponent(rawMessage);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}

/* ============================================================
   AUTOMATED REPORTING ENGINES
   ============================================================ */

function sendDailyReport() {
  const startTime = new Date().getTime();
  const ss = getSpreadsheet();
  if (!ss) return;

  const settings = getSettingsMap(ss.getSheetByName(SHEETS.SETTINGS));
  if (settings['Daily Report Enabled'] === 'false') return;

  try {
    const analytics = calculatePeriodAnalytics(ss, 'today');
    const htmlBody = buildHtmlReportEmail('Daily Performance & Leads Report', analytics, 'Today (' + formatDateFormatted(new Date()).split(' ')[0] + ')');
    const adminEmail = settings['Admin Email'] || 'novaskills.official@gmail.com';
    const subject = '📊 Nova Skills Daily CRM Report — ' + formatDateFormatted(new Date()).split(' ')[0];

    sendNotification('EMAIL', adminEmail, { subject: subject, body: htmlBody }, { event: 'DAILY_REPORT' }, ss);

    const executionTimeMs = new Date().getTime() - startTime;
    logAutomationEvent(ss, 'DAILY_REPORT', 'SYSTEM', 'Sent daily report email to ' + adminEmail, 'Success', executionTimeMs);
  } catch (err) {
    const executionTimeMs = new Date().getTime() - startTime;
    logAutomationEvent(ss, 'DAILY_REPORT', 'SYSTEM', 'Failed: ' + err.message, 'Failure', executionTimeMs);
  }
}

function sendWeeklyReport() {
  const startTime = new Date().getTime();
  const ss = getSpreadsheet();
  if (!ss) return;

  const settings = getSettingsMap(ss.getSheetByName(SHEETS.SETTINGS));
  if (settings['Weekly Report Enabled'] === 'false') return;

  try {
    const analytics = calculatePeriodAnalytics(ss, 'week');
    const htmlBody = buildHtmlReportEmail('Weekly Executive Summary', analytics, 'Past 7 Days');
    const adminEmail = settings['Admin Email'] || 'novaskills.official@gmail.com';
    const subject = '📈 Nova Skills Weekly CRM Performance Report';

    sendNotification('EMAIL', adminEmail, { subject: subject, body: htmlBody }, { event: 'WEEKLY_REPORT' }, ss);

    const executionTimeMs = new Date().getTime() - startTime;
    logAutomationEvent(ss, 'WEEKLY_REPORT', 'SYSTEM', 'Sent weekly report to ' + adminEmail, 'Success', executionTimeMs);
  } catch (err) {
    const executionTimeMs = new Date().getTime() - startTime;
    logAutomationEvent(ss, 'WEEKLY_REPORT', 'SYSTEM', 'Failed: ' + err.message, 'Failure', executionTimeMs);
  }
}

function sendMonthlyReport() {
  const startTime = new Date().getTime();
  const ss = getSpreadsheet();
  if (!ss) return;

  const settings = getSettingsMap(ss.getSheetByName(SHEETS.SETTINGS));
  if (settings['Monthly Report Enabled'] === 'false') return;

  try {
    const analytics = calculatePeriodAnalytics(ss, 'month');
    const htmlBody = buildHtmlReportEmail('Monthly Growth & Conversion Report', analytics, 'Current Month');
    const adminEmail = settings['Admin Email'] || 'novaskills.official@gmail.com';
    const subject = '🏆 Nova Skills Monthly CRM & Conversion Report';

    sendNotification('EMAIL', adminEmail, { subject: subject, body: htmlBody }, { event: 'MONTHLY_REPORT' }, ss);

    const executionTimeMs = new Date().getTime() - startTime;
    logAutomationEvent(ss, 'MONTHLY_REPORT', 'SYSTEM', 'Sent monthly report to ' + adminEmail, 'Success', executionTimeMs);
  } catch (err) {
    const executionTimeMs = new Date().getTime() - startTime;
    logAutomationEvent(ss, 'MONTHLY_REPORT', 'SYSTEM', 'Failed: ' + err.message, 'Failure', executionTimeMs);
  }
}

function checkAndSendMonthlyReport() {
  const today = new Date();
  if (today.getDate() === 1) {
    sendMonthlyReport();
  }
}

function sendFollowUpReminders() {
  const startTime = new Date().getTime();
  const ss = getSpreadsheet();
  if (!ss) return;

  const settings = getSettingsMap(ss.getSheetByName(SHEETS.SETTINGS));

  try {
    const pendingFollowUps = getPendingFollowUps(ss);
    if (pendingFollowUps.length === 0) return;

    const htmlBody = buildFollowUpReminderEmail(pendingFollowUps);
    const adminEmail = settings['Admin Email'] || 'novaskills.official@gmail.com';
    const subject = '⏰ Action Required: ' + pendingFollowUps.length + ' Pending / Overdue Follow-ups for Today';

    sendNotification('EMAIL', adminEmail, { subject: subject, body: htmlBody }, { event: 'FOLLOWUP_REMINDERS' }, ss);

    const executionTimeMs = new Date().getTime() - startTime;
    logAutomationEvent(ss, 'FOLLOWUP_REMINDERS', 'SYSTEM', 'Sent ' + pendingFollowUps.length + ' follow-up reminders', 'Success', executionTimeMs);
  } catch (err) {
    const executionTimeMs = new Date().getTime() - startTime;
    logAutomationEvent(ss, 'FOLLOWUP_REMINDERS', 'SYSTEM', 'Failed: ' + err.message, 'Failure', executionTimeMs);
  }
}

function setupAutomatedTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(t => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger('sendDailyReport')
    .timeBased()
    .everyDays(1)
    .atHour(20)
    .create();

  ScriptApp.newTrigger('sendFollowUpReminders')
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();

  ScriptApp.newTrigger('sendWeeklyReport')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(9)
    .create();

  ScriptApp.newTrigger('checkAndSendMonthlyReport')
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();
}

/* ============================================================
   LOGGING & ENVIRONMENT SETUP
   ============================================================ */

function logAutomationEvent(ssInstance, eventName, leadId, action, status, executionTimeMs) {
  try {
    const ss = ssInstance || getSpreadsheet();
    if (ss) {
      const logsSheet = ss.getSheetByName(SHEETS.LOGS);
      if (logsSheet) {
        logsSheet.appendRow([
          new Date(),
          eventName || 'EVENT',
          leadId || 'SYSTEM',
          action || '',
          status || 'Success',
          executionTimeMs + ' ms'
        ]);
      }
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
  } catch (e) {}
}

function setupEnvironment(ss) {
  let leadsSheet = ss.getSheetByName(SHEETS.LEADS);
  if (!leadsSheet) {
    leadsSheet = ss.insertSheet(SHEETS.LEADS);
    leadsSheet.appendRow(LEADS_COLUMNS);
    styleHeaderRow(leadsSheet);
  } else {
    ensureHeaders(leadsSheet, LEADS_COLUMNS);
  }

  addLeadDataValidations(leadsSheet);

  let logsSheet = ss.getSheetByName(SHEETS.LOGS);
  if (!logsSheet) {
    logsSheet = ss.insertSheet(SHEETS.LOGS);
    logsSheet.appendRow(['Timestamp', 'Event Name', 'Lead ID', 'Action', 'Status', 'Execution Time']);
    styleHeaderRow(logsSheet);
  }

  let errorsSheet = ss.getSheetByName(SHEETS.ERRORS);
  if (!errorsSheet) {
    errorsSheet = ss.insertSheet(SHEETS.ERRORS);
    errorsSheet.appendRow(['Timestamp', 'Reason', 'IP', 'Origin', 'User Agent', 'Details']);
    styleHeaderRow(errorsSheet);
  } else {
    ensureHeaders(errorsSheet, ['Timestamp', 'Reason', 'IP', 'Origin', 'User Agent', 'Details']);
  }

  setupDashboardSheet(ss);
  setupSettingsSheet(ss);
}

function setupDashboardSheet(ss) {
  let dashboardSheet = ss.getSheetByName(SHEETS.DASHBOARD);
  if (!dashboardSheet) {
    dashboardSheet = ss.insertSheet(SHEETS.DASHBOARD);
  }

  dashboardSheet.clear();

  dashboardSheet.getRange(1, 1, 1, 4).merge()
    .setValue('📊 NOVA SKILLS CRM — EXECUTIVE DASHBOARD')
    .setBackground('#011731')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

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
    ['Pending Follow-ups', '=COUNTIFS(Leads!AA2:AA, "<=" & TODAY(), Leads!AA2:AA, "<>", Leads!C2:C, "<>Lost", Leads!C2:C, "<>Enrolled")', '=NOW()'],
    ['Admissions / Enrolled', '=COUNTIF(Leads!C2:C, "Admission Confirmed") + COUNTIF(Leads!C2:C, "Enrolled")', '=NOW()'],
    ['Conversion Rate %', '=IF(B5>0, B14/B5, 0)', '=NOW()'],
    ['Lost Leads', '=COUNTIF(Leads!C2:C, "Lost")', '=NOW()']
  ];

  dashboardSheet.getRange(4, 1, pipelineRows.length, 3).setValues(pipelineRows);
  dashboardSheet.getRange(4, 1, 1, 3).setFontWeight('bold').setBackground('#F1F5F9');
  dashboardSheet.getRange(15, 2, 1, 1).setNumberFormat('0.0%');

  dashboardSheet.getRange(18, 1, 1, 3).merge()
    .setValue('🎓 COURSE ANALYTICS')
    .setBackground('#0599a8')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold');

  const courseRows = [
    ['Academy Niche', 'Total Enquiries', 'Share %'],
    ['Digital Marketing', '=COUNTIF(Leads!H2:H, "*Digital Marketing*")', '=IF(B20>0, B20/B5, 0)'],
    ['Graphic Design', '=COUNTIF(Leads!H2:H, "*Design*")', '=IF(B21>0, B21/B5, 0)'],
    ['Video Editing', '=COUNTIF(Leads!H2:H, "*Video*")', '=IF(B22>0, B22/B5, 0)'],
    ['Motion Graphics', '=COUNTIF(Leads!H2:H, "*Motion*")', '=IF(B23>0, B23/B5, 0)'],
    ['Python', '=COUNTIF(Leads!H2:H, "*Python*")', '=IF(B24>0, B24/B5, 0)'],
    ['Web Development', '=COUNTIF(Leads!H2:H, "*Web*") + COUNTIF(Leads!H2:H, "*Coding*")', '=IF(B25>0, B25/B5, 0)'],
    ['AI & Automation', '=COUNTIF(Leads!H2:H, "*AI*")', '=IF(B26>0, B26/B5, 0)']
  ];

  dashboardSheet.getRange(19, 1, courseRows.length, 3).setValues(courseRows);
  dashboardSheet.getRange(19, 1, 1, 3).setFontWeight('bold').setBackground('#F1F5F9');
  dashboardSheet.getRange(20, 3, 7, 1).setNumberFormat('0.0%');

  dashboardSheet.getRange(28, 1, 1, 3).merge()
    .setValue('🌐 TRAFFIC & SOURCE ANALYTICS')
    .setBackground('#0599a8')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold');

  const sourceRows = [
    ['Traffic Source', 'Lead Count', 'Conversion Share'],
    ['Organic Search', '=COUNTIFS(Leads!M2:M, "", Leads!L2:L, "*google*") + COUNTIFS(Leads!M2:M, "", Leads!L2:L, "*bing*")', '=IF(B30>0, B30/B5, 0)'],
    ['Google Ads', '=COUNTIF(Leads!M2:M, "*google*")', '=IF(B31>0, B31/B5, 0)'],
    ['Facebook Ads', '=COUNTIF(Leads!M2:M, "*facebook*") + COUNTIF(Leads!M2:M, "*fb*")', '=IF(B32>0, B32/B5, 0)'],
    ['Instagram Ads', '=COUNTIF(Leads!M2:M, "*instagram*") + COUNTIF(Leads!M2:M, "*ig*")', '=IF(B33>0, B33/B5, 0)'],
    ['WhatsApp', '=COUNTIF(Leads!M2:M, "*whatsapp*")', '=IF(B34>0, B34/B5, 0)'],
    ['Direct Traffic', '=COUNTIFS(Leads!M2:M, "", Leads!L2:L, "")', '=IF(B35>0, B35/B5, 0)'],
    ['Referral', '=COUNTIF(Leads!M2:M, "*referral*")', '=IF(B36>0, B36/B5, 0)']
  ];

  dashboardSheet.getRange(29, 1, sourceRows.length, 3).setValues(sourceRows);
  dashboardSheet.getRange(29, 1, 1, 3).setFontWeight('bold').setBackground('#F1F5F9');
  dashboardSheet.getRange(30, 3, 7, 1).setNumberFormat('0.0%');

  try {
    dashboardSheet.autoResizeColumns(1, 3);
  } catch (e) {}
}

function setupSettingsSheet(ss) {
  let settingsSheet = ss.getSheetByName(SHEETS.SETTINGS);
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet(SHEETS.SETTINGS);
    settingsSheet.appendRow(['Key', 'Value', 'Description']);
    styleHeaderRow(settingsSheet);
  }

  const defaultSettings = [
    { key: 'Institute Name', value: 'Nova Skills', desc: 'Official Institute Name for communications' },
    { key: 'Website', value: 'https://novaskills.in', desc: 'Official Website Domain' },
    { key: 'Support Email', value: 'novaskills.official@gmail.com', desc: 'Student support email' },
    { key: 'Admin Email', value: 'novaskills.official@gmail.com', desc: 'Primary administrator notification email' },
    { key: 'WhatsApp Number', value: '9695904440', desc: 'Institute WhatsApp business number' },
    { key: 'WhatsApp Enabled', value: 'TRUE', desc: 'Enable/Disable WhatsApp communications' },
    { key: 'WhatsApp Mode', value: 'ClickToChat', desc: 'WhatsApp mode (ClickToChat / BusinessAPI)' },
    { key: 'Business API Enabled', value: 'FALSE', desc: 'Enable/Disable Meta WhatsApp Business API' },
    { key: 'Meta Access Token', value: '', desc: 'Meta Business API Permanent Access Token' },
    { key: 'Phone Number ID', value: '', desc: 'Meta Business Phone Number ID' },
    { key: 'Business Account ID', value: '', desc: 'Meta Business Account ID' },
    { key: 'Template Name', value: '', desc: 'Approved Meta WhatsApp Template Name' },

    { key: 'Default Counsellor', value: 'Unassigned', desc: 'Default assigned counsellor for incoming leads' },
    { key: 'Working Hours', value: 'Mon–Sat: 9:00 AM – 7:00 PM', desc: 'Institute operational hours' },
    { key: 'Business Days', value: 'Mon,Tue,Wed,Thu,Fri,Sat', desc: 'Active business days' },

    { key: 'Daily Report Enabled', value: 'true', desc: 'Send daily HTML report email at 8:00 PM IST' },
    { key: 'Weekly Report Enabled', value: 'true', desc: 'Send weekly report email on Mondays' },
    { key: 'Monthly Report Enabled', value: 'true', desc: 'Send monthly report email on 1st of month' },
    { key: 'Report Time', value: '20:00', desc: 'Daily report execution time (24h format)' },
    { key: 'Timezone', value: 'Asia/Kolkata', desc: 'Default timezone for reports and triggers' },

    { key: 'Last Lead ID Number', value: 0, desc: 'Last numeric ID counter for Lead ID generation' },
    { key: 'Rate Limit Minutes', value: 5, desc: 'Minutes window to block repeated submissions by same Mobile/Email' },
    { key: 'Spam Protection Enabled', value: 'true', desc: 'Enable/Disable Honeypot spam rejection' },
    { key: 'Origin Validation Enabled', value: 'false', desc: 'Enable/Disable strict domain origin checking' },
    { key: 'Allowed Domains', value: 'https://novaskills.in,https://www.novaskills.in', desc: 'Comma separated list of allowed domain origins' },
    { key: 'Bot Detection Enabled', value: 'true', desc: 'Enable/Disable bot User-Agent blocking' }
  ];

  const existingSettings = getSettingsMap(settingsSheet);
  defaultSettings.forEach(setting => {
    if (!(setting.key in existingSettings)) {
      settingsSheet.appendRow([setting.key, setting.value, setting.desc]);
    }
  });
}

function calculatePeriodAnalytics(ss, period) {
  const leadsSheet = ss.getSheetByName(SHEETS.LEADS);
  const data = leadsSheet.getLastRow() > 1 ? leadsSheet.getRange(2, 1, leadsSheet.getLastRow() - 1, LEADS_COLUMNS.length).getValues() : [];

  const now = new Date();
  const todayStr = formatDateFormatted(now).split(' ')[0];

  let total = 0;
  let newLeads = 0;
  let duplicates = 0;
  let interested = 0;
  let admissions = 0;
  let lost = 0;

  const courseCounts = {};
  const sourceCounts = {};
  const counsellorCounts = {};

  data.forEach(row => {
    const dateObj = new Date(row[1]);
    if (isNaN(dateObj.getTime())) return;

    const rowDateStr = formatDateFormatted(dateObj).split(' ')[0];
    let inPeriod = false;

    if (period === 'today') {
      inPeriod = (rowDateStr === todayStr);
    } else if (period === 'week') {
      const diffDays = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
      inPeriod = (diffDays <= 7);
    } else if (period === 'month') {
      inPeriod = (dateObj.getMonth() === now.getMonth() && dateObj.getFullYear() === now.getFullYear());
    } else {
      inPeriod = true;
    }

    if (!inPeriod) return;

    total++;
    const status = String(row[2] || 'New').trim();
    const course = String(row[7] || 'Unspecified').trim();
    const source = String(row[11] || row[10] || 'Direct / Organic').trim();
    const counsellor = String(row[24] || 'Unassigned').trim();

    if (status === 'New') newLeads++;
    else if (status === 'Duplicate') duplicates++;
    else if (status === 'Interested' || status === 'Demo Scheduled') interested++;
    else if (status === 'Admission Confirmed' || status === 'Enrolled') admissions++;
    else if (status === 'Lost') lost++;

    courseCounts[course] = (courseCounts[course] || 0) + 1;
    sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    counsellorCounts[counsellor] = (counsellorCounts[counsellor] || 0) + 1;
  });

  const conversionRate = total > 0 ? ((admissions / total) * 100).toFixed(1) + '%' : '0.0%';

  return {
    total,
    newLeads,
    duplicates,
    interested,
    admissions,
    lost,
    conversionRate,
    topCourse: getTopKey(courseCounts),
    topSource: getTopKey(sourceCounts),
    topCounsellor: getTopKey(counsellorCounts)
  };
}

function getTopKey(obj) {
  let topKey = 'N/A';
  let max = -1;
  for (const k in obj) {
    if (obj[k] > max) {
      max = obj[k];
      topKey = k;
    }
  }
  return topKey !== 'N/A' ? `${topKey} (${max})` : 'N/A';
}

function getPendingFollowUps(ss) {
  const leadsSheet = ss.getSheetByName(SHEETS.LEADS);
  if (leadsSheet.getLastRow() <= 1) return [];

  const headers = leadsSheet.getRange(1, 1, 1, leadsSheet.getLastColumn()).getValues()[0];
  const nextFollowUpIdx = headers.indexOf('Next Follow-up Date');
  const statusIdx = headers.indexOf('Status');

  if (nextFollowUpIdx === -1) return [];

  const data = leadsSheet.getRange(2, 1, leadsSheet.getLastRow() - 1, headers.length).getValues();
  const todayStr = formatDateFormatted(new Date()).split(' ')[0];
  const pendingList = [];

  data.forEach(row => {
    const status = String(row[statusIdx] || '').trim();
    if (status === 'Lost' || status === 'Enrolled' || status === 'Admission Confirmed') return;

    const followUpVal = row[nextFollowUpIdx];
    if (!followUpVal) return;

    let followUpStr = '';
    if (followUpVal instanceof Date) {
      followUpStr = formatDateFormatted(followUpVal).split(' ')[0];
    } else {
      followUpStr = String(followUpVal).trim().split(' ')[0];
    }

    if (followUpStr && followUpStr <= todayStr) {
      pendingList.push({
        leadId: row[0],
        name: row[4],
        mobile: row[5],
        course: row[7],
        status: status,
        followUpDate: followUpStr,
        counsellor: row[24] || 'Unassigned',
        isOverdue: followUpStr < todayStr
      });
    }
  });

  return pendingList;
}

function buildHtmlReportEmail(reportTitle, analytics, timePeriodText) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <style>
      body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
      .container { max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(1,23,49,0.1); border: 1px solid #e2e8f0; }
      .header { background: linear-gradient(135deg, #011731 0%, #0a2040 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
      .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; }
      .header p { margin: 6px 0 0 0; color: #07b8cc; font-size: 13px; font-weight: 600; text-transform: uppercase; }
      .body-content { padding: 24px; }
      .grid { display: table; width: 100%; margin-bottom: 24px; }
      .col-2 { display: table-cell; width: 50%; padding: 6px; box-sizing: border-box; }
      .card { background: #f1f5f9; border-radius: 12px; padding: 16px; text-align: center; border: 1px solid #cbd5e1; }
      .card-num { font-size: 26px; font-weight: 800; color: #011731; margin-top: 4px; }
      .card-label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; }
      .section-title { font-size: 15px; font-weight: 700; color: #011731; margin: 24px 0 12px 0; border-bottom: 2px solid #0599a8; padding-bottom: 6px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 13px; }
      th { background: #011731; color: #ffffff; text-align: left; padding: 10px 12px; font-weight: 600; }
      td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #334155; }
      tr:nth-child(even) { background: #f8fafc; }
      .footer { background: #011731; color: rgba(255,255,255,0.7); text-align: center; padding: 16px; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🎓 NOVA SKILLS CRM</h1>
        <p>${reportTitle} • ${timePeriodText}</p>
      </div>
      <div class="body-content">
        <div class="grid">
          <div class="col-2">
            <div class="card">
              <div class="card-label">Total Leads</div>
              <div class="card-num">${analytics.total}</div>
            </div>
          </div>
          <div class="col-2">
            <div class="card">
              <div class="card-label">Admissions</div>
              <div class="card-num" style="color:#0599a8;">${analytics.admissions}</div>
            </div>
          </div>
        </div>
        <div class="section-title">📌 Pipeline Summary</div>
        <table>
          <thead>
            <tr><th>Metric</th><th>Count</th></tr>
          </thead>
          <tbody>
            <tr><td>New Enquiries</td><td>${analytics.newLeads}</td></tr>
            <tr><td>Interested & Demo</td><td>${analytics.interested}</td></tr>
            <tr><td>Admissions</td><td>${analytics.admissions}</td></tr>
            <tr><td>Duplicates</td><td>${analytics.duplicates}</td></tr>
            <tr><td>Lost Leads</td><td>${analytics.lost}</td></tr>
          </tbody>
        </table>
      </div>
      <div class="footer">
        Automated by Nova Skills Automation Engine v4.0
      </div>
    </div>
  </body>
  </html>
  `;
}

function buildFollowUpReminderEmail(pendingList) {
  const rowsHtml = pendingList.map(item => `
    <tr style="${item.isOverdue ? 'background:#fef2f2;' : ''}">
      <td><strong>${item.leadId}</strong></td>
      <td>${item.name}<br/><span style="font-size:11px; color:#64748b;">${item.mobile}</span></td>
      <td>${item.course}</td>
      <td><span style="padding:2px 8px; border-radius:12px; font-size:11px; background:${item.isOverdue ? '#ef4444' : '#0599a8'}; color:white;">${item.isOverdue ? 'OVERDUE' : 'TODAY'} (${item.followUpDate})</span></td>
      <td>${item.counsellor}</td>
    </tr>
  `).join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <style>
      body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; }
      .container { max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(1,23,49,0.1); }
      .header { background: #011731; padding: 24px; text-align: center; color: #ffffff; }
      .body-content { padding: 24px; }
      table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
      th { background: #0599a8; color: #ffffff; text-align: left; padding: 10px; }
      td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin:0;">⏰ NOVA SKILLS FOLLOW-UP REMINDER</h1>
      </div>
      <div class="body-content">
        <table>
          <thead>
            <tr><th>Lead ID</th><th>Student</th><th>Course</th><th>Follow-up Date</th><th>Counsellor</th></tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </div>
  </body>
  </html>
  `;
}

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
        'LEAD_SUBMISSION',
        leadId,
        'Form Submitted',
        status,
        executionTimeMs + ' ms'
      ]);
    }
  } catch (e) {}
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

function createJsonResponse(success, leadId, status, message, whatsappUrl) {
  const response = {
    success: success,
    leadId: leadId || '',
    status: status || '',
    message: message || '',
    whatsappUrl: whatsappUrl || ''
  };

  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}
