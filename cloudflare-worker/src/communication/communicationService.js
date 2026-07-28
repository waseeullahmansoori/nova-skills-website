/**
 * Core Enterprise Communication Platform Service
 * Orchestrates Meta WhatsApp Business Cloud API, templates, consent management, and audit tracking.
 */

import { MetaWhatsAppProvider } from './providers/metaWhatsAppProvider.js';
import { compileCommunicationTemplate } from './templateManager.js';
import { getUserConsentStatus } from './consentManager.js';
import { recordMessageSent, updateMessageStatus, getMessageStatus, getConversationHistory } from './conversationStore.js';
import { logRequest } from '../logger/index.js';

export async function sendCommunication({ recipient, templateKey, messageText, dataMap = {}, mediaUrl, languageCode = 'en', config }) {
  const startTime = Date.now();

  // 1. Consent Check
  const consent = getUserConsentStatus(recipient);
  if (consent.optedOut && templateKey !== 'TRANSACTIONAL') {
    throw new Error(`Recipient ${recipient} has opted out of marketing communications.`);
  }

  // 2. Compile Content
  let content = messageText || '';
  if (templateKey) {
    content = compileCommunicationTemplate(templateKey, dataMap);
  }

  // 3. Instantiate Meta WhatsApp Provider
  const provider = new MetaWhatsAppProvider(config);

  let sendResult = null;

  try {
    if (templateKey) {
      const templateParams = Object.values(dataMap);
      sendResult = await provider.sendTemplateMessage(recipient, templateKey, languageCode, templateParams, mediaUrl);
    } else {
      sendResult = await provider.sendMessage(recipient, content);
    }

    const executionTimeMs = Date.now() - startTime;

    // 4. Record sent log in conversation store
    const logEntry = recordMessageSent(sendResult.messageId, {
      recipient: recipient,
      templateKey: templateKey,
      channel: 'WHATSAPP_META',
      content: content,
      status: sendResult.status || 'Sent'
    });

    logRequest({
      endpoint: '/api/communication/send',
      status: 'success',
      executionTimeMs: executionTimeMs,
      modelUsed: 'MetaWhatsAppCloudAPI'
    });

    return {
      success: true,
      messageId: sendResult.messageId,
      status: sendResult.status,
      simulated: sendResult.simulated || false,
      recipient: recipient,
      compiledMessage: content
    };

  } catch (err) {
    const executionTimeMs = Date.now() - startTime;

    logRequest({
      endpoint: '/api/communication/send',
      status: 'error',
      executionTimeMs: executionTimeMs,
      error: err
    });

    throw err;
  }
}
