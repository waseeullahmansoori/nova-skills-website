/**
 * Nova Skills AI Career Advisor — Google Apps Script CRM Web App Template
 *
 * Paste this code into Google Sheets (Extensions > Apps Script)
 * Sheet Name: "Leads"
 *
 * Version: 2.1.0 (P1-3 Admissions CRM Integration)
 * - 21-column schema alignment
 * - Formula injection sanitization (=, +, -, @)
 * - Deduplication via Lead ID, Session ID, Phone, or Email
 * - Minor Safeguard guardian consent tagging
 */

function sanitizeFormula(val) {
  if (typeof val === 'string' && /^[=+\-@\t\r]/.test(val)) {
    return "'" + val;
  }
  return val;
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads");
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Leads");
      // Create Header Row if sheet is empty
      sheet.appendRow([
        "Lead ID", "Created At", "Updated At", "Session ID", "Name",
        "Phone", "Email", "City", "State", "Qualification",
        "Current Status", "Career Goal", "Interest", "Budget", "Preferred Mode",
        "Recommended Course", "Lead Score", "Lead Status", "Conversation Summary", "Source", "Notes"
      ]);
      sheet.getRange(1, 1, 1, 21).setFontWeight("bold").setBackground("#0599a8").setFontColor("#ffffff");
    }

    var payload = JSON.parse(e.postData.contents);
    var leadId = payload.leadId || payload.lead_id || "";
    var sessionId = payload.sessionId || payload.session_id || "";
    var phone = payload.phone || payload.mobile || "";
    var email = payload.email || "";

    var data = sheet.getDataRange().getValues();
    var rowIndexToUpdate = -1;

    // Duplicate Check & Update: Match Lead ID, Session ID, Phone, or Email
    if (data.length > 1) {
      for (var i = 1; i < data.length; i++) {
        var rLeadId = String(data[i][0]);
        var rSessionId = String(data[i][3]);
        var rPhone = String(data[i][5]);
        var rEmail = String(data[i][6]);

        if (
          (leadId && rLeadId === leadId) ||
          (sessionId && rSessionId === sessionId) ||
          (phone && rPhone === phone) ||
          (email && rEmail.toLowerCase() === email.toLowerCase())
        ) {
          rowIndexToUpdate = i + 1; // 1-indexed row number
          break;
        }
      }
    }

    var rawNotes = payload.notes || payload.message || "";
    if (payload.guardianConsentRequired && rawNotes.indexOf("Minor Safeguard") === -1) {
      rawNotes = (rawNotes ? rawNotes + " | " : "") + "[Minor Safeguard: Guardian/Parental Consent Required]";
    }

    var rowValues = [
      sanitizeFormula(leadId),
      sanitizeFormula(payload.createdAt || new Date().toISOString()),
      new Date().toISOString(),
      sanitizeFormula(sessionId),
      sanitizeFormula(payload.name || payload.fullName || ""),
      sanitizeFormula(phone),
      sanitizeFormula(email),
      sanitizeFormula(payload.city || ""),
      sanitizeFormula(payload.state || ""),
      sanitizeFormula(payload.qualification || ""),
      sanitizeFormula(payload.currentStatus || ""),
      sanitizeFormula(payload.careerGoal || ""),
      sanitizeFormula(payload.interest || payload.academy || payload.academy_id || ""),
      sanitizeFormula(payload.budget || ""),
      sanitizeFormula(payload.preferredLearningMode || payload.preferredMode || payload.learning_mode || ""),
      sanitizeFormula(payload.recommendedCourse || payload.course || payload.courseTitle || ""),
      payload.leadScore || 0,
      sanitizeFormula(payload.qualificationStatus || payload.status || "NEW"),
      sanitizeFormula(payload.conversationSummary || ""),
      sanitizeFormula(payload.leadSource || payload.sourceComponent || payload.formType || payload.source || "Website Form"),
      sanitizeFormula(rawNotes)
    ];

    var actionTaken = "";
    if (rowIndexToUpdate > 0) {
      // Update existing row
      sheet.getRange(rowIndexToUpdate, 1, 1, rowValues.length).setValues([rowValues]);
      actionTaken = "updated";
    } else {
      // Append new row
      sheet.appendRow(rowValues);
      actionTaken = "created";
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      action: actionTaken,
      leadId: leadId,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    service: "Nova Skills Lead CRM Google Apps Script",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}
