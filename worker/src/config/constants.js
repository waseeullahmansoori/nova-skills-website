/**
 * Nova Skills AI Career Advisor Worker — System Constants
 */

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
};

export const DEFAULT_CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400'
};

export const USER_ROLES = {
  STUDENT: 'Student',
  COUNSELLOR: 'Counsellor',
  ADMIN: 'Admin',
  SUPER_ADMIN: 'SuperAdmin'
};

export const XP_RULES = {
  LESSON_COMPLETE: 50,
  MODULE_COMPLETE: 200,
  ASSIGNMENT_SUBMITTED: 150,
  COURSE_COMPLETE: 1000
};

export const CONFIG_DEFAULTS = {
  VERSION: '1.0.0',
  MAX_MESSAGE_LENGTH: 500,
  DEFAULT_MODEL: 'gpt-4o-mini',
  OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
  TEMPERATURE: 0.7,
  MAX_TOKENS: 500,
  TIMEOUT_MS: 15000,
  MAX_CRM_RETRIES: 3,
  INITIAL_RETRY_DELAY_MS: 500,
  CRM_TIMEOUT_MS: 10000,
  MIN_PASSWORD_LENGTH: 8,
  SESSION_TTL_HOURS: 24,
  REMEMBER_ME_TTL_DAYS: 30,
  PBKDF2_ITERATIONS: 100000
};
