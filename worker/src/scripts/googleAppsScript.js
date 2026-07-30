/**
 * Nova Skills AI Career Advisor — Google Apps Script CRM Web App Template
 * 
 * Paste this code into Google Sheets (Extensions > Apps Script)
 * Sheet Name: "Leads"
 */

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
    var leadId = payload.leadId || "";
    var sessionId = payload.sessionId || "";
    var phone = payload.phone || "";
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

    var rowValues = [
      payload.leadId || "",
      payload.createdAt || new Date().toISOString(),
      new Date().toISOString(),
      payload.sessionId || "",
      payload.name || "",
      payload.phone || "",
      payload.email || "",
      payload.city || "",
      payload.state || "",
      payload.qualification || "",
      payload.currentStatus || "",
      payload.careerGoal || "",
      payload.interest || "",
      payload.budget || "",
      payload.preferredLearningMode || payload.preferredMode || "",
      payload.recommendedCourse || "",
      payload.leadScore || 0,
      payload.qualificationStatus || payload.status || "NEW",
      payload.conversationSummary || "",
      payload.leadSource || "Nova AI Widget",
      payload.notes || ""
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
