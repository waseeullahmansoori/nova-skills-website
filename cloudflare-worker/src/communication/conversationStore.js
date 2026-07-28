/**
 * Conversation History & Delivery Status Tracker Module
 */

const messageLogs = new Map();
const conversationHistories = new Map();

export function recordMessageSent(messageId, payload) {
  const entry = {
    messageId: messageId,
    timestamp: new Date().toISOString(),
    recipient: payload.recipient,
    template: payload.templateKey || 'DIRECT_TEXT',
    channel: payload.channel || 'WHATSAPP_META',
    content: payload.content || '',
    status: payload.status || 'Queued',
    retryCount: 0
  };

  messageLogs.set(messageId, entry);

  // Store in conversation history
  const cleanRecipient = String(payload.recipient).replace(/\D/g, '');
  if (!conversationHistories.has(cleanRecipient)) {
    conversationHistories.set(cleanRecipient, []);
  }
  conversationHistories.get(cleanRecipient).push(entry);

  return entry;
}

export function updateMessageStatus(messageId, status) {
  if (messageLogs.has(messageId)) {
    const entry = messageLogs.get(messageId);
    entry.status = status;
    entry.updatedAt = new Date().toISOString();
    return entry;
  }
  return null;
}

export function getMessageStatus(messageId) {
  return messageLogs.get(messageId) || null;
}

export function getConversationHistory(recipient) {
  const cleanRecipient = String(recipient || '').replace(/\D/g, '');
  return conversationHistories.get(cleanRecipient) || [];
}
