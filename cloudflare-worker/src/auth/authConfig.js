/**
 * Supabase Auth MVP Configuration
 * Restricts auth methods strictly to Email/Password login for Admin and Student roles.
 */

export const AUTH_CONFIG = {
  allowedAuthMethods: ['email_password'],
  disabledAuthMethods: ['public_registration', 'social_oauth', 'anonymous', 'phone_otp'],
  supportedRoles: ['Admin', 'Student'],
  sessionDurationSeconds: 86400, // 24 hours
  passwordPolicy: {
    minLength: 8,
    requireNumbers: true
  }
};
