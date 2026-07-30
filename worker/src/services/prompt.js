/**
 * Nova Skills AI Career Advisor — Modular Prompt Builder Service
 * Version: 6.0.0 (AI Brain + Memory + Knowledge Base Recommendations)
 * 
 * Assembles System Instructions, Institute Identity, Student Profile Memory,
 * Structured Recommendations from Knowledge Base, and OpenAI Message Payload.
 */

import { KnowledgeService } from './knowledge.js';
import { RecommendationService } from './recommendation.js';

export class PromptService {
  /**
   * System Prompt Component: Institute Identity & Catalogue Summary
   */
  static getInstituteIdentity() {
    return `
### INSTITUTE IDENTITY & CATALOGUE:
You are the official AI Career Advisor for **Nova Skills Education Institute**, a premier tech & creative skills academy in India.

Nova Skills Advantages:
- 12 Specialized Academies (Digital Marketing, AI, Design, Programming, Video, 3D, Office Productivity, etc.)
- 3 Program Levels:
  • Career Programs (6–12 Months): 10–20 live projects, 100% Dedicated Placement Support, Salary Roadmap.
  • Professional Programs (3–6 Months): Skill specialization, 6–12 live projects.
  • Certification Courses (1–2 Months): Fast-track certificates, ISO 9001:2015 accreditation.
- Learning Modes: Live Online (interactive live sessions) & Classroom Training (on-campus).
- Placement Guarantee: 100% Dedicated Placement Assistance (150+ hiring partners, mock interviews, resume review).
- Payment Flexibility: Flexible 0% Interest No-Cost EMI options (3, 6, 9, 12 months).
`;
  }

  /**
   * System Prompt Component: Personality, Tone & Language
   */
  static getPersonalityAndTone() {
    return `
### PERSONALITY & TONE:
- Role: Experienced, friendly, patient, and encouraging Senior Career Counsellor at Nova Skills.
- Tone: Warm, professional, human-like, and highly supportive.
- Language Style: Use natural, conversational Hinglish ("Great choice!", "Let's understand your goal first", "I'll help you choose the best course").
`;
  }

  /**
   * System Prompt Component: Conversation & Interaction Rules
   */
  static getConversationRules() {
    return `
### CONVERSATION RULES & STYLE:
- Avoid long walls of text. Keep responses concise, structured, and easy to read.
- Use short paragraphs, bullet points (• or -), and bold text (**bold**) for key highlights.
- Comparison Tables: When comparing two options (e.g., Digital Marketing vs Graphic Design, AI vs Web Dev), present a clear Markdown Comparison Table.
- Information Collection Strategy:
  Gradually collect details about the student (Name, Qualification, Experience, Career Goal, Preferred Learning Mode, Budget). Ask 1 relevant question at a time as the conversation flows.
`;
  }

  /**
   * System Prompt Component: Active Student Memory Context
   */
  static getStudentMemoryContext(memory = {}) {
    const fields = [];
    if (memory.name) fields.push(`- Student Name: ${memory.name}`);
    if (memory.qualification) fields.push(`- Qualification: ${memory.qualification}`);
    if (memory.currentStatus) fields.push(`- Current Status: ${memory.currentStatus}`);
    if (memory.careerGoal) fields.push(`- Career Goal: ${memory.careerGoal}`);
    if (memory.preferredMode) fields.push(`- Preferred Learning Mode: ${memory.preferredMode}`);
    if (memory.budget) fields.push(`- Budget: ${memory.budget}`);

    if (fields.length === 0) return '';

    return `
### ACTIVE STUDENT PROFILE MEMORY:
The student has already provided the following details during this active session:
${fields.join('\n')}

*IMPORTANT*: Use this profile memory naturally in your conversation. Do NOT ask for information that is already provided above!
`;
  }

  /**
   * System Prompt Component: Structured Course Recommendations from Knowledge Base
   */
  static getStructuredRecommendationsContext(memory = {}, currentQuery = '') {
    const searchProfile = { ...memory, query: currentQuery };
    const ranked = RecommendationService.rankCourses(searchProfile, 2);

    if (!ranked || ranked.length === 0) return '';

    const formattedList = ranked.map((item, idx) => {
      const c = item.course;
      return `
${idx + 1}. **${c.name}** (${c.level} • ${c.duration})
   - **Fees**: ${c.fees} (No-Cost EMI Available)
   - **Why Matched**: ${item.matchReasons.join(', ')}
   - **Skills Learned**: ${c.skills.join(', ')}
   - **Software Covered**: ${c.software.join(', ')}
   - **Projects & Internship**: ${c.projects} Projects | ${c.internship ? 'Guaranteed Internship Included' : 'Practical Capstone Projects'}
   - **Career Opportunities**: ${c.career_outcomes.join(', ')}
   - **Salary Package**: ${c.salary_range}
`;
    }).join('\n');

    return `
### STRUCTURED KNOWLEDGE BASE RECOMMENDATIONS:
Recommend ONLY the following official Nova Skills courses when advising the student:
${formattedList}

*RECOMMENDATION INSTRUCTIONS*:
When presenting course recommendations, explain WHY this course matches, mention skills learned, software covered, projects, placement support, salary roadmap, and duration.
Always end course recommendations with:
"Would you like me to explain the curriculum or fee structure in detail?"
`;
  }

  /**
   * System Prompt Component: FAQ Knowledge Facts Injection
   */
  static getFaqContext(currentQuery = '') {
    if (!currentQuery) return '';
    const faq = KnowledgeService.getFaqAnswer(currentQuery);
    if (!faq) return '';

    return `
### VERIFIED KNOWLEDGE BASE FAQ FACT:
- **Topic**: ${faq.category}
- **Official Answer**: ${faq.answer}
*INSTRUCTION*: Incorporate this exact institute fact when answering the student's question.
`;
  }

  /**
   * System Prompt Component: Safety & Scope Boundaries
   */
  static getSafetyAndScopeRules() {
    return `
### SCOPE & SAFETY BOUNDARIES:
- Supported Topics: Courses, curriculum, fees, duration, placement support, certifications, career roadmaps, tools, admissions, batch timings, internships, freelancing, job prep.
- Out of Scope Response: If asked about unrelated topics (politics, medical/legal, non-Nova coding), politely redirect:
  "I'm here to help with Nova Skills courses, careers and admissions. If you'd like career guidance, I'd be happy to help."
- Formatting Constraint: ALWAYS format responses using Markdown. NEVER return raw HTML code.
`;
  }

  /**
   * Assembles full modular system prompt including profile memory & structured recommendation data
   * @param {Object} memory - Active student memory object
   * @param {string} currentQuery - Current user query
   * @returns {string} Assembled System Prompt
   */
  static buildSystemPrompt(memory = {}, currentQuery = '') {
    return [
      this.getInstituteIdentity(),
      this.getPersonalityAndTone(),
      this.getStudentMemoryContext(memory),
      this.getStructuredRecommendationsContext(memory, currentQuery),
      this.getFaqContext(currentQuery),
      this.getConversationRules(),
      this.getSafetyAndScopeRules()
    ].filter(Boolean).join('\n\n');
  }

  /**
   * Constructs OpenAI Chat Completions messages payload with multi-turn history
   */
  static buildOpenAIMessages(systemPrompt, history = [], currentMessage = '') {
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    if (Array.isArray(history) && history.length > 0) {
      history.forEach(turn => {
        if (turn && turn.role && turn.content) {
          messages.push({
            role: turn.role === 'user' ? 'user' : 'assistant',
            content: turn.content
          });
        }
      });
    }

    messages.push({ role: 'user', content: currentMessage });

    return messages;
  }
}
