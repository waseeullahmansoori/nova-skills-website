/**
 * Lead Context Preparation & PII Anonymizer Module
 */

export function prepareLeadContext(rawLeadData) {
  const lead = rawLeadData || {};

  // Redact full mobile number for privacy (keep last 4 digits)
  const mobile = String(lead.mobile || lead.phone || '');
  const maskedMobile = mobile.length >= 10 
    ? 'XXXXXX' + mobile.slice(-4) 
    : 'N/A';

  // Sanitize message & notes (limit to 500 chars)
  const message = String(lead.message || lead.comment || '').slice(0, 500);
  const remarks = String(lead.remarks || '').slice(0, 500);

  return {
    leadId: lead.leadId || lead.id || 'NS-UNKNOWN',
    status: lead.status || 'New',
    priority: lead.priority || 'Medium',
    courseInterest: lead.course || lead.interest || 'Unspecified',
    maskedMobile: maskedMobile,
    city: lead.city || 'N/A',
    message: message,
    utmSource: lead.utmSource || lead.utm_source || lead.referrer || 'Direct',
    device: lead.device || 'N/A',
    stage: lead.stage || lead.status || 'New',
    lastContactDate: lead.lastContactDate || 'N/A',
    numberOfFollowUps: lead.numberOfFollowUps || 0,
    remarks: remarks
  };
}
