/**
 * Nova Skills Platform — Certificate Repository Interface
 * Version: 13.0.0 (Certificate Storage & Verification Records)
 * 
 * Supports local memory store and Cloudflare KV (env.AI_CERTIFICATES).
 */

const IN_MEMORY_CERTIFICATES = new Map();
const NUMBER_INDEX = new Map();

export class CertificateRepository {
  /**
   * Saves or updates a certificate record
   */
  static async saveCertificate(cert, env = {}) {
    if (!cert || !cert.certificateId) return null;

    const timestamp = new Date().toISOString();
    const existing = await this.getCertificateById(cert.certificateId, env) || {};

    const updated = {
      ...existing,
      ...cert,
      updatedAt: timestamp
    };

    if (!updated.createdAt) {
      updated.createdAt = timestamp;
    }

    IN_MEMORY_CERTIFICATES.set(updated.certificateId, updated);
    if (updated.certificateNumber) {
      NUMBER_INDEX.set(updated.certificateNumber, updated.certificateId);
    }

    if (env.AI_CERTIFICATES && typeof env.AI_CERTIFICATES.put === 'function') {
      try {
        await env.AI_CERTIFICATES.put(`cert:${updated.certificateId}`, JSON.stringify(updated));
        if (updated.certificateNumber) {
          await env.AI_CERTIFICATES.put(`num:${updated.certificateNumber}`, updated.certificateId);
        }
      } catch (e) {
        console.warn('[CertificateRepository] KV Write Error:', e.message);
      }
    }

    return updated;
  }

  /**
   * Gets certificate by certificateId
   */
  static async getCertificateById(certificateId, env = {}) {
    if (!certificateId) return null;

    if (IN_MEMORY_CERTIFICATES.has(certificateId)) {
      return IN_MEMORY_CERTIFICATES.get(certificateId);
    }

    if (env.AI_CERTIFICATES && typeof env.AI_CERTIFICATES.get === 'function') {
      try {
        const raw = await env.AI_CERTIFICATES.get(`cert:${certificateId}`, { type: 'json' });
        if (raw) return raw;
      } catch (e) {}
    }

    return null;
  }

  /**
   * Gets certificate by certificateNumber (e.g. NS-DM-2026-000124)
   */
  static async getCertificateByNumber(certificateNumber, env = {}) {
    if (!certificateNumber) return null;
    const cleanNum = certificateNumber.trim();

    if (NUMBER_INDEX.has(cleanNum)) {
      const id = NUMBER_INDEX.get(cleanNum);
      return this.getCertificateById(id, env);
    }

    if (env.AI_CERTIFICATES && typeof env.AI_CERTIFICATES.get === 'function') {
      try {
        const id = await env.AI_CERTIFICATES.get(`num:${cleanNum}`);
        if (id) return this.getCertificateById(id, env);
      } catch (e) {}
    }

    return null;
  }

  /**
   * Returns all certificates
   */
  static async getAllCertificates() {
    const list = [];
    for (const [key, value] of IN_MEMORY_CERTIFICATES.entries()) {
      if (typeof value === 'object') {
        list.push(value);
      }
    }
    return list;
  }
}
