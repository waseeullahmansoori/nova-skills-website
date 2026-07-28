/**
 * Official Meta WhatsApp Business Cloud API Provider
 */

import { BaseCommProvider } from './baseCommProvider.js';

export class MetaWhatsAppProvider extends BaseCommProvider {
  constructor(config) {
    super(config);
    this.phoneNumberId = config.metaPhoneNumberId || env?.META_PHONE_NUMBER_ID || '';
    this.accessToken = config.metaAccessToken || env?.META_ACCESS_TOKEN || '';
    this.apiVersion = 'v19.0';
  }

  getApiUrl() {
    return `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;
  }

  formatPhone(recipient) {
    const clean = String(recipient || '').replace(/\D/g, '');
    return clean.length === 10 ? '91' + clean : clean;
  }

  async sendMessage(recipient, textContent) {
    if (!this.accessToken || !this.phoneNumberId) {
      // Graceful fallback for local/dev without Meta credentials
      return {
        success: true,
        simulated: true,
        messageId: `wamid.simulated.${Date.now()}`,
        status: 'Sent (Simulated)'
      };
    }

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: this.formatPhone(recipient),
      type: 'text',
      text: { body: textContent }
    };

    return await this.executeMetaApiCall(payload);
  }

  async sendTemplateMessage(recipient, templateName, languageCode = 'en', parameters = [], mediaUrl = null) {
    if (!this.accessToken || !this.phoneNumberId) {
      return {
        success: true,
        simulated: true,
        messageId: `wamid.template.simulated.${Date.now()}`,
        status: 'Sent (Simulated Template)'
      };
    }

    const components = [];

    if (mediaUrl) {
      components.push({
        type: 'header',
        parameters: [{ type: 'image', image: { link: mediaUrl } }]
      });
    }

    if (parameters && parameters.length > 0) {
      components.push({
        type: 'body',
        parameters: parameters.map(p => ({ type: 'text', text: String(p) }))
      });
    }

    const payload = {
      messaging_product: 'whatsapp',
      to: this.formatPhone(recipient),
      type: 'template',
      template: {
        name: templateName.toLowerCase(),
        language: { code: languageCode },
        components: components
      }
    };

    return await this.executeMetaApiCall(payload);
  }

  async executeMetaApiCall(payload) {
    const response = await fetch(this.getApiUrl(), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      let errJson = {};
      try { errJson = JSON.parse(errText); } catch (e) {}
      throw new Error(errJson.error?.message || `Meta WhatsApp API returned HTTP ${response.status}: ${errText}`);
    }

    const data = await response.json();
    return {
      success: true,
      messageId: data.messages && data.messages[0] ? data.messages[0].id : `wamid.${Date.now()}`,
      status: 'Queued',
      rawResponse: data
    };
  }
}
