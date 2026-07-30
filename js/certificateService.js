/**
 * Nova Skills Platform — Certificate Service Interface
 * Version: 13.0.0 (Certificate API Client)
 */

export class CertificateService {
  static async getCertificates() {
    try {
      const res = await fetch('/api/certificates');
      if (res.ok) {
        const data = await res.json();
        return data.certificates || [];
      }
    } catch (e) {}

    return [
      {
        certificateId: 'cert_demo_101',
        certificateNumber: 'NS-DM-2026-000124',
        studentName: 'Rahul Sharma',
        courseName: 'Master in Digital Marketing & Performance Marketing',
        issueDate: '2026-07-28',
        grade: 'A+',
        percentage: 95,
        trainerName: 'Priya Mehta (Ex-Google Marketer)',
        verificationCode: 'VERIFY-9A88F12',
        verificationUrl: 'https://novaskills.in/verify?code=NS-DM-2026-000124',
        status: 'VALID'
      }
    ];
  }

  static async verifyCertificate(certificateNumber) {
    try {
      const res = await fetch(`/api/verify/${certificateNumber}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

    return { isValid: false, status: 'ERROR', message: 'Verification connection error' };
  }
}
