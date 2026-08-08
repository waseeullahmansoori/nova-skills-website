/* ============================================================
   NOVA SKILLS — AI Career Advisor Assessment Engine (2026)
   Modular Architecture:
   - AssessmentContainer (Wizard state)
   - RecommendationEngine (Rules & scoring)
   - AnimationEngine (SVG rings, count-up, status bar)
   - CareerSnapshot (Dashboard renderer)
   ============================================================ */

'use strict';

class RecommendationEngine {
  static evaluate(answers) {
    // answers: { q1 (goal), q2 (domain), q3 (level), q4 (time), q5 (mode) }
    const domainMap = {
      'digital-marketing': 'digital-marketing',
      'ai': 'ai',
      'design': 'design',
      'programming': 'programming',
      'video': 'video',
      'nocode': 'nocode'
    };

    const academyId = domainMap[answers.q2] || 'digital-marketing';
    const matchedCourses = NS_COURSES.filter(c => c.academyId === academyId);
    const recommendedCourse = matchedCourses.find(c => c.featured) || matchedCourses[0] || NS_COURSES[0];

    // Calculate realistic confidence score (92% - 98%)
    let baseScore = 92;
    if (answers.q3 === 'Beginner') baseScore += 3;
    if (answers.q4 === '10-20' || answers.q4 === 'fulltime') baseScore += 2;
    if (answers.q5 === 'Hybrid' || answers.q5 === 'Online') baseScore += 1;
    const finalScore = Math.min(baseScore, 98);

    let verdict = '★ Excellent Match';
    if (finalScore >= 96) verdict = '★ Excellent Match (Highest Confidence)';
    else if (finalScore >= 94) verdict = '★ Strong Recommendation';

    return {
      course: recommendedCourse,
      score: finalScore,
      verdict: verdict,
      summary: {
        goal: this.getGoalLabel(answers.q1),
        domain: recommendedCourse.academy,
        level: answers.q3,
        time: this.getTimeLabel(answers.q4),
        mode: answers.q5
      }
    };
  }

  static getGoalLabel(val) {
    const map = {
      'job': 'Land Corporate Job',
      'switch': 'Career Switch to Tech',
      'freelance': 'Freelancing & Remote Work',
      'business': 'Grow Business / Agency'
    };
    return map[val] || 'Career Acceleration';
  }

  static getTimeLabel(val) {
    const map = {
      '5-10': '5–10 Hours / Wk',
      '10-20': '10–20 Hours / Wk',
      'fulltime': 'Full-Time Intensive'
    };
    return map[val] || '10 Hours / Wk';
  }
}

class AssessmentContainer {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 5;
    this.answers = { q1: 'job', q2: 'digital-marketing', q3: 'Beginner', q4: '5-10', q5: 'Hybrid' };
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateUI();
  }

  bindEvents() {
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');

    nextBtn?.addEventListener('click', () => this.handleNext());
    prevBtn?.addEventListener('click', () => this.handlePrev());

    // Option cards selection
    document.querySelectorAll('.option-card input').forEach(inp => {
      inp.addEventListener('change', (e) => {
        this.answers[e.target.name] = e.target.value;
      });
    });
  }

  handleNext() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.updateUI();
    } else {
      this.finishAssessment();
    }
  }

  handlePrev() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateUI();
    }
  }

  updateUI() {
    // Stepper header
    const stepBadge = document.getElementById('wizard-step-badge');
    const stepTitle = document.getElementById('wizard-step-title');
    const progressBar = document.getElementById('wizard-progress-bar');

    const titles = ['Career Goal', 'Domain Interest', 'Experience Level', 'Time Commitment', 'Preferred Mode'];

    if (stepBadge) stepBadge.textContent = `STEP ${this.currentStep} OF ${this.totalSteps}`;
    if (stepTitle) stepTitle.textContent = titles[this.currentStep - 1];
    if (progressBar) progressBar.style.width = `${(this.currentStep / this.totalSteps) * 100}%`;

    // Question cards visibility
    document.querySelectorAll('.question-card').forEach(card => {
      const qNum = parseInt(card.dataset.question, 10);
      if (qNum === this.currentStep) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) prevBtn.disabled = this.currentStep === 1;
    if (nextBtn) {
      nextBtn.textContent = this.currentStep === this.totalSteps ? 'Generate AI Career Roadmap ✨' : 'Next Question →';
    }
  }

  finishAssessment() {
    const wizardHeader = document.getElementById('wizard-header');
    const wizardBody = document.getElementById('wizard-body');
    const wizardFooter = document.getElementById('wizard-footer');
    const resultsContainer = document.getElementById('results-container');

    if (wizardHeader) wizardHeader.style.display = 'none';
    if (wizardBody) wizardBody.style.display = 'none';
    if (wizardFooter) wizardFooter.style.display = 'none';

    if (resultsContainer) resultsContainer.removeAttribute('hidden');

    const recommendation = RecommendationEngine.evaluate(this.answers);
    this.runCompletionAnimation(recommendation);
  }

  runCompletionAnimation(rec) {
    const loadingStage = document.getElementById('loading-stage');
    const loadingRingBar = document.getElementById('loading-ring-bar');
    const loadingPctText = document.getElementById('loading-pct-text');
    const successHeader = document.getElementById('success-header');
    const careerDashboard = document.getElementById('career-dashboard');

    // Step 1: SVG Loading Ring Animation (0% to 100% in 900ms)
    const startTime = performance.now();
    const duration = 950;
    const circum = 326.72; // 2 * PI * 52

    function animateRing(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out

      const offset = circum * (1 - ease);
      if (loadingRingBar) loadingRingBar.style.strokeDashoffset = offset;
      if (loadingPctText) loadingPctText.textContent = `${Math.floor(ease * 100)}%`;

      // Status bar sequential pills
      if (progress > 0.25) document.getElementById('status-step-1')?.classList.add('done');
      if (progress > 0.50) document.getElementById('status-step-2')?.classList.add('done');
      if (progress > 0.75) document.getElementById('status-step-3')?.classList.add('done');
      if (progress >= 1.0) document.getElementById('status-step-4')?.classList.add('done');

      if (progress < 1) {
        requestAnimationFrame(animateRing);
      } else {
        // Step 2 & 3: Transition to Checkmark & Header after 300ms pause
        setTimeout(() => {
          if (loadingStage) loadingStage.style.display = 'none';
          if (successHeader) successHeader.removeAttribute('hidden');
          if (careerDashboard) careerDashboard.removeAttribute('hidden');

          // Render Dashboard & Animate Score Gauge
          CareerSnapshot.render(rec);
        }, 350);
      }
    }

    requestAnimationFrame(animateRing);
  }
}

class CareerSnapshot {
  static render(rec) {
    // Summary pills
    document.getElementById('summary-goal').textContent = rec.summary.goal;
    document.getElementById('summary-domain').textContent = rec.summary.domain;
    document.getElementById('summary-level').textContent = rec.summary.level;
    document.getElementById('summary-time').textContent = rec.summary.time;

    // Render Course Spotlight Card
    const spotlight = document.getElementById('recommended-course-card');
    if (spotlight) {
      const c = rec.course;
      spotlight.innerHTML = `
        <div class="spotlight-header">
          <span class="spotlight-tag">⭐ TOP AI RECOMMENDATION</span>
          <div class="spotlight-academy">${c.icon} ${c.academy}</div>
        </div>
        <h3 class="spotlight-title"><a href="/course-detail.html?id=${c.id}">${c.name}</a></h3>
        <p class="spotlight-desc">${c.shortDesc}</p>

        <div class="spotlight-features">
          <span>⏱️ ${c.duration}</span>
          <span>💻 ${c.liveProjects} Live Projects</span>
          <span>📜 ISO Certified</span>
          ${c.placementSupport ? '<span style="color:var(--green-light); font-weight:700;">🎯 Placement Support</span>' : ''}
        </div>

        <div class="spotlight-tools">
          <span style="font-size:0.8125rem; font-weight:600; color:rgba(255,255,255,0.7);">Tools:</span>
          ${c.tools.slice(0, 4).map(t => `<span class="spot-tool-pill">${t}</span>`).join('')}
        </div>

        <div class="spotlight-footer">
          <div class="spotlight-price">
            <span class="spot-current">₹${c.price.toLocaleString('en-IN')}</span>
            <span class="spot-orig">₹${c.originalPrice.toLocaleString('en-IN')}</span>
          </div>
          <div style="display:flex; gap:8px;">
            <a href="/course-detail.html?id=${c.id}" class="btn btn-outline btn-sm">Full Syllabus</a>
            <button onclick="openConsultationPopup()" class="btn btn-primary btn-sm">Enroll Now →</button>
          </div>
        </div>
      `;
    }

    // Animate Score Gauge & Counter
    this.animateScoreGauge(rec.score, rec.verdict);
  }

  static animateScoreGauge(targetScore, verdict) {
    const scoreBar = document.getElementById('score-ring-bar');
    const scoreText = document.getElementById('score-num-text');
    const verdictText = document.getElementById('match-verdict-text');

    if (verdictText) verdictText.textContent = verdict;

    const circum = 364.42; // 2 * PI * 58
    const startTime = performance.now();
    const duration = 1200;

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      const currentScore = Math.floor(targetScore * ease);
      const offset = circum * (1 - (targetScore * ease / 100));

      if (scoreBar) scoreBar.style.strokeDashoffset = offset;
      if (scoreText) scoreText.textContent = currentScore;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('assessment-container')) {
    new AssessmentContainer();
  }
});
