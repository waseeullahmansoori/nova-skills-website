/**
 * Nova Skills Platform — Certificate & Verification Routes
 * POST /api/certificates
 * GET /api/certificates
 * GET /api/certificates/:id
 * GET /api/verify/:certificateNumber
 * POST /api/certificates/:id/regenerate
 * POST /api/certificates/:id/revoke
 */

import { CertificateService } from '../services/certificate.js';
import { CertificateRepository } from '../repositories/certificateRepository.js';
import { createSuccessResponse, createErrorResponse } from '../utils/response.js';
import { HTTP_STATUS } from '../config/constants.js';

export async function handleCertificateRoute(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/$/, '');
  const method = request.method;

  // 1. GET /api/verify/:certificateNumber or GET /api/verify?code=...
  if (method === 'GET' && pathname.startsWith('/api/verify')) {
    const parts = pathname.split('/');
    let certNum = parts[3];
    if (!certNum) {
      certNum = url.searchParams.get('code') || url.searchParams.get('number');
    }

    const verification = await CertificateService.verifyCertificate(certNum, env);
    return createSuccessResponse(verification);
  }

  // 2. POST /api/certificates — Issue certificate
  if (method === 'POST' && pathname === '/api/certificates') {
    let body;
    try { body = await request.json(); } catch(e) {
      return createErrorResponse('Invalid JSON payload body', HTTP_STATUS.BAD_REQUEST);
    }

    const cert = await CertificateService.generateCertificate(body, env);
    return createSuccessResponse({ certificate: cert, message: 'Certificate issued successfully' }, HTTP_STATUS.CREATED);
  }

  // 3. POST /api/certificates/:id/revoke
  if (method === 'POST' && pathname.includes('/revoke')) {
    const parts = pathname.split('/');
    const certId = parts[3];
    let body = {};
    try { body = await request.json(); } catch(e) {}

    const revoked = await CertificateService.revokeCertificate(certId, body.reason, env);
    if (!revoked) return createErrorResponse('Certificate not found', HTTP_STATUS.NOT_FOUND);

    return createSuccessResponse({ certificate: revoked, message: 'Certificate revoked successfully' });
  }

  // 4. POST /api/certificates/:id/regenerate
  if (method === 'POST' && pathname.includes('/regenerate')) {
    const parts = pathname.split('/');
    const certId = parts[3];

    const regen = await CertificateService.regenerateCertificate(certId, env);
    if (!regen) return createErrorResponse('Certificate not found', HTTP_STATUS.NOT_FOUND);

    return createSuccessResponse({ certificate: regen, message: 'Certificate re-issued successfully' });
  }

  // 5. GET /api/certificates — List certificates
  if (method === 'GET' && (pathname === '/api/certificates' || pathname === '/api/certificates/')) {
    const certs = await CertificateRepository.getAllCertificates();
    if (certs.length === 0) {
      // Return default demo certificate if empty
      const demo = await CertificateService.generateCertificate({}, env);
      return createSuccessResponse({ certificates: [demo], count: 1 });
    }
    return createSuccessResponse({ certificates: certs, count: certs.length });
  }

  // 6. GET /api/certificates/:id — Get certificate details
  if (method === 'GET' && pathname.startsWith('/api/certificates')) {
    const parts = pathname.split('/');
    const certId = parts[3];

    const cert = await CertificateRepository.getCertificateById(certId, env);
    if (!cert) return createErrorResponse('Certificate record not found', HTTP_STATUS.NOT_FOUND);

    return createSuccessResponse({ certificate: cert });
  }

  return createErrorResponse('Certificate endpoint method not allowed', HTTP_STATUS.METHOD_NOT_ALLOWED);
}
