/**
 * Nova Skills AI Gateway & Enterprise Platform Configuration Module
 */

export function getConfig(env) {
  return {
    environment: env.ENVIRONMENT || 'production',
    openaiApiKey: env.OPENAI_API_KEY || '',
    openaiModel: env.OPENAI_MODEL || env.DEFAULT_MODEL || 'gpt-5.5',
    allowedOrigins: (env.ALLOWED_ORIGINS || 'https://novaskills.in,https://www.novaskills.in')
      .split(',')
      .map(o => o.trim().toLowerCase()),
    rateLimitPerMinute: parseInt(env.RATE_LIMIT_PER_MINUTE, 10) || 30,
    maxTokens: parseInt(env.MAX_TOKENS, 10) || 1500,
    temperature: parseFloat(env.TEMPERATURE || 0.7),

    // Meta WhatsApp Business Cloud API Settings
    metaBusinessAccountId: env.META_BUSINESS_ACCOUNT_ID || '',
    metaPhoneNumberId: env.META_PHONE_NUMBER_ID || '',
    metaAccessToken: env.META_ACCESS_TOKEN || '',
    metaWebhookVerifyToken: env.META_WEBHOOK_VERIFY_TOKEN || 'novaskills_webhook_secret',

    // Supabase Enterprise Database Settings
    supabaseUrl: env.SUPABASE_URL || '',
    supabaseServiceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY || ''
  };
}
