/**
 * Nova Skills AI Career Advisor — Chat Route
 * POST /api/chat & POST /api/ai/chat
 */

import { validateChatPayload } from '../utils/validation.js';
import { createSuccessResponse, createErrorResponse } from '../utils/response.js';
import { SessionService } from '../services/session.js';
import { RecommendationService } from '../services/recommendation.js';
import { LeadService } from '../services/lead.js';
import { AIService } from '../services/ai.js';
import { HTTP_STATUS } from '../config/constants.js';

export async function handleChatRoute(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (err) {
    return createErrorResponse('Invalid JSON in request body', HTTP_STATUS.BAD_REQUEST);
  }

  // 1. Payload validation
  const validation = validateChatPayload(body);
  if (!validation.isValid) {
    return createErrorResponse(validation.error, HTTP_STATUS.BAD_REQUEST);
  }

  // 2. Fetch or create session state
  const rawSessionId = body.sessionId || body.session_id;
  const session = await SessionService.getSession(rawSessionId, env);

  // 3. Extract and update student memory from user message
  const updatedMemory = SessionService.extractMemory(validation.message, session.memory);

  // 4. Calculate top course recommendations from Knowledge Base
  const topRecommendations = RecommendationService.rankCourses(
    { ...updatedMemory, query: validation.message },
    2
  );

  if (topRecommendations.length > 0 && !updatedMemory.recommendedCourse) {
    updatedMemory.recommendedCourse = topRecommendations[0].course.name;
  }

  // 5. Execute AI Service completion with session history & memory context
  const result = await AIService.generateCompletion(
    validation.message,
    session.history,
    updatedMemory,
    env
  );

  // 6. Update sliding conversation history
  const now = new Date().toISOString();
  const updatedHistory = [
    ...(session.history || []),
    { role: 'user', content: validation.message, timestamp: now },
    { role: 'assistant', content: result.text, timestamp: now }
  ];

  // 7. Persist updated session memory & history
  await SessionService.saveSession(session.sessionId, updatedMemory, updatedHistory, env);

  // 8. Auto-capture / update qualified lead record in LeadRepository
  const leadRecord = await LeadService.processLeadFromSession(
    { sessionId: session.sessionId, memory: updatedMemory },
    {},
    env
  );

  // 9. Handle special error status codes if API key is missing / rate limited
  if (result.isFallback && result.status === HTTP_STATUS.TOO_MANY_REQUESTS) {
    return createErrorResponse('OpenAI API rate limit or quota exceeded. Please try again later.', HTTP_STATUS.TOO_MANY_REQUESTS);
  }

  // 10. Return success response including active sessionId, memory summary, lead metrics & recommendations
  return createSuccessResponse({
    sessionId: session.sessionId,
    leadId: leadRecord.leadId,
    leadScore: leadRecord.leadScore,
    qualificationStatus: leadRecord.qualificationStatus,
    response: result.text,
    usage: result.usage,
    recommendations: topRecommendations.map(r => ({
      name: r.course.name,
      level: r.course.level,
      fees: r.course.fees,
      score: r.score,
      matchReasons: r.matchReasons
    })),
    memorySummary: {
      name: updatedMemory.name,
      phone: updatedMemory.phone,
      qualification: updatedMemory.qualification,
      preferredMode: updatedMemory.preferredMode
    }
  });
}
