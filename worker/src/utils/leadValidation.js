/**
 * Nova Skills AI Career Advisor — Lead Validation Utilities
 */

export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') return { isValid: false, phone: null };
  const digits = phone.replace(/\D/g, '');

  // 10-digit Indian mobile number format (starts with 6, 7, 8, 9)
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) {
    return { isValid: true, phone: digits };
  }

  // 12-digit format with +91 or 91 country code
  if (digits.length === 12 && digits.startsWith('91') && /^[6-9]\d{9}$/.test(digits.slice(2))) {
    return { isValid: true, phone: digits.slice(2) };
  }

  return { isValid: false, phone: null };
}

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return { isValid: false, email: null };
  const cleaned = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (emailRegex.test(cleaned)) {
    return { isValid: true, email: cleaned };
  }

  return { isValid: false, email: null };
}

export function normalizeLeadData(rawLead = {}) {
  const phoneRes = validatePhone(rawLead.phone);
  const emailRes = validateEmail(rawLead.email);

  return {
    ...rawLead,
    name: rawLead.name ? rawLead.name.trim() : null,
    phone: phoneRes.isValid ? phoneRes.phone : (rawLead.phone || null),
    email: emailRes.isValid ? emailRes.email : (rawLead.email || null),
    city: rawLead.city ? rawLead.city.trim() : null,
    isPhoneVerified: phoneRes.isValid,
    isEmailVerified: emailRes.isValid
  };
}
