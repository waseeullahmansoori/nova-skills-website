/**
 * AI Student Assistant Core Service
 * Supports English, Hindi, Hinglish, Grounded RAG Knowledge, Lead Capture, and Human Handoff.
 */

import { createAIProvider } from '../providers/index.js';
import { KNOWLEDGE_BASE } from '../knowledge/knowledgeBase.js';
import { EXTENDED_KNOWLEDGE_BASE } from '../knowledge/extendedKnowledge.js';
import { sanitizeUserInput } from '../security/sanitizer.js';
import { extractLeadDetailsFromChat, sendLeadToCRM } from './leadCaptureService.js';
import { logRequest } from '../logger/index.js';

const STUDENT_ASSISTANT_SYSTEM_PROMPT = `
You are Nova Skills' friendly, supportive AI Student Admission Assistant.
Your mission is to help prospective students learn about Nova Skills academy, select the right course, understand fees, class timings, placement support, and book a free counselling session.

LANGUAGE SUPPORT:
- Support English, Hindi, and Hinglish (Hindi written in Roman script) naturally.
- Respond in the exact language/tone the user uses.

OFFICIAL INSTITUTIONAL KNOWLEDGE BASE:
${JSON.stringify({ ...KNOWLEDGE_BASE, ...EXTENDED_KNOWLEDGE_BASE }, null, 2)}

STRICT RULES:
1. Ground all answers strictly in the Knowledge Base.
2. If data is unavailable, politely inform the student and invite them to connect with a human counsellor.
3. Be encouraging, professional, concise, and helpful.
4. Encourage the student to share their name & phone number so a career counsellor can call them.
`;

export async function processStudentChat({ endpoint, userMessage, messages = [], config, reqOrigin }) {
  const startTime = Date.now();
  const sanitizedMessage = sanitizeUserInput(userMessage);
  const provider = createAIProvider('openai', config);

  // 1. Check for Automatic Lead Capture in Conversation
  let leadCaptured = false;
  let leadResult = null;
  const leadPayload = extractLeadDetailsFromChat(sanitizedMessage, messages);

  if (leadPayload) {
    leadResult = await sendLeadToCRM(leadPayload);
    if (leadResult && leadResult.success) {
      leadCaptured = true;
    }
  }

  // 2. Prepare API Message History
  const apiMessages = [
    { role: 'system', content: STUDENT_ASSISTANT_SYSTEM_PROMPT }
  ];

  if (Array.isArray(messages) && messages.length > 0) {
    messages.slice(-6).forEach(msg => {
      if (msg.role && msg.content) {
        apiMessages.push({ role: msg.role, content: sanitizeUserInput(msg.content) });
      }
    });
  }

  if (sanitizedMessage) {
    apiMessages.push({ role: 'user', content: sanitizedMessage });
  }

  try {
    const completion = await provider.generateCompletion(apiMessages, {
      model: config.openaiModel
    });

    const executionTimeMs = Date.now() - startTime;
    const responseText = completion.text;

    // 3. Human Handoff & Low Confidence Detection
    const lowerResp = responseText.toLowerCase();
    const lowerInput = sanitizedMessage.toLowerCase();
    const handoffKeywords = ['talk to human', 'call me', 'counsellor number', 'human agent', 'speak to team', 'contact support'];
    const handoffRequired = handoffKeywords.some(k => lowerInput.includes(k) || lowerResp.includes('human counsellor'));

    // 4. Dynamic Suggested Questions
    const suggestedQuestions = [
      "Which course is best for me?",
      "What are the course fees & installments?",
      "Do you provide 100% placement assistance?",
      "Can I book a free demo class?"
    ];

    const cleanWhatsappUrl = `https://wa.me/919695904440?text=${encodeURIComponent('Hello Nova Skills, I have a query regarding course admissions.')}`;

    // 5. Audit Logging
    logRequest({
      endpoint: endpoint,
      status: 'success',
      executionTimeMs: executionTimeMs,
      modelUsed: completion.modelUsed,
      usage: completion.usage
    });

    return {
      success: true,
      answer: responseText,
      confidence: handoffRequired ? 70 : 95,
      source: "Knowledge Base",
      suggestedQuestions: suggestedQuestions,
      handoffRequired: handoffRequired,
      leadCaptured: leadCaptured,
      leadDetails: leadCaptured ? { leadId: leadResult?.leadId, status: leadResult?.status } : null,
      whatsappUrl: cleanWhatsappUrl
    };

  } catch (err) {
    const executionTimeMs = Date.now() - startTime;

    logRequest({
      endpoint: endpoint,
      status: 'error',
      executionTimeMs: executionTimeMs,
      error: err
    });

    throw err;
  }
}
