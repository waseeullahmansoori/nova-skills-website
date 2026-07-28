/**
 * Communication Template Manager & Placeholder Engine
 */

export const TEMPLATES = {
  WELCOME: `Hello {{StudentName}},\n\nThank you for contacting Nova Skills! We have received your enquiry for {{Course}}.\n\nLead ID: {{LeadID}}\nAssigned Counsellor: {{Counsellor}}\n\nOur counsellor will call you shortly.\n\nWebsite: {{Website}}\nNova Skills Admissions`,

  ADMISSION: `🎉 Congratulations {{StudentName}}!\n\nYour admission for {{Course}} is confirmed at Nova Skills.\n\nBatch: {{Batch}}\nLead ID: {{LeadID}}\n\nWelcome to Nova Skills!`,

  DEMO_REMINDER: `⏰ Reminder {{StudentName}}:\n\nYour free 1-on-1 demo session for {{Course}} is scheduled for today.\n\nCounsellor: {{Counsellor}}\nWebsite: {{Website}}`,

  FEE_REMINDER: `Notice: Dear {{StudentName}}, your installment fee payment of {{Fee}} for {{Course}} is due on {{DueDate}}.\n\nPlease contact {{Counsellor}} or visit Nova Skills campus.`,

  PAYMENT_RECEIVED: `✅ Payment Confirmation:\n\nThank you {{StudentName}}! We received your payment of {{Fee}} for {{Course}}.\n\nReceipt Lead ID: {{LeadID}}`,

  BATCH_CONFIRMATION: `📚 Batch Update:\n\nHello {{StudentName}}, your {{Course}} batch ({{Batch}}) starts on schedule.\n\nNova Skills Team`,

  CERTIFICATE: `🎓 Certificate Ready!\n\nCongratulations {{StudentName}}! Your official Nova Skills Course Completion Certificate for {{Course}} is ready.`,

  PLACEMENT_UPDATE: `💼 Placement Update:\n\nHello {{StudentName}}, new hiring opportunities for {{Course}} are available. Please connect with placement cell.`
};

export function compileCommunicationTemplate(templateKey, dataMap = {}) {
  const templateStr = TEMPLATES[templateKey.toUpperCase()] || TEMPLATES.WELCOME;
  let compiled = templateStr;

  const defaults = {
    StudentName: 'Student',
    LeadID: 'NS000000',
    Course: 'Skill Course',
    Counsellor: 'Admissions Counsellor',
    Batch: 'Upcoming Batch',
    Fee: '₹0',
    DueDate: 'Today',
    Website: 'https://novaskills.in'
  };

  const finalMap = { ...defaults, ...dataMap };

  for (const key in finalMap) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    compiled = compiled.replace(regex, String(finalMap[key]));
  }

  return compiled;
}
