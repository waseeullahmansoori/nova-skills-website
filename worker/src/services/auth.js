/**
 * Nova Skills Platform — Auth Service & Cryptography
 * Version: 10.0.0 (WebCrypto PBKDF2 Hashing & Session Management)
 * 
 * Secure salted password hashing, user registration, authentication,
 * session token management, and role authorization.
 */

import { CONFIG_DEFAULTS, USER_ROLES, HTTP_STATUS } from '../config/constants.js';
import { UserRepository } from '../repositories/userRepository.js';
import { validateEmail, validatePhone } from '../utils/leadValidation.js';

const IN_MEMORY_SESSIONS = new Map();

export class AuthService {
  /**
   * Generates PBKDF2 password hash using WebCrypto API
   */
  static async hashPassword(password) {
    const encoder = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const passwordKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: CONFIG_DEFAULTS.PBKDF2_ITERATIONS,
        hash: 'SHA-256'
      },
      passwordKey,
      256
    );

    const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
    const hashHex = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');

    return `${saltHex}:${hashHex}`;
  }

  /**
   * Verifies password against stored salted PBKDF2 hash
   */
  static async verifyPassword(password, storedHash) {
    if (!password || !storedHash || !storedHash.includes(':')) return false;

    const [saltHex, originalHashHex] = storedHash.split(':');
    const salt = new Uint8Array(saltHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

    const encoder = new TextEncoder();
    const passwordKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: CONFIG_DEFAULTS.PBKDF2_ITERATIONS,
        hash: 'SHA-256'
      },
      passwordKey,
      256
    );

    const newHashHex = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');

    return newHashHex === originalHashHex;
  }

  /**
   * Validates password strength rules
   */
  static validatePasswordStrength(password) {
    if (!password || typeof password !== 'string') {
      return { isValid: false, error: 'Password is required' };
    }
    if (password.length < CONFIG_DEFAULTS.MIN_PASSWORD_LENGTH) {
      return { isValid: false, error: `Password must be at least ${CONFIG_DEFAULTS.MIN_PASSWORD_LENGTH} characters long` };
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one number' };
    }

    return { isValid: true };
  }

  /**
   * Registers a new user
   */
  static async registerUser(payload = {}, env = {}) {
    const { firstName, lastName, email, phone, password, role } = payload;

    if (!firstName || !lastName) {
      return { success: false, error: 'First name and last name are required', status: HTTP_STATUS.BAD_REQUEST };
    }

    const emailRes = validateEmail(email);
    if (!emailRes.isValid) {
      return { success: false, error: 'Valid email address is required', status: HTTP_STATUS.BAD_REQUEST };
    }

    const phoneRes = validatePhone(phone);
    if (!phoneRes.isValid) {
      return { success: false, error: 'Valid 10-digit Indian mobile number is required', status: HTTP_STATUS.BAD_REQUEST };
    }

    const passCheck = this.validatePasswordStrength(password);
    if (!passCheck.isValid) {
      return { success: false, error: passCheck.error, status: HTTP_STATUS.BAD_REQUEST };
    }

    // Check duplicate email
    const existing = await UserRepository.getUserByEmail(emailRes.email, env);
    if (existing) {
      return { success: false, error: 'An account with this email address already exists', status: HTTP_STATUS.BAD_REQUEST };
    }

    const passwordHash = await this.hashPassword(password);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const userRole = Object.values(USER_ROLES).includes(role) ? role : USER_ROLES.STUDENT;

    const user = {
      userId: userId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: emailRes.email,
      phone: phoneRes.phone,
      passwordHash: passwordHash,
      role: userRole,
      status: 'ACTIVE',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + '+' + lastName)}&background=0599a8&color=fff`,
      registrationDate: now,
      lastLogin: null,
      emailVerified: false,
      createdAt: now,
      updatedAt: now
    };

    const saved = await UserRepository.saveUser(user, env);
    const { passwordHash: _, ...userSafe } = saved;

    return { success: true, user: userSafe, message: 'User registered successfully' };
  }

  /**
   * Authenticates user credentials and issues session token
   */
  static async loginUser(payload = {}, env = {}) {
    const { email, password, rememberMe } = payload;

    if (!email || !password) {
      return { success: false, error: 'Email and password are required', status: HTTP_STATUS.BAD_REQUEST };
    }

    const emailRes = validateEmail(email);
    if (!emailRes.isValid) {
      return { success: false, error: 'Invalid email format', status: HTTP_STATUS.BAD_REQUEST };
    }

    const user = await UserRepository.getUserByEmail(emailRes.email, env);
    if (!user || user.status !== 'ACTIVE') {
      return { success: false, error: 'Invalid email or password credentials', status: HTTP_STATUS.UNAUTHORIZED };
    }

    const isMatch = await this.verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return { success: false, error: 'Invalid email or password credentials', status: HTTP_STATUS.UNAUTHORIZED };
    }

    // Update lastLogin timestamp
    user.lastLogin = new Date().toISOString();
    await UserRepository.saveUser(user, env);

    // Create session token
    const token = `ns_token_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
    const ttlMs = (rememberMe ? CONFIG_DEFAULTS.REMEMBER_ME_TTL_DAYS * 24 : CONFIG_DEFAULTS.SESSION_TTL_HOURS) * 3600 * 1000;
    const expiresAt = Date.now() + ttlMs;

    const session = {
      token: token,
      userId: user.userId,
      role: user.role,
      expiresAt: expiresAt
    };

    IN_MEMORY_SESSIONS.set(token, session);

    const { passwordHash: _, ...userSafe } = user;

    return {
      success: true,
      token: token,
      expiresAt: new Date(expiresAt).toISOString(),
      user: userSafe,
      message: 'Login successful'
    };
  }

  /**
   * Validates active session token
   */
  static async validateSession(token, env = {}) {
    if (!token) return null;
    const cleanToken = token.replace(/^Bearer\s+/i, '').trim();

    const session = IN_MEMORY_SESSIONS.get(cleanToken);
    if (!session) return null;

    if (Date.now() > session.expiresAt) {
      IN_MEMORY_SESSIONS.delete(cleanToken);
      return null;
    }

    const user = await UserRepository.getUserById(session.userId, env);
    if (!user || user.status !== 'ACTIVE') return null;

    const { passwordHash: _, ...userSafe } = user;
    return { session, user: userSafe };
  }

  /**
   * Invalidates session token (Logout)
   */
  static async logoutUser(token) {
    if (!token) return true;
    const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
    IN_MEMORY_SESSIONS.delete(cleanToken);
    return true;
  }
}
