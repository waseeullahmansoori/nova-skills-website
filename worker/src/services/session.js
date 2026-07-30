/**
 * Nova Skills AI Career Advisor — Session Manager Service
 * Version: 5.0.0 (Conversation Memory & Session Management)
 * 
 * Responsibilities:
 * - Create, read, update, delete, and expire chat sessions
 * - Retain structured student memory attributes throughout an active session
 * - Maintain sliding window conversation history for token efficiency
 */

// In-memory store fallback for development / edge worker instance
const IN_MEMORY_SESSIONS = new Map();
const SESSION_TTL_MS = 3600 * 1000; // 1 Hour Inactivity Expiry

export class SessionService {
  /**
   * Generates default structured memory model
   */
  static createDefaultMemory() {
    return {
      name: null,
      phone: null,
      email: null,
      city: null,
      qualification: null,
      currentStatus: null,
      careerGoal: null,
      interest: null,
      experience: null,
      budget: null,
      preferredMode: null,
      recommendedCourse: null
    };
  }

  /**
   * Generates a new unique session ID if not provided
   */
  static generateSessionId() {
    return `nova_session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Retrieves an active session or creates a new one
   * @param {string} sessionId - Session identifier
   * @param {Object} env - Cloudflare Worker environment bindings
   * @returns {Promise<Object>} Session object { sessionId, memory, history, lastActive }
   */
  static async getSession(sessionId, env = {}) {
    const validId = (sessionId && typeof sessionId === 'string' && sessionId.trim()) 
      ? sessionId.trim() 
      : this.generateSessionId();

    let session = null;

    // 1. Check Cloudflare KV binding if present
    if (env.AI_SESSIONS && typeof env.AI_SESSIONS.get === 'function') {
      try {
        const rawData = await env.AI_SESSIONS.get(validId, { type: 'json' });
        if (rawData) session = rawData;
      } catch (e) {
        console.warn('[SessionService] KV Read Exception, falling back to local memory:', e.message);
      }
    }

    // 2. Check local memory store
    if (!session && IN_MEMORY_SESSIONS.has(validId)) {
      session = IN_MEMORY_SESSIONS.get(validId);
    }

    // 3. Expiry check
    if (session && (Date.now() - session.lastActive > SESSION_TTL_MS)) {
      session = null; // Session expired
    }

    // 4. Initialize new session if absent or expired
    if (!session) {
      session = {
        sessionId: validId,
        memory: this.createDefaultMemory(),
        history: [], // Array of { role, content, timestamp }
        lastActive: Date.now()
      };
    }

    return session;
  }

  /**
   * Updates and persists session state
   * @param {string} sessionId - Session identifier
   * @param {Object} updatedMemory - Updated student memory attributes
   * @param {Array} updatedHistory - Updated sliding window conversation history
   * @param {Object} env - Cloudflare Worker environment bindings
   */
  static async saveSession(sessionId, updatedMemory, updatedHistory, env = {}) {
    if (!sessionId) return;

    // Keep sliding window of recent 6 turns (12 messages max)
    const slidingHistory = (updatedHistory || []).slice(-12);

    const sessionData = {
      sessionId: sessionId,
      memory: updatedMemory || this.createDefaultMemory(),
      history: slidingHistory,
      lastActive: Date.now()
    };

    // Save to local memory
    IN_MEMORY_SESSIONS.set(sessionId, sessionData);

    // Save to Cloudflare KV if available (TTL 3600 seconds)
    if (env.AI_SESSIONS && typeof env.AI_SESSIONS.put === 'function') {
      try {
        await env.AI_SESSIONS.put(sessionId, JSON.stringify(sessionData), { expirationTtl: 3600 });
      } catch (e) {
        console.warn('[SessionService] KV Write Exception:', e.message);
      }
    }

    this.cleanupExpired();
  }

  /**
   * Deletes a session (Reset Chat)
   * @param {string} sessionId - Session identifier
   * @param {Object} env - Cloudflare Worker environment bindings
   */
  static async deleteSession(sessionId, env = {}) {
    if (!sessionId) return;
    IN_MEMORY_SESSIONS.delete(sessionId);
    if (env.AI_SESSIONS && typeof env.AI_SESSIONS.delete === 'function') {
      try {
        await env.AI_SESSIONS.delete(sessionId);
      } catch (e) {}
    }
  }

  /**
   * Extracts student memory attributes from user message
   * @param {string} userText - User message text
   * @param {Object} currentMemory - Current student memory object
   * @returns {Object} Updated memory object
   */
  static extractMemory(userText, currentMemory = {}) {
    if (!userText || typeof userText !== 'string') return currentMemory;
    const memory = { ...this.createDefaultMemory(), ...currentMemory };

    const text = userText.trim();

    // 1. Name Extraction
    if (!memory.name) {
      const nameMatch = text.match(/(?:my name is|i am|call me|name's|this is)\s+([a-zA-Z]{2,20})/i);
      if (nameMatch && nameMatch[1]) {
        const candidate = nameMatch[1].trim();
        const ignoreWords = ['interested', 'looking', 'student', 'fresher', 'graduate', 'here', 'ready'];
        if (!ignoreWords.includes(candidate.toLowerCase())) {
          memory.name = candidate.charAt(0).toUpperCase() + candidate.slice(1).toLowerCase();
        }
      }
    }

    // 2. Phone Extraction (10 digit Indian mobile)
    if (!memory.phone) {
      const phoneMatch = text.match(/([6-9]\d{9})/);
      if (phoneMatch && phoneMatch[1]) {
        memory.phone = phoneMatch[1];
      }
    }

    // 3. Email Extraction
    if (!memory.email) {
      const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
      if (emailMatch && emailMatch[1]) {
        memory.email = emailMatch[1].toLowerCase();
      }
    }

    // 4. City Extraction
    if (!memory.city) {
      const cityMatch = text.match(/(?:in|from|at|living in|city)\s+([a-zA-Z]{3,20})/i);
      if (cityMatch && cityMatch[1]) {
        const candidate = cityMatch[1].toLowerCase();
        const ignoreWords = ['online', 'classroom', 'college', 'school', 'home', 'today'];
        if (!ignoreWords.includes(candidate)) {
          memory.city = candidate.charAt(0).toUpperCase() + candidate.slice(1);
        }
      }
    }

    // 5. Qualification Extraction
    if (!memory.qualification) {
      const qualMatch = text.match(/(b\.?com|b\.?tech|bca|mca|bba|mba|12th|10th|graduate|post\s*graduate|diploma|b\.?sc|m\.?sc|engineering)/i);
      if (qualMatch && qualMatch[1]) {
        memory.qualification = qualMatch[1].toUpperCase();
      }
    }

    // 6. Budget Extraction
    if (!memory.budget) {
      const budgetMatch = text.match(/(?:budget|fee|around|upto|within|spend)\s*(?:is|of)?\s*(₹?\s*\d{2,6}k?|\d{2,6}\s*rs|\d{2,6}\s*inr)/i);
      if (budgetMatch && budgetMatch[1]) {
        memory.budget = budgetMatch[1].trim();
      }
    }

    // 7. Preferred Mode Extraction
    if (!memory.preferredMode) {
      const modeMatch = text.match(/(online|classroom|live|offline|hybrid)/i);
      if (modeMatch && modeMatch[1]) {
        const m = modeMatch[1].toLowerCase();
        memory.preferredMode = (m === 'online' || m === 'live') ? 'Live Online' : 'Classroom';
      }
    }

    // 8. Current Status / Experience Extraction
    if (!memory.currentStatus) {
      const statusMatch = text.match(/(fresher|working\s*professional|working|student|freelancer|beginner|job\s*seeker)/i);
      if (statusMatch && statusMatch[1]) {
        memory.currentStatus = statusMatch[1].toLowerCase();
      }
    }

    return memory;
  }

  /**
   * Housekeeping: Purge expired local sessions
   */
  static cleanupExpired() {
    const now = Date.now();
    for (const [id, data] of IN_MEMORY_SESSIONS.entries()) {
      if (now - data.lastActive > SESSION_TTL_MS) {
        IN_MEMORY_SESSIONS.delete(id);
      }
    }
  }
}
