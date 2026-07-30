/**
 * Nova Skills AI Career Advisor Worker — Validation Utilities
 */

import { CONFIG_DEFAULTS } from '../config/constants.js';

export function validateChatPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return { isValid: false, error: 'Invalid JSON payload body' };
  }

  const message = payload.message || payload.query || payload.prompt;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return { isValid: false, error: 'Message payload is required and cannot be empty' };
  }

  if (message.length > CONFIG_DEFAULTS.MAX_MESSAGE_LENGTH) {
    return { 
      isValid: false, 
      error: `Message exceeds maximum allowed length of ${CONFIG_DEFAULTS.MAX_MESSAGE_LENGTH} characters` 
    };
  }

  return { isValid: true, message: message.trim() };
}
