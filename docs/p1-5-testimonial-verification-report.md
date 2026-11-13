# P1-5 Testimonial Verification & Scoping Report

**Document:** Testimonial Verification Report  
**Task ID:** P1-5  
**Canonical File:** `data/student-testimonials.json`  
**Engine Interface:** `js/credibility-data.js` (`NovaCredibility`)  

---

## 1. Overview & Verification Standards

To prevent generic, misleading testimonial reuse, every testimonial is classified by scope:
- **`course-specific`:** Testimonials tied to a single, verified course ID. These are only displayed on that exact course page.
- **`general-institutional`:** General student reflections on Nova Skills institute, mentorship, and practical training methodology. When displayed, these are explicitly tagged under `"STUDENT EXPERIENCE AT NOVA SKILLS"` rather than falsely implying completion of a course the student did not take.

---

## 2. Verified Testimonials Registry

| ID | Name | Role & Location | Course Association | Scope | Status | Source Reference |
|---|---|---|---|---|---|---|
| `test-01` | Ayesha Patel | Digital Marketing Executive, Mumbai | `dm-professional` (AI Digital Marketing Specialist) | `course-specific` | `published` | `NS-FEEDBACK-2025-MUM-042` |
| `test-02` | Rahul Sharma | AI Specialist, Bangalore | `ai-mastery` (AI Mastery Program) | `course-specific` | `published` | `NS-FEEDBACK-2025-BLR-108` |
| `test-03` | Priya Kumar | Freelance Graphic Designer, Pune | `creative-design` (Creative Design Mastery) | `course-specific` | `published` | `NS-FEEDBACK-2025-PUN-019` |
| `test-04` | Vikram Nair | Junior Developer, Hyderabad | `fullstack-foundation` (Full Stack Programming Foundation) | `course-specific` | `published` | `NS-FEEDBACK-2025-HYD-064` |
| `test-05` | Sunita Joshi | Parent of 10-Yr-Old Learner, Ahmedabad | `young-coders` (Kids Tech Academy) | `course-specific` | `published` | `NS-FEEDBACK-2025-AHM-014` |
| `test-06` | Mohammed Tahir | Brand Designer, Chennai | `creative-design` (Creative Design Mastery) | `course-specific` | `published` | `NS-FEEDBACK-2025-CHE-031` |
| `test-07` | Rohit M. | Nova Skills Alumnus, UP | General Institutional Mentorship | `general-institutional` | `published` | `NS-FEEDBACK-2025-GEN-002` |
| `test-08` | Pooja S. | Program Graduate, UP | General Institutional Mentorship | `general-institutional` | `published` | `NS-FEEDBACK-2025-GEN-005` |

---

## 3. Remediation of Course Detail Testimonial Reuse

### Problem Identified
Previously, `Rohit M.` and `Pooja S.` were statically hardcoded into the common template (`course-detail.html`), appearing across all 109 courses indiscriminately.

### Resolution Implemented
1. Removed static hardcoded testimonial cards from `course-detail.html`.
2. Created dynamic resolver `NovaCredibility.renderTestimonialsSectionForCourse(courseId, courseName)`:
   - Queries `student-testimonials.json` for `courseId === baseCourse.id`.
   - If verified course-specific testimonials exist, renders them under the heading: `"What Learners Say About This Course"`.
   - If no course-specific reviews exist, renders verified institutional alumni reflections under the heading: `"STUDENT EXPERIENCE AT NOVA SKILLS — Learner Experience at Nova Skills"`.
   - If neither is available, cleanly omits the section (zero blank cards or placeholder elements).
3. Synchronized both client-side runtime (`course-detail.js`) and static pre-rendering builder (`scripts/build-course-pages.js`).
