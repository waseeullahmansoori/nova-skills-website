/**
 * Centralized Settings & Configuration Service
 * Manages Institute Info, Branding, Social Links, AI Config, Contact, and Security settings with caching.
 */

import { SupabaseWorkerClient } from '../supabase/client.js';

let settingsCache = null;
let cacheTime = 0;
const CACHE_TTL_MS = 300000; // 5 minutes

export const DEFAULT_SETTINGS = {
  institute: {
    name: 'Nova Skills Academy',
    tagline: 'Empowering Next-Gen Tech & Marketing Leaders',
    address: '123 Skill Hub, Hazratganj',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    country: 'India',
    website: 'https://novaskills.in',
    supportEmail: 'support@novaskills.in',
    supportPhone: '+91 98765 43210',
    whatsappNumber: '+91 98765 43210'
  },
  branding: {
    logoUrl: 'https://novaskills.in/assets/logo.png',
    faviconUrl: 'https://novaskills.in/favicon.ico',
    primaryColor: '#0599a8',
    secondaryColor: '#011731'
  },
  social: {
    facebook: 'https://facebook.com/novaskills',
    instagram: 'https://instagram.com/novaskills',
    linkedin: 'https://linkedin.com/company/novaskills',
    youtube: 'https://youtube.com/@novaskills',
    twitter: 'https://x.com/novaskills'
  },
  ai: {
    systemPrompt: 'You are Nova Skills AI Advisor representing Nova Skills Academy.',
    welcomeMessage: 'Hello! I am your Nova Skills AI Advisor.',
    aiEnabled: true
  },
  contact: {
    admissionEmail: 'admissions@novaskills.in',
    admissionPhone: '+91 98765 43211',
    officeTiming: 'Mon – Sat: 9:00 AM – 7:00 PM IST'
  },
  security: {
    sessionTimeoutMinutes: 1440,
    maintenanceMode: false
  }
};

export async function getPlatformSettings(env, config) {
  if (settingsCache && (Date.now() - cacheTime < CACHE_TTL_MS)) {
    return settingsCache;
  }

  const client = new SupabaseWorkerClient(env, config);
  if (!client.isConfigured()) {
    settingsCache = DEFAULT_SETTINGS;
    cacheTime = Date.now();
    return DEFAULT_SETTINGS;
  }

  try {
    const builder = await client.from('settings');
    const result = await builder.select('*');
    if (result.data && result.data.length > 0) {
      settingsCache = result.data[0].config_data;
      cacheTime = Date.now();
      return settingsCache;
    }
  } catch (err) {
    console.warn('Error fetching settings from Supabase:', err.message);
  }

  settingsCache = DEFAULT_SETTINGS;
  cacheTime = Date.now();
  return DEFAULT_SETTINGS;
}

export async function updatePlatformSettings(newSettings, env, config) {
  const merged = { ...DEFAULT_SETTINGS, ...newSettings };
  settingsCache = merged;
  cacheTime = Date.now();

  const client = new SupabaseWorkerClient(env, config);
  if (client.isConfigured()) {
    try {
      const builder = await client.from('settings');
      await builder.insert({ id: 'config-master', config_data: merged, updated_at: new Date().toISOString() });
    } catch (err) {
      console.warn('Error saving settings to Supabase:', err.message);
    }
  }

  return { success: true, settings: merged };
}
