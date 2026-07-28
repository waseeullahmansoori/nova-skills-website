/**
 * Automated Lead Capture & CRM Forwarder Service
 * Integrates directly with Nova Skills Google Apps Script CRM Web App
 */

const APPS_SCRIPT_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbzRHK2n1D0WjWw4NxcwtH7FQb7eRsZxVagFnYtiz5quAFec2BLfwgJ26C0OG6FTKcPB/exec';

export function extractLeadDetailsFromChat(userText, messages = []) {
  const fullConversationText = [...messages.map(m => m.content), userText].join(' ');

  // Mobile extraction (10-digit Indian phone number)
  const mobileMatch = fullConversationText.match(/\b[6-9]\d{9}\b/);
  const mobile = mobileMatch ? mobileMatch[0] : null;

  // Email extraction
  const emailMatch = fullConversationText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
  const email = emailMatch ? emailMatch[0] : null;

  // If no mobile or email found, lead capture is incomplete
  if (!mobile && !email) {
    return null;
  }

  // Extract name if provided
  let name = 'Website Chat Visitor';
  const nameMatch = userText.match(/(?:my name is|i am|this is)\s+([A-Za-z\s]{2,30})/i);
  if (nameMatch && nameMatch[1]) {
    name = nameMatch[1].trim();
  }

  // Extract course interest
  let course = 'General Inquiry';
  const lowerText = fullConversationText.toLowerCase();
  if (lowerText.includes('digital marketing')) course = 'Digital Marketing';
  else if (lowerText.includes('graphic') || lowerText.includes('ui/ux')) course = 'Graphic & UI/UX Design';
  else if (lowerText.includes('video') || lowerText.includes('motion')) course = 'Video Editing & Motion Graphics';
  else if (lowerText.includes('web') || lowerText.includes('full stack')) course = 'Full Stack Web Development';
  else if (lowerText.includes('python') || lowerText.includes('ai')) course = 'Python & AI Fundamentals';

  return {
    name: name,
    mobile: mobile || '9000000000',
    email: email || '',
    course: course,
    city: 'Website Chat',
    message: `Captured via AI Student Assistant Chat: "${userText.slice(0, 200)}"`
  };
}

export async function sendLeadToCRM(leadPayload) {
  try {
    const response = await fetch(APPS_SCRIPT_WEBAPP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(leadPayload)
    });

    if (!response.ok) {
      return { success: false, message: 'CRM endpoint returned non-200 status' };
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Failed to forward lead to Apps Script CRM:', err);
    return { success: false, error: err.message };
  }
}
