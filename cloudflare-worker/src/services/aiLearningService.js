/**
 * AI Learning Coach & Tutor Service
 */

import { createAIProvider } from '../providers/index.js';
import { AI_LEARNING_ASSISTANT_PROMPT, STUDENT_PROMPT_VERSION } from '../prompts/studentPrompts.js';
import { logRequest } from '../logger/index.js';

export async function processStudentLearningQuery({ endpoint, userQuery, courseContext = 'Digital Marketing', config }) {
  const startTime = Date.now();
  const provider = createAIProvider('openai', config);

  const promptText = `
STUDENT COURSE CONTEXT: ${courseContext}
STUDENT QUESTION / DOUBT: "${userQuery}"

Provide a structured, helpful explanation following the required JSON schema.
`;

  const messages = [
    { role: 'system', content: AI_LEARNING_ASSISTANT_PROMPT },
    { role: 'user', content: promptText }
  ];

  try {
    const completion = await provider.generateCompletion(messages, {
      model: config.openaiModel
    });

    const executionTimeMs = Date.now() - startTime;

    let parsedJSON = {};
    try {
      let cleanText = completion.text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```/, '').replace(/```$/, '').trim();
      }
      parsedJSON = JSON.parse(cleanText);
    } catch (jsonErr) {
      parsedJSON = {
        explanation: completion.text,
        keyTakeaways: ["Practice with hands-on projects", "Review course notes"],
        codeOrWorkflowSnippet: "N/A",
        recommendedNextStep: "Apply this concept in your current assignment project.",
        interviewTip: "Be ready to explain this concept in 2 minutes during technical interviews."
      };
    }

    parsedJSON.promptVersion = STUDENT_PROMPT_VERSION;

    logRequest({
      endpoint: endpoint,
      status: 'success',
      executionTimeMs: executionTimeMs,
      modelUsed: completion.modelUsed,
      usage: completion.usage
    });

    return {
      success: true,
      data: parsedJSON
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
