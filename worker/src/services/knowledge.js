/**
 * Nova Skills AI Career Advisor — Knowledge Base Service
 * Version: 6.0.0 (Decoupled JSON Knowledge Service)
 * 
 * Provides clean accessors for structured course data, FAQs, career paths,
 * admissions guidelines, placement records, and software tool mappings.
 */

import coursesData from '../data/courses.json' with { type: 'json' };
import careerPathsData from '../data/career_paths.json' with { type: 'json' };
import faqData from '../data/faq.json' with { type: 'json' };
import admissionsData from '../data/admissions.json' with { type: 'json' };
import placementsData from '../data/placements.json' with { type: 'json' };
import toolsData from '../data/tools.json' with { type: 'json' };

export class KnowledgeService {
  /**
   * Returns all available Nova Skills courses
   */
  static getAllCourses() {
    return coursesData || [];
  }

  /**
   * Gets a specific course by ID
   */
  static getCourseById(id) {
    if (!id) return null;
    return coursesData.find(c => c.id === id || c.slug === id) || null;
  }

  /**
   * Searches courses based on query keyword matching
   */
  static searchCourses(query) {
    if (!query || typeof query !== 'string') return coursesData;
    const q = query.toLowerCase().trim();

    return coursesData.filter(c => {
      return (
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.skills.some(s => s.toLowerCase().includes(q)) ||
        c.software.some(sw => sw.toLowerCase().includes(q))
      );
    });
  }

  /**
   * Returns all FAQ objects
   */
  static getAllFaqs() {
    return faqData || [];
  }

  /**
   * Finds matching FAQ answer for a query topic
   */
  static getFaqAnswer(topic) {
    if (!topic || typeof topic !== 'string') return null;
    const t = topic.toLowerCase();

    return faqData.find(f => {
      return f.category.toLowerCase().includes(t) || 
             f.question.toLowerCase().includes(t) || 
             f.answer.toLowerCase().includes(t);
    }) || null;
  }

  /**
   * Returns structured career path roadmaps
   */
  static getCareerPaths() {
    return careerPathsData || [];
  }

  /**
   * Returns placement stats and hiring partner details
   */
  static getPlacementsInfo() {
    return placementsData || {};
  }

  /**
   * Returns admissions procedure guidelines
   */
  static getAdmissionsInfo() {
    return admissionsData || {};
  }

  /**
   * Returns software tools mapping
   */
  static getToolsInfo() {
    return toolsData || [];
  }
}
