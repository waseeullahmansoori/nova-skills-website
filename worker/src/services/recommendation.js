/**
 * Nova Skills AI Career Advisor — Intelligent Recommendation Engine
 * Version: 6.0.0 (Multi-Factor Scoring Model)
 * 
 * Ranks courses from Knowledge Base based on weighted student profile factors:
 * - Career Goal & Keywords (35%)
 * - Interest / Category Match (25%)
 * - Qualification & Eligibility Fit (15%)
 * - Budget Fit (10%)
 * - Learning Mode Fit (10%)
 * - Experience / Difficulty Fit (5%)
 */

import { KnowledgeService } from './knowledge.js';

export class RecommendationService {
  // Configurable Weight Distribution
  static WEIGHTS = {
    GOAL: 35,
    INTEREST: 25,
    QUALIFICATION: 15,
    BUDGET: 10,
    MODE: 10,
    EXPERIENCE: 5
  };

  /**
   * Ranks courses according to student profile match score
   * @param {Object} profile - Student memory profile (goal, qualification, budget, etc.)
   * @param {number} topN - Number of top recommendations to return (default: 3)
   * @returns {Array<Object>} Ranked course recommendations with match explanations
   */
  static rankCourses(profile = {}, topN = 3) {
    const allCourses = KnowledgeService.getAllCourses();
    if (!allCourses || allCourses.length === 0) return [];

    const scoredCourses = allCourses.map(course => {
      let score = 0;
      const matchReasons = [];

      // 1. Goal Match (35%)
      if (profile.careerGoal || profile.query) {
        const goalStr = (profile.careerGoal || profile.query || '').toLowerCase();
        const categoryMatch = course.category.toLowerCase().includes(goalStr);
        const nameMatch = course.name.toLowerCase().includes(goalStr);
        const outcomeMatch = course.career_outcomes.some(o => o.toLowerCase().includes(goalStr));
        const skillMatch = course.skills.some(s => s.toLowerCase().includes(goalStr));

        if (nameMatch || categoryMatch) {
          score += this.WEIGHTS.GOAL;
          matchReasons.push(`Direct match for your goal in ${course.category}`);
        } else if (outcomeMatch || skillMatch) {
          score += Math.round(this.WEIGHTS.GOAL * 0.75);
          matchReasons.push(`Teaches key skills for ${goalStr}`);
        }
      }

      // 2. Interest / Category Match (25%)
      if (profile.interest) {
        const interestStr = profile.interest.toLowerCase();
        if (course.category.toLowerCase().includes(interestStr) || course.name.toLowerCase().includes(interestStr)) {
          score += this.WEIGHTS.INTEREST;
          matchReasons.push(`Aligns with your interest in ${course.category}`);
        }
      }

      // 3. Qualification Fit (15%)
      if (profile.qualification) {
        const qual = profile.qualification.toUpperCase();
        const eligibilityStr = course.eligibility.toUpperCase();

        if (eligibilityStr.includes('ANY GRADUATE') || eligibilityStr.includes(qual) || eligibilityStr.includes('12TH')) {
          score += this.WEIGHTS.QUALIFICATION;
          matchReasons.push(`Suitable for your ${profile.qualification} background`);
        } else {
          score += Math.round(this.WEIGHTS.QUALIFICATION * 0.5);
        }
      }

      // 4. Budget Fit (10%)
      if (profile.budget) {
        const rawBudgetStr = String(profile.budget).replace(/[^0-9]/g, '');
        if (rawBudgetStr) {
          let budgetNum = parseInt(rawBudgetStr, 10);
          if (budgetNum < 100 && String(profile.budget).toLowerCase().includes('k')) {
            budgetNum *= 1000;
          }
          if (budgetNum >= course.fee_numeric) {
            score += this.WEIGHTS.BUDGET;
            matchReasons.push(`Within your budget limit of ${course.fees}`);
          } else if (budgetNum >= course.fee_numeric * 0.7) {
            score += Math.round(this.WEIGHTS.BUDGET * 0.5);
            matchReasons.push(`Eligible for No-Cost EMI options (${course.fees})`);
          }
        }
      }

      // 5. Preferred Mode Fit (10%)
      if (profile.preferredMode) {
        if (course.mode.includes(profile.preferredMode)) {
          score += this.WEIGHTS.MODE;
          matchReasons.push(`Available in your preferred ${profile.preferredMode} format`);
        }
      }

      // 6. Experience / Difficulty Fit (5%)
      if (profile.currentStatus || profile.experience) {
        const statusStr = (profile.currentStatus || profile.experience || '').toLowerCase();
        if (statusStr.includes('fresher') || statusStr.includes('beginner')) {
          if (course.difficulty.includes('Beginner')) {
            score += this.WEIGHTS.EXPERIENCE;
            matchReasons.push('Beginner-friendly curriculum with zero prior coding required');
          }
        } else {
          score += this.WEIGHTS.EXPERIENCE;
        }
      }

      return {
        course,
        score,
        matchReasons: matchReasons.length > 0 ? matchReasons : ['Recommended Nova Skills Career Program']
      };
    });

    // Sort descending by score
    scoredCourses.sort((a, b) => b.score - a.score);

    return scoredCourses.slice(0, topN);
  }
}
