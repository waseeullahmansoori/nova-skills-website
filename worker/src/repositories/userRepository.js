/**
 * Nova Skills Platform — User Repository Interface
 * Version: 10.0.0 (User Management & Storage)
 * 
 * Supports local memory store and Cloudflare KV fallback (env.AI_USERS).
 */

const IN_MEMORY_USERS = new Map();
const EMAIL_INDEX = new Map();

export class UserRepository {
  /**
   * Saves or updates a user record
   * @param {Object} user - User object
   * @param {Object} env - Cloudflare Worker environment bindings
   * @returns {Promise<Object>} Saved user object
   */
  static async saveUser(user, env = {}) {
    if (!user || !user.userId) return null;

    const timestamp = new Date().toISOString();
    const existing = await this.getUserById(user.userId, env) || {};

    const updatedUser = {
      ...existing,
      ...user,
      email: (user.email || existing.email || '').toLowerCase().trim(),
      updatedAt: timestamp
    };

    if (!updatedUser.createdAt) {
      updatedUser.createdAt = timestamp;
    }

    // 1. Save in local memory
    IN_MEMORY_USERS.set(updatedUser.userId, updatedUser);
    if (updatedUser.email) {
      EMAIL_INDEX.set(updatedUser.email, updatedUser.userId);
    }

    // 2. Save in Cloudflare KV if available
    if (env.AI_USERS && typeof env.AI_USERS.put === 'function') {
      try {
        await env.AI_USERS.put(`user:${updatedUser.userId}`, JSON.stringify(updatedUser));
        if (updatedUser.email) {
          await env.AI_USERS.put(`email:${updatedUser.email}`, updatedUser.userId);
        }
      } catch (e) {
        console.warn('[UserRepository] KV Write Error:', e.message);
      }
    }

    return updatedUser;
  }

  /**
   * Gets a user by userId
   */
  static async getUserById(userId, env = {}) {
    if (!userId) return null;

    if (IN_MEMORY_USERS.has(userId)) {
      return IN_MEMORY_USERS.get(userId);
    }

    if (env.AI_USERS && typeof env.AI_USERS.get === 'function') {
      try {
        const raw = await env.AI_USERS.get(`user:${userId}`, { type: 'json' });
        if (raw) return raw;
      } catch (e) {}
    }

    return null;
  }

  /**
   * Gets a user by email
   */
  static async getUserByEmail(email, env = {}) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();

    if (EMAIL_INDEX.has(cleanEmail)) {
      const userId = EMAIL_INDEX.get(cleanEmail);
      return this.getUserById(userId, env);
    }

    if (env.AI_USERS && typeof env.AI_USERS.get === 'function') {
      try {
        const userId = await env.AI_USERS.get(`email:${cleanEmail}`);
        if (userId) return this.getUserById(userId, env);
      } catch (e) {}
    }

    return null;
  }

  /**
   * Deletes a user by userId
   */
  static async deleteUser(userId, env = {}) {
    if (!userId) return;
    const user = await this.getUserById(userId, env);

    IN_MEMORY_USERS.delete(userId);
    if (user && user.email) {
      EMAIL_INDEX.delete(user.email);
    }

    if (env.AI_USERS && typeof env.AI_USERS.delete === 'function') {
      try {
        await env.AI_USERS.delete(`user:${userId}`);
        if (user && user.email) {
          await env.AI_USERS.delete(`email:${user.email}`);
        }
      } catch (e) {}
    }
  }

  /**
   * Returns all users
   */
  static async getAllUsers() {
    const list = [];
    for (const [key, value] of IN_MEMORY_USERS.entries()) {
      if (typeof value === 'object') {
        list.push(value);
      }
    }
    return list;
  }
}
