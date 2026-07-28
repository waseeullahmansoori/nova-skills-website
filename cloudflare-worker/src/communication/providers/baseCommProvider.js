/**
 * Abstract Base Communication Provider
 * Extensible for Meta WhatsApp, SMS (Twilio), Telegram, Push Notifications, and Voice Calls
 */

export class BaseCommProvider {
  constructor(config) {
    this.config = config;
  }

  async sendMessage(recipient, messagePayload) {
    throw new Error('sendMessage must be implemented by provider.');
  }

  async sendTemplateMessage(recipient, templateName, languageCode, parameters, mediaUrl) {
    throw new Error('sendTemplateMessage must be implemented by provider.');
  }
}
