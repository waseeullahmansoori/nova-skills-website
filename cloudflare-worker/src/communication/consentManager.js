/**
 * Consent & Opt-In/Opt-Out Management Module
 */

const userConsents = new Map();

export function getUserConsentStatus(mobile) {
  const cleanMobile = String(mobile || '').replace(/\D/g, '');
  if (!userConsents.has(cleanMobile)) {
    // Default consent: Transactional enabled, Marketing enabled until opt-out
    return {
      transactional: true,
      marketing: true,
      optedOut: false
    };
  }
  return userConsents.get(cleanMobile);
}

export function setUserConsentStatus(mobile, consentType = 'marketing', granted = true) {
  const cleanMobile = String(mobile || '').replace(/\D/g, '');
  const current = getUserConsentStatus(cleanMobile);

  if (consentType === 'opt-out' || !granted) {
    current.marketing = false;
    current.optedOut = true;
  } else if (consentType === 'marketing') {
    current.marketing = granted;
    current.optedOut = !granted;
  } else if (consentType === 'transactional') {
    current.transactional = granted;
  }

  userConsents.set(cleanMobile, current);
  return current;
}
