/**
 * Enterprise Auth Email Templates Manager
 */

export const AUTH_EMAIL_TEMPLATES = {
  WELCOME_STUDENT: (name, email) => `
    <h1>Welcome to Nova Skills, ${name}!</h1>
    <p>Your student portal account (${email}) is now active.</p>
    <p><a href="https://novaskills.in/login">Click here to log in to your Student Dashboard</a></p>
  `,

  VERIFY_EMAIL: (name, verifyUrl) => `
    <h1>Verify your Nova Skills Email Address</h1>
    <p>Hi ${name}, please verify your email address by clicking the link below:</p>
    <p><a href="${verifyUrl}">${verifyUrl}</a></p>
  `,

  RESET_PASSWORD: (name, resetUrl) => `
    <h1>Reset your Nova Skills Password</h1>
    <p>Hi ${name}, click the link below to set a new password:</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>If you did not request this, please ignore this email.</p>
  `,

  STAFF_INVITATION: (name, role, inviteUrl) => `
    <h1>Nova Skills Staff Invitation — ${role}</h1>
    <p>Dear ${name}, you have been invited as a ${role} on the Nova Skills platform.</p>
    <p><a href="${inviteUrl}">Accept Invitation & Set Password</a></p>
  `,

  ACCOUNT_ACTIVATED: (name) => `
    <h1>Account Activated</h1>
    <p>Dear ${name}, your Nova Skills account is now active.</p>
  `,

  ACCOUNT_DEACTIVATED: (name) => `
    <h1>Account Notice</h1>
    <p>Dear ${name}, your Nova Skills account has been temporarily deactivated. Contact administrator for details.</p>
  `
};
