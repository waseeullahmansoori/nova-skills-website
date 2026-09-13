# Nova Skills — Final 109-Course Architecture & Dependency Map
**Website Target**: [https://novaskills.in/](https://novaskills.in/)
**Catalogue Size**: 109 Courses across 12 Academies
**Architecture Level**: STEP 3 FINAL STRATEGIC BLUEPRINT
**Status**: COMPLETED — Architectural Classification & Dependency Modeling (Zero Live Data Changes)

---

## 1. Executive Summary
This strategic document finalizes the transformation of Nova Skills' 109 courses from an uncoordinated collection of fragmented software tutorials into an **integrated, tiered, and coherent educational ecosystem**.

### The 8 Architectural Archetypes Distribution
Every course in the catalogue has been classified into exactly one primary architectural type:
| Primary Type | Count | Percentage | Core Characteristics |
| :--- | :---: | :---: | :--- |
| **MASTER / FLAGSHIP** | **12** | 11.0% | End-to-end 6-month career programs covering full professional workflows with placement support. |
| **PROFESSIONAL STANDALONE** | **13** | 11.9% | 2 to 4-month complete skill tracks possessing strong independent employment value. |
| **SPECIALIZATION** | **28** | 25.7% | High-value, advanced technical or creative disciplines requiring prior foundational mastery. |
| **MODULE** | **15** | 13.8% | Meaningful skills that should live inside broader parent programs rather than standalone sales. |
| **MICRO / CERTIFICATION** | **27** | 24.8% | Focused, short-duration (1-2 month) software or execution certifications. |
| **REPOSITION** | **6** | 5.5% | Courses where the underlying skill is preserved but the positioning is elevated to strategic value. |
| **MERGE CANDIDATE** | **6** | 5.5% | Courses with near 100% curriculum overlap that should eventually be consolidated. |
| **RETIRE CANDIDATE** | **2** | 1.8% | Commoditized standalone offerings (e.g. standalone MS Word/PowerPoint) that have zero standalone paid demand. |
| **TOTAL** | **109** | **100.0%** | **Rigorous 100% catalogue coverage** |

---

## 2. Current vs. Recommended Catalogue Architecture
| Metric | Current State (Step 1 Baseline) | Recommended Architecture (Step 3 Blueprint) |
| :--- | :--- | :--- |
| **Catalogue Structure** | Flat catalogue of 109 courses with identical page templates | Clear 4-tier hierarchy: Master ➔ Professional ➔ Specialization ➔ Micro |
| **Program Overlap** | High cross-course cannibalization across 10 major clusters | Overlaps resolved into structured Parent ➔ Child sub-tracks |
| **Prerequisite Clarity**| 100% missing (`prerequisites: null`; generic static FAQ) | Strict, formalized prerequisite and recommended-next sequences |
| **Curriculum Depth** | Generic identical placeholder lessons across all courses | Explicit project depth (Exercise, Practical, Portfolio, Capstone) |
| **AI Integration** | Siloed single-vendor tools (ChatGPT vs Claude vs Gemini) | Multi-LLM intelligence & Agentic workflows integrated into domain tracks |
| **Commercial Cannibalization**| Standalone ₹4,999 tools cannibalizing ₹31,499 career programs | Clear upsell & cross-sell pathways protecting flagship value |

---

## 3. Master / Flagship Programs (The 12 Career Pillars)
Nova Skills maintains exactly 1 flagship Master Program per academy. These represent the primary revenue drivers and comprehensive career transformation offerings:

### 1. AI Digital Marketing Master (`dm-mastery`)
- **Academy**: Digital Marketing Academy
- **Target Learner**: Career changers, college graduates, and professionals seeking end-to-end industry mastery.
- **Primary Career Outcome**: Digital Marketing Specialist, Growth Lead, Performance Marketer
- **Duration & Depth**: 6 Months | Multiple Projects + Capstone Project
- **Key Modernization Focus**: Flagship Career Program. Modernize into modern Growth Marketing & GEO.
- **Prerequisites**: Basic computer and internet literacy
- **Recommended Next Step**: `perf-marketing-pro`

### 2. AI Mastery Program (`ai-mastery`)
- **Academy**: AI Academy
- **Target Learner**: Career changers, college graduates, and professionals seeking end-to-end industry mastery.
- **Primary Career Outcome**: AI Solutions Engineer, GenAI Architect
- **Duration & Depth**: 6 Months | Multiple Projects + Capstone Project
- **Key Modernization Focus**: Anchor program for AI Solutions Engineering & Agentic systems.
- **Prerequisites**: Basic Python OR strong logic/systems understanding
- **Recommended Next Step**: `ai-agents-fundamentals`

### 3. Creative Design Master (`creative-design`)
- **Academy**: Design Academy
- **Target Learner**: Career changers, college graduates, and professionals seeking end-to-end industry mastery.
- **Primary Career Outcome**: Visual Designer, Art Director, Product Designer
- **Duration & Depth**: 6 Months | Multiple Projects + Capstone Project
- **Key Modernization Focus**: Reposition toward Brand Strategy, Design Systems & AI Creative Direction.
- **Prerequisites**: Creative aptitude, basic visual taste
- **Recommended Next Step**: `uiux-design-pro`

### 4. Full Stack Programming Foundation (`fullstack-foundation`)
- **Academy**: Programming Academy
- **Target Learner**: Career changers, college graduates, and professionals seeking end-to-end industry mastery.
- **Primary Career Outcome**: Full Stack Software Engineer, Web App Developer
- **Duration & Depth**: 6 Months | Multiple Projects + Capstone Project
- **Key Modernization Focus**: Modernize to Next.js App Router, TypeScript, Supabase, Cursor AI.
- **Prerequisites**: High logical aptitude, basic computer literacy
- **Recommended Next Step**: `ai-web-dev-pro`

### 5. E-Commerce Website Mastery (`ecommerce-mastery`)
- **Academy**: No-Code Web Academy
- **Target Learner**: Career changers, college graduates, and professionals seeking end-to-end industry mastery.
- **Primary Career Outcome**: Shopify Store Builder, E-Commerce Consultant
- **Duration & Depth**: 6 Months | Multiple Projects + Capstone Project
- **Key Modernization Focus**: Flagship e-commerce career and agency pathway.
- **Prerequisites**: Basic computer literacy
- **Recommended Next Step**: `agency-building`

### 6. Motion Graphics Master (`motion-mastery`)
- **Academy**: Video & Motion Academy
- **Target Learner**: Career changers, college graduates, and professionals seeking end-to-end industry mastery.
- **Primary Career Outcome**: Motion Designer, Senior Video Editor, Creative Animator
- **Duration & Depth**: 6 Months | Multiple Projects + Capstone Project
- **Key Modernization Focus**: Flagship creative video career track.
- **Prerequisites**: Basic visual editing familiarity
- **Recommended Next Step**: `freelance-agency-master`

### 7. Architectural Visualisation Master (`archviz-mastery`)
- **Academy**: 3D Academy
- **Target Learner**: Career changers, college graduates, and professionals seeking end-to-end industry mastery.
- **Primary Career Outcome**: Lead 3D Architectural Visualizer, ArchViz Director
- **Duration & Depth**: 6 Months | Multiple Projects + Capstone Project
- **Key Modernization Focus**: Upgrade to real-time Unreal Engine 5 Lumen/Nanite rendering.
- **Prerequisites**: Spatial sense, CAD reading or 3D aptitude
- **Recommended Next Step**: `freelance-agency-master`

### 8. Freelancing Mastery (`freelancing-mastery`)
- **Academy**: Career & Freelancing Academy
- **Target Learner**: Career changers, college graduates, and professionals seeking end-to-end industry mastery.
- **Primary Career Outcome**: Independent Global Consultant, High-Ticket Freelancer
- **Duration & Depth**: 6 Months | Multiple Projects + Capstone Project
- **Key Modernization Focus**: Universal career acceleration flagship.
- **Prerequisites**: Any hard professional skill (Marketing, Coding, Design, Video)
- **Recommended Next Step**: `agency-building`

### 9. Business English & Personality Development (`business-english`)
- **Academy**: Communication Academy
- **Target Learner**: Career changers, college graduates, and professionals seeking end-to-end industry mastery.
- **Primary Career Outcome**: Corporate Executive, Global Business Professional
- **Duration & Depth**: 6 Months | Multiple Projects + Capstone Project
- **Key Modernization Focus**: Upgrade to Global Corporate Influence & Executive Storytelling.
- **Prerequisites**: Basic conversational English
- **Recommended Next Step**: `public-speaking`

### 10. Future Tech Kids Mastery (`kids-mastery`)
- **Academy**: Kids Tech Academy
- **Target Learner**: Career changers, college graduates, and professionals seeking end-to-end industry mastery.
- **Primary Career Outcome**: Young STEAM Innovator, Future Engineer
- **Duration & Depth**: 6 Months | Multiple Projects + Capstone Project
- **Key Modernization Focus**: Flagship STEAM program for youth.
- **Prerequisites**: Age 8-16, curiosity
- **Recommended Next Step**: `None`

### 11. YouTube Growth Mastery (`youtube-mastery`)
- **Academy**: Creator Academy
- **Target Learner**: Career changers, college graduates, and professionals seeking end-to-end industry mastery.
- **Primary Career Outcome**: Full-Time YouTuber, Creator-Entrepreneur, Media Channel Lead
- **Duration & Depth**: 6 Months | Multiple Projects + Capstone Project
- **Key Modernization Focus**: Flagship digital creator business track.
- **Prerequisites**: Interest in video creation and digital media
- **Recommended Next Step**: `agency-building`

### 12. Business Productivity Mastery (`biz-productivity`)
- **Academy**: Office Productivity Academy
- **Target Learner**: Career changers, college graduates, and professionals seeking end-to-end industry mastery.
- **Primary Career Outcome**: Business Operations Manager, Executive MIS Lead
- **Duration & Depth**: 6 Months | Multiple Projects + Capstone Project
- **Key Modernization Focus**: Upgrade to Business Analytics, Power BI & Microsoft 365 Copilot.
- **Prerequisites**: Basic office computer skills
- **Recommended Next Step**: `None`

---

## 4. Professional Standalone Courses (13 Courses)
Complete programs with substantial standalone market value, designed for learners who need a focused job-oriented qualification without enrolling in a 6-month master track:

1. **AI Digital Marketing Professional** (`dm-professional` — *Digital Marketing Academy*): 3-4 Months | Portfolio Project Depth | Roles: *Digital Marketing Executive, SEO/PPC Specialist*.
2. **AI Productivity Professional** (`ai-productivity` — *AI Academy*): 2-3 Months | Portfolio Project Depth | Roles: *AI-Augmented Professional, Knowledge Worker*.
3. **Graphic Design Professional** (`graphic-design-pro` — *Design Academy*): 3 Months | Portfolio Project Depth | Roles: *Graphic Designer, Brand Designer*.
4. **Python Developer Professional** (`python-developer` — *Programming Academy*): 3 Months | Portfolio Project Depth | Roles: *Python Developer, Backend Associate, Automation Engineer*.
5. **No-Code Website Professional** (`nocode-web-pro` — *No-Code Web Academy*): 3 Months | Portfolio Project Depth | Roles: *No-Code Web Developer, Agency Web Builder*.
6. **Professional Video Editing** (`video-pro` — *Video & Motion Academy*): 3 Months | Portfolio Project Depth | Roles: *Professional Video Editor, Commercial Editor*.
7. **3D Visualisation Professional** (`3d-viz-pro` — *3D Academy*): 3 Months | Portfolio Project Depth | Roles: *3D Artist, Architectural Modeler*.
8. **Career Launch Program** (`career-launch` — *Career & Freelancing Academy*): 2-3 Months | Portfolio Project Depth | Roles: *Job-Ready Graduate*.
9. **Professional Spoken English** (`spoken-english-pro` — *Communication Academy*): 3 Months | Portfolio Project Depth | Roles: *Fluent Corporate Communicator*.
10. **Young Coders Program** (`young-coders` — *Kids Tech Academy*): 3 Months | Portfolio Project Depth | Roles: *Junior Coder*.
11. **Content Creator Professional** (`content-creator-pro` — *Creator Academy*): 3 Months | Portfolio Project Depth | Roles: *Digital Content Creator, Social Media Videographer*.
12. **Office Productivity Professional** (`office-pro` — *Office Productivity Academy*): 2-3 Months | Portfolio Project Depth | Roles: *Office Administrator, Executive Assistant*.

---

## 5. High-Value Specializations (28 Courses)
Advanced programs built upon foundational competencies that command premium agency and employment compensation:

1. **Performance Marketing Professional** (`perf-marketing-pro` — *Digital Marketing Academy*): Parent: `dm-mastery` | Prereq: *dm-professional OR google-ads + meta-ads* | Target Role: *Performance Marketing Specialist, Media Buyer, Growth Hacker*.
2. **SEO & GEO** (`seo-geo` — *Digital Marketing Academy*): Parent: `dm-mastery` | Prereq: *Basic website and content concepts* | Target Role: *SEO Specialist, GEO Strategist, Organic Growth Lead*.
3. **AI for Business Professional** (`ai-for-business-pro` — *AI Academy*): Parent: `ai-mastery` | Prereq: *ai-productivity OR general business management* | Target Role: *AI Business Analyst, Digital Transformation Consultant*.
4. **AI Automation with n8n** (`ai-automation-n8n` — *AI Academy*): Parent: `ai-mastery` | Prereq: *prompt-engineering OR basic workflow logic* | Target Role: *AI Automation Specialist, n8n Workflow Consultant*.
5. **AI Agents Fundamentals** (`ai-agents-fundamentals` — *AI Academy*): Parent: `ai-mastery` | Prereq: *ai-automation-n8n OR basic Python* | Target Role: *AI Agent Engineer, Autonomous Systems Developer*.
6. **UI/UX Design Professional** (`uiux-design-pro` — *Design Academy*): Parent: `creative-design` | Prereq: *Basic design principles OR figma-ui-design* | Target Role: *UI/UX Designer, Product Designer, Interaction Designer*.
7. **Brand Identity Design** (`brand-identity-design` — *Design Academy*): Parent: `graphic-design-pro` | Prereq: *adobe-illustrator OR graphic-design-pro* | Target Role: *Brand Identity Designer, Brand Strategist*.
8. **Packaging Design** (`packaging-design` — *Design Academy*): Parent: `graphic-design-pro` | Prereq: *adobe-illustrator + adobe-photoshop* | Target Role: *Packaging Designer, Print Production Specialist*.
9. **AI Web Development Professional** (`ai-web-dev-pro` — *Programming Academy*): Parent: `fullstack-foundation` | Prereq: *fullstack-foundation OR react-cert* | Target Role: *AI Web Developer, Full Stack AI Specialist*.
10. **Webflow** (`webflow-cert` — *No-Code Web Academy*): Parent: `nocode-web-pro` | Prereq: *Basic box model understanding* | Target Role: *Certified Webflow Developer*.
11. **Framer** (`framer-cert` — *No-Code Web Academy*): Parent: `nocode-web-pro` | Prereq: *Basic Figma or design knowledge* | Target Role: *Framer Motion Designer, Startup Landing Page Specialist*.
12. **AI Video Editing Professional** (`ai-video-pro` — *Video & Motion Academy*): Parent: `video-pro` | Prereq: *video-pro OR adobe-premiere-pro* | Target Role: *AI Video Specialist, Generative Video Creator*.
13. **After Effects** (`after-effects` — *Video & Motion Academy*): Parent: `motion-mastery` | Prereq: *Basic Photoshop or video editing experience* | Target Role: *2D Motion Graphics Artist, VFX Compositor*.
14. **DaVinci Resolve** (`davinci-resolve` — *Video & Motion Academy*): Parent: `video-pro` | Prereq: *Basic video editing principles* | Target Role: *Colorist, DaVinci Editor*.
15. **V-Ray** (`v-ray-cert` — *3D Academy*): Parent: `3ds-max-cert` | Prereq: *3ds-max-cert* | Target Role: *Lighting & Rendering Artist*.
16. **Twinmotion** (`twinmotion-cert` — *3D Academy*): Parent: `archviz-mastery` | Prereq: *3ds-max-cert OR blender-cert* | Target Role: *Real-Time Visualization Artist*.
17. **Unreal Engine Basics** (`unreal-engine-basics` — *3D Academy*): Parent: `archviz-mastery` | Prereq: *3ds-max-cert OR blender-cert* | Target Role: *Unreal Engine ArchViz Specialist, Real-Time Environment Artist*.
18. **Agency Building** (`agency-building` — *Career & Freelancing Academy*): Parent: `freelancing-mastery` | Prereq: *freelancing-mastery OR steady client revenue* | Target Role: *Agency Founder, Managing Director*.
19. **Public Speaking** (`public-speaking` — *Communication Academy*): Parent: `business-english` | Prereq: *presentation-skills* | Target Role: *Keynote Speaker, Conference Presenter, Executive Spokesperson*.
20. **Python for Kids** (`python-for-kids` — *Kids Tech Academy*): Parent: `kids-mastery` | Prereq: *scratch-programming OR age 11+* | Target Role: *Junior Python Programmer*.
21. **AI for Kids** (`ai-for-kids` — *Kids Tech Academy*): Parent: `kids-mastery` | Prereq: *scratch-programming OR age 10+* | Target Role: *Young AI Explorer*.
22. **YouTube SEO** (`youtube-seo` — *Creator Academy*): Parent: `youtube-mastery` | Prereq: *None* | Target Role: *YouTube Channel Manager, Video SEO Specialist*.
23. **Short Video Strategy** (`short-video-strategy` — *Creator Academy*): Parent: `content-creator-pro` | Prereq: *reels-editing OR basic smartphone shooting* | Target Role: *Short-Form Content Strategist, Viral Growth Consultant*.
24. **Notion** (`notion-cert` — *Office Productivity Academy*): Parent: `biz-productivity` | Prereq: *None* | Target Role: *Certified Notion Consultant, Workspace Architect*.
25. **Microsoft Copilot** (`microsoft-copilot` — *Office Productivity Academy*): Parent: `biz-productivity` | Prereq: *Basic Excel/Word proficiency* | Target Role: *Enterprise AI Productivity Specialist*.

---

## 6. Embedded Modules (15 Courses)
Skills that do not possess sufficient commercial weight as standalone paid courses, but are essential components within parent programs:

1. **Google Search Console** (`google-search-console`): Recommended Parent: `seo-geo` | Reason: *Convert to embedded module inside SEO & GEO.*.
2. **Local SEO** (`local-seo`): Recommended Parent: `seo-geo` | Reason: *Convert to specialized module inside SEO & GEO.*.
3. **AI Research Tools** (`ai-research-tools`): Recommended Parent: `ai-productivity` | Reason: *Embed as module in AI Productivity.*.
4. **Logo Design** (`logo-design`): Recommended Parent: `brand-identity-design` | Reason: *Integrate into Brand Identity Design.*.
5. **HTML & CSS** (`html-css`): Recommended Parent: `fullstack-foundation` | Reason: *Convert to foundational module inside Full Stack & Frontend.*.
6. **Git & GitHub** (`git-github`): Recommended Parent: `fullstack-foundation` | Reason: *Universal developer tool; embed as shared module in all programming tracks.*.
7. **REST APIs** (`rest-apis`): Recommended Parent: `node-js` | Reason: *Integrate into Node.js and Full Stack foundations.*.
8. **Resume Building** (`resume-building`): Recommended Parent: `career-launch` | Reason: *Embed as mandatory outcome module in all career programs.*.
9. **Interview Preparation** (`interview-preparation`): Recommended Parent: `career-launch` | Reason: *Embed as mandatory capstone module in all career programs.*.
10. **Client Communication** (`client-communication`): Recommended Parent: `freelancing-mastery` | Reason: *Embed inside Freelancing and Communication academies.*.
11. **Proposal Writing** (`proposal-writing`): Recommended Parent: `freelancing-mastery` | Reason: *Embed as core module inside Freelancing Mastery.*.
12. **Soft Skills** (`soft-skills`): Recommended Parent: `business-english` | Reason: *Convert to universal career readiness module.*.
13. **Web Design for Kids** (`web-design-for-kids`): Recommended Parent: `young-coders` | Reason: *Convert to module in Young Coders.*.
14. **Thumbnail Design** (`thumbnail-design`): Recommended Parent: `youtube-mastery` | Reason: *Embed as high-impact module in YouTube Mastery.*.

---

## 7. Micro / Certification Courses (27 Courses)
Focused 1-2 month tool-specific or single-topic credentials that serve as entry points, tactical upskilling certifications, or elective add-ons:

- **Google Ads** (`google-ads` — *Digital Marketing Academy*): 1-2 Months | Practical Project | Prereq: *None*.
- **Meta Ads (Facebook & Instagram)** (`meta-ads` — *Digital Marketing Academy*): 1-2 Months | Practical Project | Prereq: *None*.
- **Social Media Marketing** (`social-media-marketing` — *Digital Marketing Academy*): 1 Month | Practical Project | Prereq: *None*.
- **Email Marketing** (`email-marketing` — *Digital Marketing Academy*): 1 Month | Practical Project | Prereq: *Basic marketing funnel understanding*.
- **Google Analytics (GA4)** (`google-analytics-ga4` — *Digital Marketing Academy*): 1 Month | Practical Project | Prereq: *Basic marketing knowledge*.
- **Adobe Photoshop** (`adobe-photoshop` — *Design Academy*): 1 Month | Practical Project | Prereq: *None*.
- **Adobe Illustrator** (`adobe-illustrator` — *Design Academy*): 1 Month | Practical Project | Prereq: *None*.
- **Figma UI Design** (`figma-ui-design` — *Design Academy*): 2 Months | Practical Project | Prereq: *None*.
- **JavaScript** (`javascript-cert` — *Programming Academy*): 1 Month | Practical Project | Prereq: *html-css*.
- **React** (`react-cert` — *Programming Academy*): 1-2 Months | Practical Project | Prereq: *javascript-cert*.
- **Node.js** (`node-js` — *Programming Academy*): 1-2 Months | Practical Project | Prereq: *javascript-cert*.
- **SQL Basics** (`sql-basics` — *Programming Academy*): 3-4 Weeks | Practical Project | Prereq: *None*.
- **Shopify** (`shopify-cert` — *No-Code Web Academy*): 1 Month | Practical Project | Prereq: *None*.
- **Adobe Premiere Pro** (`adobe-premiere-pro` — *Video & Motion Academy*): 1 Month | Practical Project | Prereq: *None*.
- **Reels Editing** (`reels-editing` — *Video & Motion Academy*): 3-4 Weeks | Practical Project | Prereq: *None*.
- **Blender** (`blender-cert` — *3D Academy*): 1-2 Months | Practical Project | Prereq: *None*.
- **3ds Max** (`3ds-max-cert` — *3D Academy*): 1-2 Months | Practical Project | Prereq: *None*.
- **LinkedIn Optimisation** (`linkedin-optimisation` — *Career & Freelancing Academy*): 2-3 Weeks | Practical Project | Prereq: *None*.
- **Fiverr Success** (`fiverr-success` — *Career & Freelancing Academy*): 3-4 Weeks | Practical Project | Prereq: *Basic gig deliverable (Graphic/Video/Logo)*.
- **Upwork Success** (`upwork-success` — *Career & Freelancing Academy*): 1 Month | Practical Project | Prereq: *Any demonstrable portfolio skill*.
- **Business Communication** (`business-communication` — *Communication Academy*): 1 Month | Practical Project | Prereq: *spoken-english-pro*.
- **Presentation Skills** (`presentation-skills` — *Communication Academy*): 1 Month | Practical Project | Prereq: *None*.
- **Scratch Programming** (`scratch-programming` — *Kids Tech Academy*): 1 Month | Practical Project | Prereq: *Age 7-12*.
- **Robotics Basics** (`robotics-basics` — *Kids Tech Academy*): 1 Month | Practical Project | Prereq: *Age 9-15*.
- **Podcast Production** (`podcast-production` — *Creator Academy*): 1 Month | Practical Project | Prereq: *None*.
- **Google Workspace** (`google-workspace` — *Office Productivity Academy*): 2-3 Weeks | Practical Project | Prereq: *None*.
- **ClickUp** (`clickup-cert` — *Office Productivity Academy*): 2-3 Weeks | Practical Project | Prereq: *None*.

---

## 8. Courses Requiring Strategic Repositioning (6 Courses)
These courses maintain strong underlying skills, but their current titles or positioning undermine perceived value:

1. **Content Marketing** (`content-marketing` — *Digital Marketing Academy*):
   - *Current Weakness*: copywriting, creator academy
   - *Strategic Repositioning*: Reposition from simple blog writing to Inbound Demand Generation & AI Content Strategy.

2. **Prompt Engineering** (`prompt-engineering` — *AI Academy*):
   - *Current Weakness*: chatgpt-mastery, claude-productivity
   - *Strategic Repositioning*: Reposition from basic conversational prompting to Context Engineering, Structured JSON Schemas & System Prompts.

3. **ChatGPT Mastery** (`chatgpt-mastery` — *AI Academy*):
   - *Current Weakness*: gemini-mastery, claude-productivity
   - *Strategic Repositioning*: Reposition into a Unified Multi-LLM Masterclass (ChatGPT + Claude + Gemini).

4. **Canva Professional** (`canva-pro` — *Design Academy*):
   - *Current Weakness*: social-media-marketing
   - *Strategic Repositioning*: Reposition from graphic design course to Rapid Social & Marketing Asset Creation for Non-Designers.

5. **WordPress** (`wordpress-cert` — *No-Code Web Academy*):
   - *Current Weakness*: elementor-cert, woocommerce-cert
   - *Strategic Repositioning*: Reposition from plugin-heavy page building to Modern Full Site Editing (FSE), Speed Optimization & Secure CMS Management.

6. **Cinema 4D** (`cinema-4d-cert` — *3D Academy*):
   - *Current Weakness*: video academy motion graphics
   - *Strategic Repositioning*: Reposition from 3D architectural rendering to 3D Motion Graphics & Product Animation in connection with Video Academy.

7. **Personal Branding** (`personal-branding` — *Creator Academy*):
   - *Current Weakness*: linkedin-optimisation
   - *Strategic Repositioning*: Reposition from generic social sharing to Executive Authority & Personal Branding for Founders/Consultants.

8. **Microsoft Excel** (`microsoft-excel` — *Office Productivity Academy*):
   - *Current Weakness*: biz-productivity
   - *Strategic Repositioning*: Reposition from basic spreadsheet entry to Advanced Financial Modeling, Power Query Automation & Copilot Analytics.

9. **Tally with GST** (`tally-gst` — *Office Productivity Academy*):
   - *Current Weakness*: None
   - *Strategic Repositioning*: Reposition to TallyPrime with Automated GST Filing & Digital Auditing.

---

## 9. Consolidation & Deprecation Recommendations

### A. Merge Candidates (6 Courses — Recommendations Only)
These courses exhibit near 100% curriculum overlap and cause severe catalogue cannibalization:
1. **Digital Marketing Professional** (`digital-marketing-pro`): Merge into `dm-professional` (Direct duplicate of dm-professional with confusing naming collision.).
2. **YouTube Marketing** (`youtube-marketing`): Merge into `youtube-mastery` (Cross-academy cannibalization with Creator Academy YouTube courses.).
3. **Gemini Mastery** (`gemini-mastery`): Merge into `chatgpt-mastery` (Single-vendor tool course with insufficient standalone depth.).
4. **Claude for Productivity** (`claude-productivity`): Merge into `chatgpt-mastery` (Single-vendor tool course with insufficient standalone depth.).
5. **WooCommerce** (`woocommerce-cert`): Merge into `wordpress-cert` (Plugin extension of WordPress. Better taught inside WordPress/E-Commerce.).
6. **Elementor** (`elementor-cert`): Merge into `wordpress-cert` (Single plugin page builder. Declining modern value due to site bloat.).
7. **Motion Graphics Essentials** (`motion-graphics-essentials`): Merge into `after-effects` (Substantially identical to introductory After Effects.).
8. **Spoken English** (`spoken-english-cert`): Merge into `spoken-english-pro` (Confusing duplication with spoken-english-pro.).

### B. Retire Candidates (2 Courses — Recommendations Only)
These courses represent commodity desktop utilities with zero standalone paid market demand in 2026/27:
1. **Microsoft Word** (`microsoft-word`): Zero standalone market value as a separate paid certification in 2026/27.
2. **Microsoft PowerPoint** (`microsoft-powerpoint`): Zero standalone market value as a separate paid certification in 2026/27.

---

## 10. The 12 Comprehensive Learning Pathways
Each academy represents a clear, progressive student journey from open entry to professional monetization:

### Digital Marketing & Growth Path
```text
Digital Marketing Foundations -> AI Digital Marketing Professional -> Specializations (SEO/GEO, Performance Marketing, Retention) -> AI Digital Marketing Master -> Agency / Freelancing
```

### AI & Machine Intelligence Path
```text
Prompt & Context Engineering -> AI Productivity Professional -> Specializations (n8n Automation, Agentic Systems) -> AI Mastery Program
```

### Visual Design & UI/UX Path
```text
Design Principles & Vector Tools -> Graphic Design Professional -> Specializations (Figma UI/UX, Brand Identity, Packaging) -> Creative Design Master
```

### Software Engineering & Web Development Path
```text
Programming Logic (HTML/JS/Python) -> React/Node.js Specializations -> AI Web Development -> Full Stack Programming Foundation
```

### No-Code & Visual Web Architecture Path
```text
Visual Web Foundations -> No-Code Web Professional -> Specializations (Webflow, Framer, Shopify) -> E-Commerce Website Mastery
```

### Video Production & Motion Graphics Path
```text
Storytelling & NLE Assembly -> Professional Video Editing -> Specializations (After Effects, DaVinci Color, AI Video) -> Motion Graphics Master
```

### 3D Design & Architectural Visualization Path
```text
3D Spatial Modeling (3ds Max/Blender) -> 3D Visualisation Professional -> Specializations (V-Ray, Twinmotion, Unreal Engine 5) -> Architectural Visualisation Master
```

### Career Launch & Global Freelancing Path
```text
Hard Domain Skill -> Career Launch / Professional Branding -> Platforms (Upwork/Fiverr) -> Freelancing Mastery -> Agency Scaling
```

### Enterprise Analytics & Digital Workplace Path
```text
Modern Workplace Fundamentals -> Office Productivity Professional -> Specializations (Advanced Excel/Python, Notion, Copilot) -> Business Productivity Mastery
```

### Executive Communication & Leadership Path
```text
Spoken Fluency -> Business Communication -> Specializations (Presentation Skills, Public Speaking) -> Business English & Personality Master
```

### Young Innovators & Kids Tech Path
```text
Scratch Coding Foundations -> Young Coders Program -> Specializations (Python for Kids, AI Explorers, Robotics) -> Future Tech Kids Mastery
```

### Digital Creator & Media Entrepreneurship Path
```text
Creative Storytelling & Smartphone Video -> Content Creator Professional -> Specializations (YouTube SEO, Short-Form Viral Strategy, Podcasts) -> YouTube Growth Mastery
```

---

## 11. Cross-Academy Dependencies & Value Loops
Modern industry roles cross traditional academic silos. The architecture establishes clear value loops between disciplines:

1. **DIGITAL-MARKETING ➔ CREATOR**: Digital marketers require creator-economy video hooks, short-form packaging, and channel growth strategies.
2. **DIGITAL-MARKETING ➔ AI**: Modern performance marketers rely heavily on automated workflows (n8n) and generative creative tools.
3. **PROGRAMMING ➔ AI**: Full-stack software engineers increasingly integrate LLM APIs, vector retrieval, and AI agents into modern applications.
4. **DESIGN ➔ CREATOR**: Creators require professional visual aesthetics, high-converting thumbnail design, and brand identity systems.
5. **NOCODE ➔ DIGITAL-MARKETING**: No-code storefronts (Shopify/Framer) require performance ads, conversion rate optimization (CRO), and tracking pipelines.
6. **VIDEO ➔ CREATOR**: YouTubers and social creators depend on professional pacing, color grading, and dynamic reels editing.
7. **3D ➔ DESIGN**: 3D rendering requires foundational color theory, lighting balance, and visual layout principles.
8. **CAREER ➔ ALL_ACADEMIES**: Every technical and creative skill requires client acquisition, proposal writing, and international payment mechanics to monetize.
9. **COMMUNICATION ➔ ALL_ACADEMIES**: Professional client presentations, stakeholder alignment, and executive interview performance are universally required.

---

## 12. Shared Foundational Modules
To reduce instructional redundancy and ensure unified standards across all 12 academies, five core foundational modules should be developed once and shared across curricula:

### 1. Universal AI Prompting & Context Engineering (`shared-ai-prompting`)
- **Used By**: ai-mastery, dm-mastery, fullstack-foundation, creative-design, biz-productivity
- **Pedagogical Rationale**: Core foundational principles of structuring instructions, system prompts, few-shot examples, and JSON outputs apply across all domains.

### 2. Visual Aesthetics & Design Hierarchy Fundamentals (`shared-design-principles`)
- **Used By**: creative-design, graphic-design-pro, motion-mastery, nocode-web-pro, youtube-mastery
- **Pedagogical Rationale**: Contrast, whitespace, typographic hierarchy, and color harmony are identical whether designing an ad, website, video frame, or thumbnail.

### 3. Measurement, Funnels & GA4 Analytics (`shared-analytics-tracking`)
- **Used By**: dm-mastery, ecommerce-mastery, youtube-mastery, biz-productivity
- **Pedagogical Rationale**: Conversion events, tracking pixels, attribution funnels, and data interpretation represent shared business mechanics.

### 4. Client Acquisition, Proposals & Upwork Fundamentals (`shared-freelance-client-engine`)
- **Used By**: freelancing-mastery, dm-mastery, fullstack-foundation, creative-design, motion-mastery
- **Pedagogical Rationale**: Finding high-ticket clients, pricing projects, contract terms, and client communication do not vary by skill.

### 5. Resume Building, ATS Optimization & Mock Interviews (`shared-career-launch`)
- **Used By**: career-launch, all-career-programs
- **Pedagogical Rationale**: Job hunting, LinkedIn profile setup, and salary negotiation follow identical corporate hiring standards.

---

## 13. Strategic Implementation Order for Curriculum Redesign
When progressing to Step 4 (Curriculum Engineering & Content Modernization), work should proceed in four distinct phases:
1. **Phase 1: Modernize the 12 Flagship Master Programs** (The primary revenue and placement backbone of Nova Skills).
2. **Phase 2: Modernize the 13 Professional Standalone Programs** (The high-converting 3-month mid-tier job tracks).
3. **Phase 3: Formalize the 28 High-Growth Specializations** (The premium high-ticket differentiators).
4. **Phase 4: Reposition the 6 Strategic Programs & Consolidate Merges/Retires** (Catalogue decluttering and UI clarity).

---
*Report generated automatically as part of Step 3 Final 109-Course Classification & Dependency Map. Companion files: `nova-skills-109-final-architecture.csv` and `nova-skills-course-dependency-map.json`.*