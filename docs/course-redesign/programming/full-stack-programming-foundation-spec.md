# Full Stack Programming Foundation — Authoritative Academic Specification

**Program Title:** Full Stack Programming Foundation  
**Course Identifier:** `fullstack-foundation`  
**Academy:** Programming Academy (`programming`)  
**Credential Awarded:** Professional Certificate in Full Stack Software Development  
**Governing Standard:** ISO 9001:2015 Verified Curriculum Standard | Nova Skills Academic Board  
**Duration:** 6 Months (24 Calendar Weeks)  
**Total Guided Instructional Hours:** 240 Guided Hours (10 Hours / Week)  
**Recommended Independent Coding Practice:** 80–120 Additional Hours (clearly demarcated from guided hours)  
**Working Commercial Tuition Baseline:** INR 29,999 (Statutory 18% GST: INR 5,400; Total Payable: INR 35,399; Flexible No-Cost EMI: INR 5,900 / Month across 6 Months)  
*Note: Subject to final commercial policy review in NOVA-FSP-02.*  
**Target Level:** Beginner to Career Foundation (Structured progression from algorithmic logic and developer tools to TypeScript, React 19, Node.js 24 LTS, PostgreSQL, Prisma, security, and full-stack capstone defense)  
**Authoritative Document Version:** 2.0.0 (October 2026 Production Standard)  

---

## 1. Executive Summary & Program Positioning

### 1.1 Course Positioning & Commercial Value
In the contemporary October 2026 technology landscape, software development has undergone a profound structural transformation. The widespread adoption of AI development assistants (Cursor, GitHub Copilot, Claude Code) has eliminated market demand for low-skill "boilerplate coders" who merely copy-paste syntax or rely on superficial framework tutorials. 

Modern engineering teams, tech startups, digital agencies, and global product firms require **foundational software engineers**: developers who understand core computer science fundamentals, write clean and maintainable code, model relational data with mathematical precision, debug runtime failures from first principles, enforce strict type safety, implement robust web security (OWASP Top 10:2025), and leverage AI tools with disciplined human discernment and code review rigor.

The junior developer hiring market in India and internationally demands five non-negotiable capabilities:
1. **First-Principles Programming Competence:** Mastery of algorithms, control flow, data structures, asynchronous event loops, and DOM mechanics before touching complex meta-frameworks.
2. **Strict Type Safety with TypeScript:** TypeScript is no longer optional in professional web development; it is the universal industry standard across both frontend and backend codebases.
3. **Modern Component & Backend Architecture:** Deep practical proficiency in **React 19** (Server Components, Actions, custom hooks) paired with clean **Node.js 24 LTS** / Express REST API services.
4. **Relational Database Integrity:** True understanding of relational schemas, ACID transactions, SQL joins, normalization, and modern ORMs (**PostgreSQL** and **Prisma ORM**) rather than defaulting blindly to unstructured NoSQL document stores.
5. **Disciplined AI-Assisted Engineering:** The ability to decompose technical requirements, direct AI tools for scaffolding and testing, audit AI-generated code for security flaws and hallucinated APIs, and maintain 100% intellectual ownership of the final codebase.

**Full Stack Programming Foundation** is Nova Skills' flagship 6-month, 240-guided-hour software development immersion. It is meticulously engineered to take complete beginners and logical thinkers from zero programming experience to confident, employable junior full-stack developers equipped with a verifiable proof-of-work portfolio.

```
      MONTH 1                 MONTH 2                 MONTH 3                 MONTH 4                 MONTH 5                 MONTH 6
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ FOUNDATIONS &   │     │ JAVASCRIPT &    │     │ TYPESCRIPT &    │     │ BACKEND APIS &  │     │ SECURITY, TEST  │     │ CAPSTONE DEFENSE│
│ DEV TOOLS       │     │ ASYNC DOM       │     │ REACT 19 UI     │     │ POSTGRESQL DB   │     │ & NEXT.JS INT.  │     │ & PORTFOLIO     │
│ • Module 01:    │     │ • Module 03:    │     │ • Module 04:    │     │ • Module 06:    │     │ • Module 08:    │     │ • Module 10:    │
│   Programming   │     │   JavaScript    │     │   TypeScript &  │     │   Node.js,      │     │   Authentication│     │   Industry      │
│   Fundamentals, │     │   Programming,  │     │   Code Quality  │     │   Express & REST│     │   Security      │     │   Projects,     │
│   Tools & Git   │     │   DOM & Async   │     │   Fundamentals  │     │   APIs (28h)    │     │   & Testing     │     │   Portfolio &   │
│   (16 Hours)    │     │   APIs (36h)    │     │   (18 Hours)    │     │                 │     │   (20 Hours)    │     │   Capstone      │
│                 │ ──> │                 │ ──> │                 │ ──> │ • Module 07:    │ ──> │                 │ ──> │   Defense       │
│ • Module 02:    │     │                 │     │ • Module 05:    │     │   SQL,          │     │ • Module 09:    │     │   (20 Hours)    │
│   HTML5, CSS3,  │     │                 │     │   React         │     │   PostgreSQL &  │     │   Next.js,      │     │                 │
│   Responsive    │     │                 │     │   Frontend      │     │   Prisma ORM    │     │   Full-Stack    │     │                 │
│   Design & A11y │     │                 │     │   Development   │     │   Integration   │     │   Integration & │     │                 │
│   (28 Hours)    │     │                 │     │   (30 Hours)    │     │   (22 Hours)    │     │   Deploy (22h)  │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
             Total Guided Instructional Schedule: Exactly 240 Hours Across 10 Modules (24 Calendar Weeks)
```

---

### 1.2 Academy Architecture & Differentiation Matrix

To preserve complete academic clarity and eliminate confusion across the Nova Skills catalog, the boundaries of `fullstack-foundation` are strictly governed against adjacent programs:

| Feature / Dimension | Full Stack Programming Foundation (`fullstack-foundation`) | Python Developer Professional (`python-developer`) | AI Web Development Professional (`ai-web-dev-pro`) | No-Code Website Professional (`no-code-web`) |
| :--- | :--- | :--- | :--- | :--- |
| **Academy** | **Programming Academy** | Programming Academy | Programming Academy | No-Code Web Academy |
| **Duration & Hours** | **6 Months · 240 Guided Hours** | 3 Months · 120 Guided Hours | 3 Months · 80 Guided Hours | 4 Months · 160 Guided Hours |
| **Primary Domain** | **Comprehensive Web & Software Engineering** | Backend Engineering & Data Automation | AI-Powered Web Applications & LLM UIs | Visual Web Publishing & E-Commerce |
| **Core Languages** | **JavaScript, TypeScript, SQL, HTML/CSS** | Python, SQL | JavaScript/TypeScript, Python basics | Zero-code (Visual abstraction) |
| **Primary Stack** | **React 19, Node.js 24, Express, PostgreSQL, Prisma** | Python, FastAPI / Django, PostgreSQL | Next.js, OpenAI / Anthropic APIs, LangChain | Webflow, Shopify, WordPress, Framer |
| **Database Focus** | **Relational PostgreSQL with Prisma ORM** | PostgreSQL, SQLite, SQLAlchemy | Vector Databases (Pinecone/pgvector), Supabase | Managed CMS Collections |
| **Architecture** | **Full-Stack Client-Server & Monorepo** | Microservices, REST APIs, Automation Scripts | LLM Orchestration, RAG Pipelines, Streaming | Hosted Visual Platforms & No-Code APIs |
| **AI Focus** | **AI as a Developer Productivity Tool** | Python-based AI scripting & data pipelines | Building AI-first user applications | AI visual plugins & auto-layout generation |
| **Target Job Roles** | **Junior Full-Stack Dev, Junior Frontend, Junior Node.js** | Junior Python Dev, Backend Associate | AI Web Dev, Prompt App Integrator | No-Code Specialist, Webflow Designer |

#### Strict Non-Goals & Program Boundaries
To protect pedagogical focus and prevent cognitive overload, Full Stack Programming Foundation enforces strict boundaries:
- **No Machine Learning Model Training:** This course teaches developers how to build robust web software and leverage AI tools for coding—not training PyTorch/TensorFlow deep neural networks.
- **No Complex Kubernetes / Enterprise DevOps:** Students deploy to modern serverless and cloud PaaS environments (Vercel, Render, Neon, Supabase) using basic CI/CD (GitHub Actions)—not managing bare-metal Kubernetes clusters.
- **No Native Mobile App Development:** Focus is 100% on responsive, mobile-first web applications and Progressive Web App (PWA) principles, not Swift/Kotlin native iOS/Android compilation.
- **No Competing Dual-Backend Chaos:** Node.js/Express with TypeScript is taught as the primary backend engine. Python is introduced strictly for scripting fundamentals and exposure, preventing fragmented confusion.
- **No Unsupported Employment Guarantees:** We guarantee rigorous skills training, portfolio defense, and industry preparation—never illegal or deceptive "100% job guarantees."

---

## 2. Forensic Course Audit & Content Migration Analysis

### 2.1 Audit of Existing Codebase State
An exhaustive forensic audit of the repository data stores (`data.js`, `data/courses/fullstack-foundation.json`, and `nova-skills-109-course-content.json`) revealed critical gaps and structural inconsistencies:

1. **Module Count Mismatch (6 Modules vs 10 Modules):**
   - The current JSON data files contain only 6 legacy modules.
   - The summary in `data.js` also contains only 6 high-level entries.
   - To deliver 240 guided hours of legitimate, unhurried education, the curriculum must expand into 10 structured, specialized modules.
2. **Missing Hour Allocations in Detailed JSON:**
   - In `data/courses/fullstack-foundation.json`, all modules list `duration_hours: undefined` and lack lesson-level time breakdowns.
3. **Generic & Repetitive Tool Registry:**
   - Every module in the existing JSON lists the identical placeholder tools: `['HTML', 'CSS', 'JavaScript']`.
   - Modern tooling (TypeScript, React 19, Node.js 24 LTS, PostgreSQL, Prisma ORM, Tailwind CSS, Vitest, Cursor/Copilot) is completely unrepresented at the module level.
4. **Outdated Database Stack (Legacy MERN MongoDB):**
   - The legacy syllabus relied heavily on MongoDB/Mongoose. While NoSQL has valid use cases, industry hiring in 2026 overwhelmingly favors relational SQL (PostgreSQL) and type-safe ORMs (Prisma). Relational data modeling is a fundamental engineering requirement.
5. **Completely Broken/Empty Project Inventory:**
   - In `data/courses/fullstack-foundation.json`, the `what_you_will_build` array consists of empty objects: `[{ title: undefined, tech: undefined }, { title: undefined, tech: undefined }, { title: undefined, tech: undefined }]`.
   - There are zero project briefs, technical specifications, user stories, or rubrics.
6. **Severe Commercial Price Discrepancy & Artificial Discount:**
   - `data.js` lists `price: 29999` anchored against `originalPrice: 84999` (an artificial 65% markdown).
   - In `data/courses/fullstack-foundation.json` and `nova-skills-109-course-content.json`, `price`, `original_price`, and `discount` are `undefined`.
   - Statutory 18% GST and EMI breakdown are uncalculated.
7. **Complete Absence of Generative AI Engineering Practices:**
   - The existing syllabus contains zero instruction on using Cursor, Copilot, or Claude Code safely, conducting git diff reviews, detecting hallucinated APIs, or writing tests before accepting AI code.

---

### 2.2 Content Migration & Categorization Matrix

| Existing Content / Section | Current Baseline State | Decision | Action & Pedagogical Justification |
| :--- | :--- | :--- | :--- |
| **HTML5 & CSS3** | Module 01 (Semantic HTML & CSS Grid) | **EXPAND** | Move to dedicated 28-hour Module 02. Add WCAG 2.2 AA accessibility, Flexbox, CSS variables, mobile-first layouts, and Tailwind CSS. |
| **Developer Tools & Git** | Missing as standalone module | **ADD** | Create dedicated 16-hour Module 01 covering CLI navigation, VS Code configuration, Git version control, GitHub workflows, and problem decomposition. |
| **JavaScript Fundamentals** | Module 02 (ES6+, DOM, Promises) | **EXPAND** | Expand into deep 36-hour Module 03 covering algorithmic thinking, scope, closures, array methods, event loop, DOM manipulation, Fetch API, and error handling. |
| **TypeScript** | Absent from curriculum | **ADD** | Introduce dedicated 18-hour Module 04 before React. Teach static typing, interfaces, generics, union types, and type-safe development practices. |
| **React Fundamentals** | Module 03 (Components, Hooks, Context) | **EXPAND** | Modernize to 30-hour Module 05 focusing on React 19 architecture: JSX, props, state, custom hooks, Server/Client components, actions, and performance. |
| **Backend API Development** | Module 04 (Node.js & Express) | **EXPAND** | Expand into 28-hour Module 06 covering Node.js 24 LTS runtime, Express REST architecture, middleware pipelines, MVC pattern, request validation, and error handling. |
| **Database Architecture** | Module 05 (MongoDB & Mongoose) | **REPOSITION / REPLACE** | Replace MongoDB as primary database with modern relational standard: 22-hour Module 07 covering SQL, PostgreSQL, relational modeling, and Prisma ORM. Keep MongoDB as conceptual exposure. |
| **Security & Authentication** | Scatted mentions in Module 05 & 06 | **ADD** | Formalize into dedicated 20-hour Module 08: OWASP Top 10:2025, password hashing with bcrypt, JWT/HTTP-only cookies, CORS, rate limiting, and automated testing with Vitest. |
| **Next.js & Full-Stack Deployment** | Vague mention in Capstone | **ADD** | Create dedicated 22-hour Module 09 covering Next.js 16 App Router, Server Actions, full-stack monorepo patterns, GitHub Actions CI/CD, and cloud PaaS deployment. |
| **Portfolio & Capstone** | Module 06 (Empty placeholders) | **REPLACE** | Create comprehensive 20-hour Module 10: final integration, code reviews, technical documentation, live production deployment, and oral Viva Voce capstone defense. |

---

## 3. Industry Research & October 2026 Technical Standards

### 3.1 Job Market Requirements & Role Profiles

Industry hiring criteria for entry-level and junior software development positions in October 2026 have shifted dramatically away from syntax memorization toward verifiable implementation skills:

1. **Junior Full-Stack Developer:**
   - Capable of building complete feature sets across frontend and backend.
   - Comfortable writing TypeScript, navigating relational databases with SQL/Prisma, constructing robust REST endpoints, and linking responsive React interfaces.
   - Understands version control branching, environment variables, and basic CI/CD.
2. **Junior Frontend Developer / React Developer:**
   - Exceptional proficiency in HTML5, modern CSS/Tailwind, and vanilla JavaScript mechanics.
   - Strong component design patterns in React 19, managing state cleanly without prop-drilling, and integrating asynchronous REST APIs with graceful loading/error states.
   - Certified understanding of WCAG 2.2 AA accessibility and mobile-first responsiveness.
3. **Junior Backend Developer / Node.js Developer:**
   - Ability to construct secure, modular Express.js servers with input sanitization and structured logging.
   - Deep comfort with PostgreSQL schemas, writing normalized table migrations, handling transactions, and querying data efficiently via Prisma ORM.
   - Solid grasp of authentication security (JWT in HTTP-only cookies, bcrypt hashing, CORS configuration).
4. **Software Development Intern / Web Associate:**
   - High trainability, clean Git commit discipline, ability to deconstruct complex user stories into small coding tasks, and proficiency with developer tools (VS Code, Chrome DevTools, Postman).

---

### 3.2 Official Technical Stack & Version Governance

To guarantee student marketability and prevent outdated legacy patterns, the curriculum strictly enforces contemporary, production-proven versions:

| Technology / Tool | Version Standard | Technical Role & Pedagogical Justification |
| :--- | :--- | :--- |
| **Node.js** | **v24 LTS (Active LTS)** | Modern server-side runtime with native fetch, native `node:test` runner, ES Module default, and robust performance. |
| **React** | **v19.x** | Industry-standard UI library. Focuses on functional components, modern hooks (`useActionState`, `useOptimistic`), Server/Client component paradigms, and actions. |
| **Next.js** | **v16.x (App Router)** | Full-stack production meta-framework utilizing Turbopack, Server Actions, Route Handlers, and nested layout architecture. |
| **TypeScript** | **v5.x (Strict Mode)** | Enterprise standard for type safety. Enforces compile-time bug prevention, interfaces, type aliases, and robust IDE auto-completion. |
| **PostgreSQL** | **v17.x** | World's premier open-source relational database. Teaches ACID compliance, relational schemas, primary/foreign keys, joins, and indexing. |
| **Prisma ORM** | **v6.x** | Type-safe database client and schema migration tool. Bridges TypeScript code directly to PostgreSQL with auto-generated types. |
| **Express.js** | **v5.x** | Minimalist backend web framework for Node.js. Teaches foundational HTTP request-response cycles, middleware chains, and REST architecture. |
| **Tailwind CSS** | **v4.x** | Modern utility-first CSS engine. Enables rapid, responsive UI development without leaving JSX templates. |
| **Vite** | **v6.x** | Next-generation frontend build tooling offering instant server starts, lightning-fast HMR, and optimized production bundling. |
| **Vitest & Supertest** | **Latest LTS** | Modern test runners for unit testing React components and integration testing Express API routes. |
| **OWASP Standards** | **Top 10:2025** | Authoritative security benchmark: SQL injection prevention, XSS mitigation, secure cookies, CORS, and rate limiting. |

---

### 3.3 Zero-Cost Policy, Student Licensing & Hosting Tier Fallbacks

To ensure absolute accessibility and equity for all enrolled learners, the program operates under a **Strict Zero-Cost Infrastructure Policy**. Students are never required to purchase paid software licenses, cloud servers, or commercial API credits during the 6-month program:

| Service / Tool | Free Tier Allocation | Course Usage & Fallback Workflow |
| :--- | :--- | :--- |
| **VS Code & Cursor** | Free Community / Free Tier | Free version of Cursor provides sufficient AI completions. Standard VS Code with free extensions (GitHub Copilot Free / Cline) serves as 100% zero-cost fallback. |
| **GitHub** | Free Account | Unlimited public/private repositories, GitHub Projects for kanban tracking, and 2,000 free GitHub Actions CI/CD minutes/month. |
| **Vercel** | Free Hobby Tier | Free hosting for frontend React and Next.js applications with automated git-push deployments, preview URLs, and SSL certificates. |
| **Neon / Supabase** | Free Cloud PostgreSQL | 0.5 GB storage and pooled database connections, 100% sufficient for student relational databases and capstone projects. |
| **Render / Railway** | Free Hobby Tier | Free container/web service hosting for Node.js/Express backend APIs. Local Docker/Node execution provides instant offline fallback. |
| **Postman / Bruno** | Free Desktop Client | Full API testing, environment variables, collection management, and automated test script capabilities at zero cost. |

---

## 4. Foundation-First Course Architecture & Learning Pathway

### 4.1 "Foundation First" Pedagogical Philosophy

A critical flaw in many modern bootcamps is introducing high-level framework abstractions (e.g., Next.js App Router, ORMs, Tailwind components) on Day 1 before learners understand core language primitives. This produces fragile developers who cannot debug syntax errors, misunderstand the browser event loop, and break down when framework abstractions leak.

Nova Skills enforces a strict **Foundation-First Sequencing**:
1. **Week 01–04 (Modules 01–02):** Problem decomposition, terminal commands, Git version control, semantic HTML5, CSS layout mechanics (Flexbox/Grid), and accessibility before touching any framework.
2. **Week 05–09 (Module 03):** Vanilla JavaScript logic, control flow, functions, DOM manipulation, events, asynchronous programming (Promises, async/await), and API communication before touching React.
3. **Week 10–11 (Module 04):** Static typing with TypeScript, interfaces, and compile-time verification before adding component state.
4. **Week 12–15 (Module 05):** React 19 component architecture, declarative rendering, state hooks, and side-effects.
5. **Week 16–18 (Module 06):** Node.js HTTP servers, Express routing, REST principles, and middleware pipelines.
6. **Week 19–20 (Module 07):** Relational database architecture, SQL queries, PostgreSQL, and Prisma ORM data modeling.
7. **Week 21–22 (Modules 08–09):** Security hardening, automated testing, and Next.js full-stack integration.
8. **Week 23–24 (Module 10):** Capstone project integration, production deployment, and oral Viva Voce defense.

---

### 4.2 24-Week / 6-Month Structured Syllabus Rhythm

The 24-week calendar is structured into 4 distinct pedagogical phases, delivering 10 guided instructional hours per week:

| Phase | Calendar Timeline | Curriculum Modules | Guided Hours | Key Student Milestone |
| :--- | :--- | :--- | :--- | :--- |
| **Phase I: Web & Logic Foundations** | Weeks 01–09 (Months 1–2) | Modules 01, 02, 03 | **80 Hours** | **Project 01 Submission:** Responsive Interactive Web Application with Vanilla JS & Async API Integration. |
| **Phase II: Type Safety & Modern Frontend** | Weeks 10–15 (Months 3–4) | Modules 04, 05 | **48 Hours** | Progressive component architecture; type-safe React 19 application frontend. |
| **Phase III: Backend Engineering & Databases** | Weeks 16–20 (Months 4–5) | Modules 06, 07 | **50 Hours** | **Project 02 Submission:** Multi-tier React + Node/Express REST API Application with PostgreSQL & Prisma. |
| **Phase IV: Full-Stack Integration & Capstone** | Weeks 21–24 (Months 5–6) | Modules 08, 09, 10 | **62 Hours** | **Project 03 / Capstone Defense:** Live Production Full-Stack Application, Security Audit, and Viva Voce Defense. |

#### Weekly Instructional Rhythm (10 Guided Hours / Week)
- **Concept & Architecture Workshop (3 Hours):** Deep dive into engineering principles, design patterns, and live code breakdown with senior faculty.
- **Guided Studio Laboratory (4 Hours):** Hands-on programming lab where students code along, solve algorithmic challenges, and build modular features under active mentorship.
- **Code Review, Debugging & AI Audit Studio (3 Hours):** Group code reviews, pair-programming refactoring, git diff auditing, and error-handling simulations.
- **Independent Studio Coding (4–5 Hours Recommended):** Self-paced coding, algorithm practice (LeetCode/HackerRank easy problems), and project feature building.

---

## 5. Preferred Production Stack & Software Registry

### 5.1 Primary Production Stack
The authoritative software and tool stack taught, assessed, and required for graduation:

1. **Languages:**
   - **TypeScript (v5.x):** Primary language for all frontend and backend programming.
   - **JavaScript (ES2024+):** Foundational language mechanics, prototype chain, and event loop.
   - **SQL (PostgreSQL Dialect):** Relational queries, table creation, constraints, joins, and indexing.
   - **HTML5 & CSS3:** Semantic markup, responsive media queries, Flexbox, and CSS Grid.
2. **Frontend Ecosystem:**
   - **React 19:** Functional components, hooks (`useState`, `useEffect`, `useMemo`, `useCallback`, `useActionState`), and Context API.
   - **Tailwind CSS (v4.x):** Utility-first responsive design, layout styling, and design token integration.
   - **Vite (v6.x):** Fast development bundling, asset management, and environment variable configuration.
3. **Backend & Database Ecosystem:**
   - **Node.js (v24 LTS):** Asynchronous event-driven runtime, modular file architecture, and process handling.
   - **Express.js (v5.x):** RESTful API architecture, middleware routing, CORS, and centralized error handling.
   - **PostgreSQL (v17.x):** Relational database storage, ACID transactions, foreign keys, and indexes.
   - **Prisma ORM (v6.x):** Schema definition, database migrations, relations, and type-safe query generation.
4. **Integration & Production Deployment:**
   - **Next.js 16 (App Router):** Server Components, Server Actions, Route Handlers, and SEO optimization.
   - **Vercel & Render / Neon:** Live cloud deployment for frontend, backend API, and managed database.
5. **Developer & Engineering Tooling:**
   - **Git & GitHub:** Branching (`main`, `feature/*`), pull requests, commit hygiene, and merge conflict resolution.
   - **VS Code / Cursor:** Professional editor setup, ESLint, Prettier, debugger breakpoints, and terminal multiplexing.
   - **Postman / Bruno:** API endpoint testing, request payloads, header management, and automated test assertions.
   - **GitHub Actions:** Continuous Integration workflows for automated linting and unit testing on pull requests.

---

### 5.2 Supporting Exposure Stack
To ensure broad industry awareness without diluting depth in the primary stack, students receive structured conceptual exposure to:
- **Python Scripting Basics:** 4 hours of exposure in Module 01 to demonstrate multi-language syntax differences, script automation, and algorithmic problem-solving.
- **MongoDB & NoSQL Concepts:** 3 hours of comparative analysis in Module 07 contrasting document-store schemas with relational tables.
- **Supabase Backend-as-a-Service:** Exposure to managed Auth and real-time database subscriptions alongside self-hosted Express/Prisma workflows.
- **Docker Containerization Concepts:** Overview of Dockerfile syntax, container isolation, and local development parity.

---

### 5.3 Tool-to-Module Competency Matrix

| Technology | Mod 01 | Mod 02 | Mod 03 | Mod 04 | Mod 05 | Mod 06 | Mod 07 | Mod 08 | Mod 09 | Mod 10 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Git & GitHub** | ★★★ | ★★ | ★★ | ★★ | ★★ | ★★ | ★★ | ★★ | ★★★ | ★★★ |
| **VS Code / Terminal** | ★★★ | ★★★ | ★★★ | ★★★ | ★★★ | ★★★ | ★★★ | ★★★ | ★★★ | ★★★ |
| **HTML5 & Semantic A11y** | ★ | ★★★ | ★★ | — | ★★ | — | — | — | ★★ | ★★★ |
| **CSS3 & Tailwind CSS** | — | ★★★ | ★★ | — | ★★★ | — | — | — | ★★★ | ★★★ |
| **Modern JavaScript (ES6+)** | ★★ | ★ | ★★★ | ★★ | ★★★ | ★★★ | ★★ | ★★ | ★★★ | ★★★ |
| **TypeScript (Strict)** | — | — | — | ★★★ | ★★★ | ★★★ | ★★★ | ★★★ | ★★★ | ★★★ |
| **React 19** | — | — | — | — | ★★★ | — | — | ★★ | ★★★ | ★★★ |
| **Node.js & Express** | — | — | — | — | — | ★★★ | ★★ | ★★★ | ★★ | ★★★ |
| **SQL & PostgreSQL** | — | — | — | — | — | — | ★★★ | ★★ | ★★ | ★★★ |
| **Prisma ORM** | — | — | — | — | — | — | ★★★ | ★★ | ★★★ | ★★★ |
| **Security & Auth (OWASP)** | — | — | — | — | — | ★★ | ★★ | ★★★ | ★★ | ★★★ |
| **Next.js 16 App Router** | — | — | — | — | — | — | — | — | ★★★ | ★★★ |
| **CI/CD & Deployment** | — | ★ | ★ | — | ★★ | ★★ | ★★ | ★★ | ★★★ | ★★★ |
| **Disciplined AI Tooling** | ★★ | ★★ | ★★ | ★★ | ★★ | ★★ | ★★ | ★★★ | ★★ | ★★★ |

*Legend: ★★★ = Primary Assessed Focus; ★★ = Applied Supporting Skill; ★ = Introductory Exposure; — = Not Covered in Module.*

---

## 6. Disciplined Generative AI for Programming & Developer Workflows

### 6.1 Assessed AI Techniques
Generative AI tools (Cursor, GitHub Copilot, Claude Code, ChatGPT) are integrated throughout the curriculum as **professional engineering accelerators**, subject to strict validation rules:

1. **Requirements-to-Code Decomposition:** Using AI to break down complex product specifications into atomic tasks, pseudo-code algorithms, and interface contracts.
2. **Test-First Prompting:** Prompting AI to draft unit test suites and edge cases *before* writing the implementation code, ensuring tests remain unbiased.
3. **Repository-Aware Assistance:** Directing Cursor or Copilot with specific file contexts (`@file`, `@folder`, `@docs`) rather than pasting loose, ungrounded snippets.
4. **Code Explanation & Mental Models:** Requesting AI breakdowns of complex algorithmic routines, regex expressions, or asynchronous race conditions for accelerated learning.
5. **Interactive Debugging with Error Context:** Feeding exact terminal stack traces, request payloads, and console errors to AI to diagnose root causes systematically.
6. **SQL Query Scaffolding & Optimization:** Generating initial SQL join queries and explaining relational execution plans (`EXPLAIN ANALYZE`).
7. **Accessibility & Semantic Auditing:** Prompting AI to review JSX markup for missing ARIA attributes, color contrast failures, and non-semantic wrapper bloat.
8. **Security Vulnerability Scanning:** Using AI to inspect route handlers for unvalidated user inputs, missing CORS headers, and potential injection vectors.

---

### 6.2 Strict Human Oversight & Academic Integrity Policy

To prevent "AI dependency" and guarantee authentic software engineering capability, Nova Skills enforces clear academic integrity guardrails:

- **The "Explain Every Line" Rule:** During classroom code reviews and portfolio project defenses, faculty members can ask any student to explain the purpose, time complexity, and data flow of any line of code. If a student cannot articulate how their code works, the submission is rejected.
- **Mandatory Git Diff Review:** Students must review every AI-suggested code diff line-by-line before accepting it into their repository. Accepting unverified code blindly results in immediate lab remediation.
- **Detection of Hallucinated APIs:** Students are taught how to verify library methods against official documentation (MDN, Node docs, React docs) to detect deprecated or fabricated AI outputs.
- **Zero Credential Leaks:** Strict prevention protocols for environment variables (`.env`, `.env.local`). AI prompts must never contain live database credentials, API secrets, or private keys. Git pre-commit hooks (`git-secrets` / `.gitignore`) are mandatory.
- **Independent Syntax Checks:** Quizzes, algorithmic challenges, and whiteboard problem-solving sessions are conducted in raw development environments with AI autocompletion disabled.

---

## 7. Portfolio Architecture & Three Major Assessed Projects

To provide verifiable proof-of-work for tech recruiters and hiring managers, every graduate completes **Three Progressively Engineered Production Projects**, culminating in an enterprise capstone:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 NOVA SKILLS THREE-PROJECT PORTFOLIO SUITE                               │
├──────────────────────────┬───────────────────────────────────────┬──────────────────────────────────────┤
│ PROJECT 01: FRONTEND     │ PROJECT 02: MULTI-TIER SAAS           │ PROJECT 03: FULL-STACK CAPSTONE      │
│ Responsive Interactive   │ React 19 + Node.js REST API           │ Enterprise Full-Stack Web Platform   │
│ Web Application          │ Task & Resource Management Suite      │ Database-Driven Commercial Product   │
├──────────────────────────┼───────────────────────────────────────┼──────────────────────────────────────┤
│ • HTML5, CSS3, Flex/Grid │ • TypeScript, React 19, Tailwind CSS  │ • Next.js 16 App Router / Full-Stack │
│ • Vanilla JavaScript ES6+│ • Node.js 24 LTS, Express.js REST API │ • PostgreSQL Database + Prisma ORM   │
│ • Public REST API Fetch  │ • PostgreSQL Database with Prisma ORM │ • JWT / Session Auth + Role RBAC     │
│ • WCAG 2.2 AA A11y Pass  │ • Full CRUD Operations & Validation   │ • OWASP Hardening & Security Audit   │
│ • GitHub Pages / Vercel  │ • Unit Tests with Vitest & Supertest  │ • GitHub Actions CI/CD Pipeline      │
│ • Developed: Weeks 01–09 │ • Developed: Weeks 10–20              │ • Developed: Weeks 21–24             │
└──────────────────────────┴───────────────────────────────────────┴──────────────────────────────────────┘
```

---

### 7.1 Project 01: Responsive Interactive Web Application
- **Commercial Context:** A modern data-driven consumer web application (e.g., Real-time Cryptocurrency Tracker, Global Weather & Disaster Dashboard, or Interactive Recipe & Nutrition Finder).
- **Primary Technology Stack:** Semantic HTML5, Modern Responsive CSS3 (Flexbox, CSS Grid, Custom Properties), Vanilla JavaScript (ES2024+), Fetch API, Chart.js / Leaflet.js.
- **Required Core Features:**
  1. 100% responsive, mobile-first layout tested across 390px, 768px, and 1440px viewports with zero horizontal overflow.
  2. Asynchronous data fetching from a public, authenticated third-party REST API with robust debounce searching and filter sorting.
  3. Interactive DOM updates, dynamic card rendering, modal detail drawers, and bookmarking saved in browser `localStorage`.
  4. Graceful UX states: animated skeleton loading screens, informative empty states, and user-friendly error banners.
  5. Accessibility compliance: verified 4.5:1 color contrast, full keyboard navigation (Tab/Enter/Esc), and ARIA landmark roles.
- **Student Engineering Tasks:**
  - Decompose API schema into TypeScript interfaces/JSDoc types.
  - Implement mobile hamburger drawer navigation without external UI libraries.
  - Write modular vanilla JS files utilizing ES Modules (`import`/`export`).
  - Deploy live site to Vercel or GitHub Pages with clean domain routing.
- **Assessment Evidence:** Public GitHub repository featuring descriptive commit history, comprehensive `README.md` with architectural diagram, Lighthouse score >= 90 across Performance and Accessibility, and live functional URL.

---

### 7.2 Project 02: React + REST API Multi-Tier Application
- **Commercial Context:** An internal business resource management application (e.g., Team Project & Sprint Tracker, B2B Inventory Management System, or Healthcare Appointment Scheduling Portal).
- **Primary Technology Stack:** TypeScript, React 19, Tailwind CSS, Vite, Node.js 24 LTS, Express.js, PostgreSQL, Prisma ORM, Postman.
- **Required Core Features:**
  1. Multi-tier decoupled architecture: independent React frontend client communicating over HTTP REST to a dedicated Node/Express backend.
  2. Full CRUD operations across multiple related database models (e.g., Users, Projects, Tasks, Comments).
  3. Relational data integrity enforced via PostgreSQL foreign key constraints and Prisma ORM schema relations (1:N, N:M).
  4. Centralized backend middleware pipeline: request logging, CORS whitelist, JSON body parsing, and standardized error-handling responses.
  5. Client-side state management using React custom hooks and Context API with optimistic UI updates.
  6. Automated backend testing: minimum 8 integration test cases using Supertest validating API status codes and payloads.
- **Student Engineering Tasks:**
  - Design and migrate PostgreSQL schema using `prisma migrate dev`.
  - Author Express controller functions with strict input validation using Zod.
  - Build reusable React component library with Tailwind CSS.
  - Write comprehensive Postman test collection exportable as JSON.
- **Assessment Evidence:** GitHub monorepo or dual repositories containing backend integration tests, documented Postman API documentation, seeded database script, and deployed frontend on Vercel with backend on Render/Railway.

---

### 7.3 Project 03: Full-Stack Database-Driven Enterprise Capstone
- **Commercial Context:** A flagship commercial SaaS or Marketplace platform (e.g., Multi-Tenant Subscription LMS, Freelance Marketplace with Escrow Status, or Enterprise Asset & Incident Tracker).
- **Primary Technology Stack:** Next.js 16 (App Router) or Decoupled React 19 + Express, TypeScript (Strict), PostgreSQL (Neon/Supabase), Prisma ORM, Tailwind CSS, Zod, bcrypt, JWT/HTTP-only cookies, Vitest, GitHub Actions.
- **Required Core Features:**
  1. **Secure Multi-Role Authentication:** Password hashing using bcrypt (salt rounds >= 10), JWT issued in secure HTTP-only SameSite cookies, and Role-Based Access Control (Admin vs Member vs Client).
  2. **Complex Relational Business Logic:** At least 4 interrelated database tables featuring cascade rules, transaction rollback handlers, and paginated queries (`take`/`skip` or cursor-based).
  3. **Security Hardening (OWASP Compliance):** Protection against SQL injection (via Prisma parameterization), XSS protection, CORS restriction, and API rate-limiting (e.g., max 100 requests / 15 minutes per IP).
  4. **Continuous Integration Pipeline:** Automated GitHub Actions workflow triggered on pull requests to run ESLint, TypeScript compilation check (`tsc --noEmit`), and Vitest test suites.
  5. **Production Deployment:** Live production deployment on Vercel and Neon PostgreSQL with custom environment variables, SSL encryption, and dynamic metadata SEO tags.
- **Student Engineering Tasks:**
  - Write an initial Technical Design Document (TDD) specifying data schemas, API routes, and wireframes.
  - Develop complete application following git feature-branch workflows.
  - Conduct peer code reviews and document resolution of identified bugs.
  - Prepare a 10-slide architectural slide deck and deliver a 15-minute live oral Viva Voce technical defense.
- **Assessment Evidence:** Live production web application URL, GitHub repository with CI passing badge, comprehensive documentation, architectural diagram, test coverage report, and successful Viva Voce defense.

---

## 8. Comprehensive 10-Module Curriculum Specification

### Module 01: Programming Fundamentals, Developer Tools & Git
- **Duration:** 16 Guided Instructional Hours (Week 01–02)
- **Primary Tools:** VS Code, Git, GitHub, Terminal (Bash/Zsh), Node.js (CLI execution), Python (Syntax exposure).
- **Module Purpose:** Establish professional developer workstation discipline, command-line fluency, version control hygiene, algorithmic thinking, and problem decomposition before building web interfaces.
- **Main Topics & Subtopics:**
  1. *Computer Architecture & Developer Environment:* How computers execute software; CPU, memory, OS processes, file systems; configuring VS Code with essential extensions; mastering the command line (navigation, file manipulation, flags, environment variables).
  2. *Algorithmic Logic & Problem Decomposition:* Breaking ambiguous problems into sequential instructions; pseudo-code; control structures; variables, data types, condition branching, and loop iterations.
  3. *Version Control with Git & GitHub:* Why version control matters; Git internal object model (working directory, staging index, commit graph); essential commands (`init`, `status`, `add`, `commit`, `branch`, `checkout`/`switch`, `merge`, `diff`, `log`); setting up SSH keys; remote repositories on GitHub (`push`, `pull`, `clone`, `fetch`).
  4. *Professional Git Collaboration Workflows:* Feature-branch workflow; writing conventional commit messages (`feat:`, `fix:`, `docs:`); opening and reviewing Pull Requests (PRs); resolving merge conflicts; `.gitignore` configuration and preventing secret leakage.
  5. *Multi-Language Algorithmic Exposure:* Writing algorithmic scripts in both Node.js (JavaScript) and Python; observing syntax differences, dynamic typing, and standard libraries.
- **Classroom Labs:**
  - *Lab 1.1:* Terminal navigation speed drill and custom shell profile configuration.
  - *Lab 1.2:* Algorithmic puzzle lab: building FizzBuzz, prime number checker, and palindrome validator in CLI.
  - *Lab 1.3:* Collaborative Git disaster recovery simulation: resolving complex merge conflicts and rebasing.
- **Deliverables:** A verified GitHub repository showcasing 5 CLI utility scripts, pristine commit history, conventional PR merges, and a professional profile `README.md`.
- **Assessment:** Practical Git conflict resolution test and algorithmic code walkthrough.

---

### Module 02: HTML5, CSS3, Responsive Design & Accessibility
- **Duration:** 28 Guided Instructional Hours (Week 02–05)
- **Primary Tools:** HTML5, CSS3, Chrome DevTools, Tailwind CSS, Lighthouse, Axe DevTools.
- **Module Purpose:** Master the semantic structure and visual presentation of the open web, building accessible, fluid, mobile-first interfaces that adhere strictly to modern WCAG 2.2 AA standards.
- **Main Topics & Subtopics:**
  1. *Semantic HTML5 Document Architecture:* Anatomy of an HTML document; DOCTYPE, `<head>`, metadata, and viewport tags; semantic structural tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`); avoiding "div soup"; semantic text formatting, lists, tables, and media elements (`<picture>`, `<video>`, `<img>` with `loading="lazy"`).
  2. *CSS3 Cascading, Specificity & Box Model:* The cascade algorithm, inheritance, specificity calculations, and `!important` hazards; box model mechanics (`margin`, `border`, `padding`, `content-box` vs `border-box`); margin collapsing; CSS custom properties (variables) for theme management.
  3. *Modern Layout Engines: Flexbox & CSS Grid:* 1D layouts with Flexbox (`flex-direction`, `justify-content`, `align-items`, `flex-grow`, `flex-shrink`, `flex-wrap`); 2D grid systems with CSS Grid (`grid-template-columns`, `grid-template-rows`, `fr` units, `minmax()`, `auto-fit` vs `auto-fill`, `grid-template-areas`); holy grail and responsive card grid patterns.
  4. *Responsive Web Design & Mobile-First Strategy:* Viewport meta tag; fluid typography with `clamp()`; relative units (`rem`, `em`, `%`, `vh`, `vw`, `dvh`); media queries (`min-width` vs `max-width`); mobile-first design philosophy; container queries basics.
  5. *Web Accessibility (WCAG 2.2 AA) & Form Engineering:* Accessibility tree, screen reader interaction, and semantic navigation; accessible color contrast ratios (4.5:1 text, 3:1 UI components); ARIA roles, states, and properties (`aria-label`, `aria-expanded`, `aria-hidden`); building accessible forms (`<label for>`, `<fieldset>`, `<legend>`, validation attributes, accessible error messages).
  6. *Utility-First CSS with Tailwind CSS v4:* Introduction to utility-first styling; configuring Tailwind v4; utility classes for typography, spacing, flex, grid, and states (`hover:`, `focus-visible:`, `dark:`); optimizing production CSS bundles.
- **Classroom Labs:**
  - *Lab 2.1:* Refactoring an inaccessible, table-based legacy webpage into 100% semantic, valid HTML5.
  - *Lab 2.2:* Pixel-perfect responsive recreation of a commercial SaaS pricing and feature grid without frameworks.
  - *Lab 2.3:* Rapid prototyping of an agency marketing page using Tailwind CSS v4 with dark mode toggle.
- **Deliverables:** A production-grade, 3-page responsive corporate website published on Vercel with perfect Lighthouse scores (>= 95 in Performance, Accessibility, and Best Practices).
- **Assessment:** Automated accessibility audit (Axe/Lighthouse) and manual cross-device responsive inspection.

---

### Module 03: JavaScript Programming, DOM & Async APIs
- **Duration:** 36 Guided Instructional Hours (Week 05–09)
- **Primary Tools:** Modern JavaScript (ES2024+), Chrome DevTools (Console, Sources, Network), Fetch API.
- **Module Purpose:** Establish deep foundational competence in modern JavaScript, object-oriented and functional paradigms, asynchronous execution mechanics, DOM manipulation, and HTTP network communication.
- **Main Topics & Subtopics:**
  1. *JavaScript Language Mechanics & Types:* Primitives vs reference types; dynamic typing; memory stack vs heap; variable declarations (`let`, `const`, legacy `var`); strict mode; type coercion quirks and strict equality (`===`); modern operators (nullish coalescing `??`, optional chaining `?.`, spread/rest `...`).
  2. *Functions, Scope, Closures & Execution Context:* Global vs function vs block scope; lexical environment; closure mechanics and practical data privacy patterns; function declarations vs function expressions vs arrow functions; the `this` keyword binding rules (`bind`, `call`, `apply`); higher-order functions.
  3. *Data Structures & Modern Array Engineering:* Deep dive into Arrays and Objects; modern iteration methods (`map`, `filter`, `reduce`, `find`, `some`, `every`, `flatMap`); Array grouping (`Object.groupBy`); Sets and Maps; immutability principles and shallow vs deep cloning (`structuredClone`).
  4. *DOM Manipulation & Browser Event Architecture:* The Document Object Model tree; selecting elements (`querySelector`, `querySelectorAll`); creating, modifying, and removing DOM nodes; optimizing layout reflows and repaints; event listeners, event object, event bubbling, capturing, and event delegation patterns; keyboard accessibility and focus trapping.
  5. *Asynchronous JavaScript & The Browser Event Loop:* Single-threaded execution; call stack, Web APIs, task queue (macrotasks), and microtask queue; why UI blocking occurs; callbacks and callback hell; Promises (`.then()`, `.catch()`, `.finally()`); Promise concurrency (`Promise.all`, `Promise.allSettled`, `Promise.race`, `Promise.withResolvers`); `async`/`await` syntax and robust `try`/`catch`/`finally` error handling.
  6. *Network Communication & REST API Integration:* HTTP protocol basics (methods, status codes, headers, bodies); Fetch API; handling JSON payloads; request authentication headers; query parameters; managing async UI states (Loading, Data, Error, Empty); debouncing search inputs and throttling scroll handlers.
- **Classroom Labs:**
  - *Lab 3.1:* Building an interactive in-memory data table with dynamic sorting, multi-criteria filtering, and pagination.
  - *Lab 3.2:* Event loop visualizer and asynchronous race condition debugging lab.
  - *Lab 3.3:* Live REST API integration lab: connecting to GitHub API or OpenWeatherMap API with debounced search and error boundary fallback.
- **Deliverables:** Completion and formal deployment of **Project 01 (Responsive Interactive Web Application)** on Vercel with clean GitHub source repository.
- **Assessment:** Live coding assessment: algorithmic problem solving in JavaScript + interactive DOM manipulation challenge.

---

### Module 04: TypeScript & Code Quality Fundamentals
- **Duration:** 18 Guided Instructional Hours (Week 10–11)
- **Primary Tools:** TypeScript v5.x, `tsc`, ESLint, Prettier, VS Code TypeScript Language Server.
- **Module Purpose:** Transition learners from dynamic JavaScript to enterprise-grade static typing, learning type inference, complex data contracts, generics, and automated linting before building React applications.
- **Main Topics & Subtopics:**
  1. *The Case for Static Typing:* Dynamic typing pitfalls in production; how TypeScript compiles to clean JavaScript; `tsconfig.json` configuration and strict mode flags (`strict: true`, `noImplicitAny`, `strictNullChecks`).
  2. *Basic Types & Type Inference:* Type annotations vs type inference; primitive types (`string`, `number`, `boolean`, `null`, `undefined`, `symbol`); arrays and tuples; `any` vs `unknown` vs `never`; type assertions (`as`) and their hazards.
  3. *Interfaces vs Type Aliases:* Defining object shapes; optional properties (`?`); readonly properties; extending interfaces; intersection types (`&`); union types (`|`); literal types; choosing between `interface` and `type`.
  4. *Advanced Typing Patterns:* Discriminated unions (tagged unions) for modeling API state; type narrowing (type guards, `typeof`, `instanceof`, `in`); custom user-defined type guards (`is`).
  5. *Generics & Utility Types:* Why generics matter; generic functions, interfaces, and classes; generic constraints (`extends`); standard utility types (`Partial<T>`, `Required<T>`, `Readonly<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, T>`).
  6. *Code Quality Tooling & Static Analysis:* Configuring ESLint with TypeScript rules; formatting with Prettier; automated formatting on save; pre-commit git hooks using Husky and lint-staged.
- **Classroom Labs:**
  - *Lab 4.1:* Converting a messy 300-line vanilla JS API script into 100% strictly typed TypeScript with zero `any`.
  - *Lab 4.2:* Authoring generic data structures: building a type-safe Queue, Stack, and Result Monad (`Success<T>` / `Failure<E>`).
  - *Lab 4.3:* Setting up an automated ESLint, Prettier, and TypeScript compilation CI check in a repository.
- **Deliverables:** A fully typed, tested TypeScript library package with automated linting and zero compilation warnings.
- **Assessment:** Code refactoring exam: eliminating all type errors and `any` escapes from an ambiguous code repository.

---

### Module 05: React Frontend Development
- **Duration:** 30 Guided Instructional Hours (Week 12–15)
- **Primary Tools:** React 19, Vite, TypeScript, Tailwind CSS, Chrome React DevTools.
- **Module Purpose:** Master modern declarative frontend engineering using React 19, functional components, immutable state architecture, custom hooks, and scalable client-side UI composition.
- **Main Topics & Subtopics:**
  1. *Declarative UI & React 19 Mental Model:* Imperative DOM vs declarative UI; JSX syntax and compilation; virtual DOM and reconciliation algorithm; component composition; props passing, prop types, and children props.
  2. *Managing State with React Hooks:* State immutability; `useState` hook mechanics and functional state updates; batching updates; lifting state up; controlled vs uncontrolled form inputs.
  3. *Side Effects & Component Lifecycle:* `useEffect` hook; dependency array rules; clean-up functions (timers, subscriptions, abort controllers); avoiding infinite effect loops; data fetching patterns and custom data fetching hooks.
  4. *Performance Optimization & Advanced Hooks:* `useMemo` for expensive computations; `useCallback` for stable function references; `useRef` for DOM access and mutable non-rendering values; React 19 transitions and optimistic updates (`useActionState`, `useOptimistic`).
  5. *Global State & Component Architecture:* When to use local state vs global state; Context API (`createContext`, `useContext`); building scalable custom Context Providers; component modularization (presentational vs container components); building reusable UI components (Buttons, Inputs, Modals, Drawers).
  6. *Client-Side Routing & Forms:* Client-side single-page application (SPA) routing principles; route parameters, search params, and nested routes; form state handling, validation with Zod, and error messaging.
- **Classroom Labs:**
  - *Lab 5.1:* Building an interactive e-commerce product catalog with category filtering, search, and dynamic cart state in React.
  - *Lab 5.2:* Authoring custom hooks: `useFetch`, `useDebounce`, `useLocalStorage`, and `useMediaQuery`.
  - *Lab 5.3:* Profiling and eliminating unnecessary component re-renders using React DevTools Profiler.
- **Deliverables:** A multi-route, fully interactive React 19 application built with TypeScript and Tailwind CSS, featuring global cart/resource state and custom hooks.
- **Assessment:** Component architecture defense and live feature addition test under timed lab conditions.

---

### Module 06: Node.js, Express & REST API Development
- **Duration:** 28 Guided Instructional Hours (Week 16–18)
- **Primary Tools:** Node.js 24 LTS, Express.js v5, TypeScript (`tsx`/`ts-node`), Postman, Bruno.
- **Module Purpose:** Transition to backend server engineering, mastering the Node.js runtime, asynchronous I/O, Express.js routing, RESTful architecture, middleware design, and robust API error handling.
- **Main Topics & Subtopics:**
  1. *Node.js Architecture & Runtime Primitives:* V8 engine, libuv, and the asynchronous event-driven model; non-blocking I/O vs thread pools; CommonJS vs ES Modules; Node.js global objects (`process`, `__dirname`); built-in modules (`fs/promises`, `path`, `http`, `crypto`); reading environment variables securely (`dotenv` / native Node `.env`).
  2. *Express.js Fundamentals & Request Lifecycle:* Anatomy of an HTTP server; request (`req`) and response (`res`) objects; route parameters, query strings, and request bodies; HTTP status codes (200, 201, 204, 400, 401, 403, 404, 500); structuring Express applications (routes, controllers, services).
  3. *Middleware Engineering & The Chain of Responsibility:* What middleware is; application-level vs router-level vs error-handling middleware; `next()` mechanics; built-in middleware (`express.json()`, `express.urlencoded()`); third-party middleware (`cors`, `morgan`, `helmet`); writing custom logging and request-timing middleware.
  4. *RESTful API Design Standards:* Resource-oriented URL design (`/api/v1/resources`); choosing proper HTTP verbs (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`); idempotent vs non-idempotent operations; pagination, filtering, and sorting conventions; standardized API response envelopes (`success`, `data`, `error`, `meta`).
  5. *Request Validation & Centralized Error Handling:* Input sanitization and schema validation using Zod; rejecting malformed payloads before business logic execution; custom operational error classes (`AppError`); centralized error-handling middleware; preventing server crashes on unhandled promise rejections.
  6. *File Uploads & External API Consumption:* Handling multipart form data using Multer; validating MIME types and file size limits; making backend HTTP requests to external third-party services using Node native `fetch`.
- **Classroom Labs:**
  - *Lab 6.1:* Building a modular Express REST API from scratch with full CRUD endpoints for a resource collection.
  - *Lab 6.2:* Creating a centralized Zod validation middleware and standardized error response pipeline.
  - *Lab 6.3:* Authoring and executing a complete Postman test suite validating status codes, headers, and response payloads.
- **Deliverables:** A documented, modular Express REST API written in TypeScript with input validation, error handling, and published Postman API documentation.
- **Assessment:** API endpoint bug-hunt and live route implementation challenge.

---

### Module 07: SQL, PostgreSQL & Database Integration
- **Duration:** 22 Guided Instructional Hours (Week 19–20)
- **Primary Tools:** PostgreSQL v17, Prisma ORM v6, TablePlus / pgAdmin, Neon / Supabase.
- **Module Purpose:** Master relational database architecture, relational schema modeling, SQL query craftsmanship, transactions, indexing, and type-safe database access using Prisma ORM.
- **Main Topics & Subtopics:**
  1. *Relational Database Theory & PostgreSQL Architecture:* Relational model fundamentals; tables, rows, columns, and data types (integers, varchars, booleans, timestamps, UUIDs, JSONB); primary keys and foreign keys; ACID transactions (Atomicity, Consistency, Isolation, Durability); database normalization (1NF, 2NF, 3NF).
  2. *SQL Query Craftsmanship:* Writing raw SQL queries; Data Definition Language (`CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`); Data Manipulation Language (`SELECT`, `INSERT`, `UPDATE`, `DELETE`); filtering with `WHERE`, `LIKE`, `IN`, `BETWEEN`; aggregating with `COUNT`, `SUM`, `AVG`, `GROUP BY`, `HAVING`; relational joins (`INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `FULL JOIN`); subqueries and indexes (`CREATE INDEX`, B-tree fundamentals).
  3. *Prisma ORM & Schema Modeling:* The role of an ORM; Prisma architecture (Prisma Schema, Prisma Client, Prisma Migrate); defining models, fields, attributes (`@id`, `@default`, `@unique`, `@updatedAt`); modeling relationships: 1-to-1, 1-to-Many (1:N), and Many-to-Many (N:M).
  4. *Database Migrations & Seeding:* Managing schema evolution using `prisma migrate dev`; understanding migration history; authoring reproducible seed scripts (`seed.ts`) to populate databases with realistic test data; rolling back failed migrations.
  5. *Type-Safe Data Access & Transactions:* Querying with Prisma Client (`findUnique`, `findMany`, `create`, `update`, `delete`); filtering, sorting, and pagination; nested relation queries (`include`, `select`); executing database transactions (`prisma.$transaction`) to prevent partial writes during multi-step operations.
  6. *Comparative Database Paradigms (NoSQL vs SQL):* Structured 3-hour comparative analysis contrasting relational PostgreSQL with document-oriented MongoDB; when document stores are appropriate (unstructured logs, polymorphic catalogs) vs when relational schemas are non-negotiable (financial transactions, user relationships, inventory).
- **Classroom Labs:**
  - *Lab 7.1:* Designing a relational database schema on paper for a multi-vendor marketplace, normalizing to 3NF.
  - *Lab 7.2:* Writing raw SQL joins and aggregations to answer complex business intelligence questions.
  - *Lab 7.3:* Initializing Prisma, writing migration files, seeding 100+ records, and executing multi-model queries.
- **Deliverables:** Completion and formal deployment of **Project 02 (React + REST API Application with PostgreSQL & Prisma)**.
- **Assessment:** Relational schema design review and SQL query optimization exam.

---

### Module 08: Authentication, Security & Testing
- **Duration:** 20 Guided Instructional Hours (Week 21–22)
- **Primary Tools:** bcrypt, JSON Web Tokens (JWT), Vitest, Supertest, Helmet, OWASP Top 10 guidelines.
- **Module Purpose:** Harden full-stack applications against commercial cyber threats, implementing secure authentication, role-based access control (RBAC), and automated unit/integration testing pipelines.
- **Main Topics & Subtopics:**
  1. *Authentication Fundamentals & Password Security:* Authentication (who you are) vs Authorization (what you can do); cryptographic hashing vs symmetric encryption; password salting and hashing using `bcrypt` (work factors, timing attacks); user registration and login workflows.
  2. *Token-Based Auth & Session Mechanics:* JSON Web Token (JWT) architecture (Header, Payload, Signature); signing and verifying tokens; token expiration; why `localStorage` is insecure for tokens (XSS vulnerability); storing JWTs in `httpOnly`, `secure`, `SameSite` cookies; token refresh rotation strategies.
  3. *Role-Based Access Control (RBAC):* Implementing user roles (`ADMIN`, `MEMBER`, `GUEST`); authoring reusable authorization middleware (`requireAuth`, `requireRole('ADMIN')`); protecting frontend routes and conditional UI rendering based on user claims.
  4. *Web Application Security & OWASP Top 10:2025 Hardening:* Mitigating SQL Injection (via parameterization); Cross-Site Scripting (XSS) prevention and content sanitization; Cross-Site Request Forgery (CSRF) defenses; secure HTTP headers with `helmet`; API rate-limiting (`express-rate-limit`) to prevent brute-force attacks; enforcing strict CORS policies.
  5. *Automated Testing Principles:* The testing pyramid (Unit, Integration, End-to-End); testing philosophy (what to test vs what to avoid); configuring Vitest; test syntax (`describe`, `it`, `expect`); testing pure utility functions and React UI components.
  6. *Backend API Integration Testing with Supertest:* Testing Express route handlers over HTTP; testing successful status codes, payload shapes, authentication guards, and validation failure responses; mock database transactions in test environments.
- **Classroom Labs:**
  - *Lab 8.1:* Implementing a complete, secure registration, login, and logout auth system using bcrypt and httpOnly cookies.
  - *Lab 8.2:* OWASP vulnerability lab: identifying and patching XSS, CORS, and SQL injection flaws in an intentionally vulnerable application.
  - *Lab 8.3:* Writing a comprehensive Supertest suite covering happy and unhappy paths for all protected API routes.
- **Deliverables:** A hardened, secure authentication service featuring 10+ passing automated integration tests and zero OWASP critical vulnerabilities.
- **Assessment:** Security audit assessment: identifying 5 deliberate vulnerabilities in a demo codebase and submitting verifiable patches.

---

### Module 09: Next.js, Full-Stack Integration & Deployment
- **Duration:** 22 Guided Instructional Hours (Week 22–23)
- **Primary Tools:** Next.js 16 (App Router), Turbopack, GitHub Actions, Vercel, Neon PostgreSQL.
- **Module Purpose:** Synthesize frontend and backend skills into modern full-stack meta-framework development using Next.js 16, automating deployment with CI/CD and production cloud hosting.
- **Main Topics & Subtopics:**
  1. *Next.js 16 Architecture & App Router:* Why meta-frameworks exist; Next.js 16 file-system routing; Server Components (RSC) vs Client Components (`'use client'`); rendering strategies (Static Rendering, Dynamic Rendering, Streaming with Suspense); Turbopack build engine.
  2. *Data Fetching & Server Actions:* Fetching data directly inside Server Components without client-side waterfalls; caching and revalidation strategies (`revalidatePath`, `revalidateTag`); modern data mutations using Server Actions; handling form submissions and optimistic UI updates.
  3. *Route Handlers & Full-Stack Monorepo Architecture:* Building backend API routes directly inside Next.js using Route Handlers (`route.ts`); managing full-stack TypeScript monorepos; sharing types between frontend UI and backend queries.
  4. *SEO, Performance & Metadata Optimization:* Next.js Metadata API (dynamic titles, open graph images, twitter cards); font optimization (`next/font`); image optimization (`next/image`); core web vitals optimization.
  5. *Continuous Integration with GitHub Actions:* What CI/CD is; authoring GitHub Actions workflow YAML files; triggering automated linting, type-checking (`tsc --noEmit`), and Vitest test runs on every pull request; blocking broken code from merging into `main`.
  6. *Production Cloud Deployment & Monitoring:* Deploying Next.js to Vercel with zero-configuration git-push hooks; configuring production environment variables; connecting managed cloud PostgreSQL (Neon); database connection pooling; basic error logging and performance monitoring.
- **Classroom Labs:**
  - *Lab 9.1:* Building a full-stack Next.js 16 blog with Server Components, dynamic routes, and Server Action comments.
  - *Lab 9.2:* Setting up a GitHub Actions CI pipeline that automatically tests and lints PRs before deployment.
  - *Lab 9.3:* Deploying a full-stack application to Vercel with a live Neon cloud database, verifying production SSL and database migrations.
- **Deliverables:** A deployed, production-grade Next.js full-stack application backed by cloud PostgreSQL with an active, passing GitHub Actions CI pipeline.
- **Assessment:** Cloud deployment verification and pull request CI pipeline audit.

---

### Module 10: Industry Projects, Portfolio & Final Capstone
- **Duration:** 20 Guided Instructional Hours (Week 23–24)
- **Primary Tools:** Git, GitHub, Vercel, Neon, Loom (Video walk-throughs), Markdown.
- **Module Purpose:** Polish, integrate, document, and defend the 3-project portfolio suite, culminating in an oral Viva Voce technical defense of the flagship enterprise capstone before an academic/industry panel.
- **Main Topics & Subtopics:**
  1. *Capstone Integration & Polish Studio:* Finalizing core feature sets of **Project 03 (Full-Stack Database-Driven Enterprise Capstone)**; fixing edge cases, empty states, and validation bugs; eliminating console warnings and unused dependencies.
  2. *Production Documentation & Architectural Diagrams:* Writing professional, recruiter-ready repository `README.md` files; documenting prerequisites, local setup instructions, environment variable keys, database ERDs (Entity Relationship Diagrams), and API route tables.
  3. *Code Refactoring & Code Quality Audit:* Reviewing codebases for clean architecture, modular file naming, strict type coverage, elimination of dead code, and adherence to DRY (Don't Repeat Yourself) principles.
  4. *Portfolio Presentation & Proof-of-Work Packaging:* Organizing GitHub profile (pinned repositories, contribution graph, clean bio); recording a professional 5-minute technical Loom video walk-through explaining architectural decisions, challenges faced, and trade-offs made.
  5. *Technical Interview Preparation & Whiteboard Coaching:* Breaking down common technical screening questions (event loop, closures, indexing, REST vs GraphQL, state management); practicing mock technical interviews; CV/resume tailoring for junior developer roles.
  6. *Flagship Capstone Viva Voce Defense:* Delivering an individual 15-minute live oral defense of the capstone project before faculty evaluators; live code walk-through; demonstrating live production functionality; answering spontaneous technical scrutiny questions.
- **Classroom Labs:**
  - *Lab 10.1:* Writing comprehensive, beautiful documentation and Mermaid ERD diagrams for Project 03.
  - *Lab 10.2:* Peer code review workshop: reviewing peer repositories, submitting pull request reviews, and auditing security.
  - *Lab 10.3:* Mock technical interview simulation: answering oral questions on React lifecycle, SQL queries, and async mechanics.
- **Deliverables:**
  1. **Project 01:** Live Responsive Interactive Web App + Public GitHub Repo.
  2. **Project 02:** Live Multi-Tier React/Node REST API App + Postman Docs + Public GitHub Repo.
  3. **Project 03 (Capstone):** Live Production Full-Stack Application + Cloud Database + CI Pipeline + Documentation.
  4. **Professional Developer Portfolio:** Pinned GitHub showcase + 5-minute technical video walk-through.
- **Assessment:** Capstone Viva Voce oral defense evaluated against the formal 100-point institutional assessment rubric.

---

## 9. Institutional Assessment Model & Evaluation Standards

### 9.1 Grading Breakdown
Student achievement is evaluated across three structured assessment tiers, totaling 100%:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        COMPETENCY-BASED ASSESSMENT BREAKDOWN                           │
├───────────────────────────────┬──────────────┬─────────────────────────────────────────┤
│ ASSESSMENT COMPONENT          │ WEIGHT       │ EVALUATION CRITERIA                     │
├───────────────────────────────┼──────────────┼─────────────────────────────────────────┤
│ Continuous Studio Labs        │ 30%          │ Completion of 24 modular laboratory     │
│ & Algorithmic Challenges      │              │ assignments, Git commit hygiene, code   │
│                               │              │ quality, and active studio engagement.  │
├───────────────────────────────┼──────────────┼─────────────────────────────────────────┤
│ Progressive Portfolio         │ 40%          │ Project 01: Responsive Web App (15%)    │
│ Case Studies (Projects 1 & 2) │              │ Project 02: Multi-Tier REST App (25%)   │
│                               │              │ Verifying code structure, API design,   │
│                               │              │ tests, and responsive UI execution.     │
├───────────────────────────────┼──────────────┼─────────────────────────────────────────┤
│ Flagship Enterprise Capstone  │ 30%          │ Production functionality (10%), code    │
│ & Oral Viva Voce Defense      │              │ architecture & security (10%), and live │
│                               │              │ oral technical defense (10%).           │
└───────────────────────────────┴──────────────┴─────────────────────────────────────────┘
```

---

### 9.2 Technical Quality Standards (Non-Negotiable Minimum Benchmarks)
Every project submitted for certification must meet the following technical quality gates:
1. **Zero Critical Syntax or Compilation Errors:** Code must compile cleanly with `tsc --noEmit` and build without warnings.
2. **Strict Type Safety:** Zero arbitrary usage of the `any` escape hatch in core business logic.
3. **Web Accessibility Compliance:** Core pages must achieve minimum 90 on Lighthouse Accessibility audits and conform to WCAG 2.2 AA.
4. **Relational Data Integrity:** Database schemas must be normalized to at least 3NF with foreign keys and cascade rules explicitly configured.
5. **Security Hardening (OWASP Top 10):** Passwords hashed with bcrypt, secrets segregated into environment variables, and endpoints protected against injection and XSS.
6. **Automated Test Coverage:** Minimum of 8 passing integration tests on backend APIs and unit tests for critical business functions.
7. **Clean Version Control Discipline:** Meaningful conventional commit messages, feature branches, and zero committed secrets.

---

### 9.3 Performance Tiers & Certification Standards

| Performance Tier | Score Range | Competency Definition |
| :--- | :--- | :--- |
| **Distinction** | **90–100%** | Exemplary code craftsmanship, flawless TypeScript typing, thorough test suites, robust cloud deployment, and articulate, authoritative oral defense during Viva Voce. |
| **Proficient** | **75–89%** | Solid engineering competence, functional multi-tier architecture, clean relational schema, valid responsive UI, passing tests, and clear code walk-through. |
| **Developing** | **60–74%** | Meets baseline requirements but exhibits minor weaknesses in type strictness, test coverage, or edge-case handling. Requires guided remediation. |
| **Unsatisfactory** | **< 60%** | Fails core standards; contains broken dependencies, unhandled runtime errors, security vulnerabilities, or inability to explain submitted code. Requires complete lab resubmission. |

---

## 10. Career Pathways, Target Roles & Freelance Services

### 10.1 Target Employment Roles
Graduates of Full Stack Programming Foundation are prepared and qualified to apply for junior and associate engineering roles:

1. **Junior Full-Stack Developer:** Building features across frontend React interfaces and backend Node.js APIs, executing database migrations, and writing unit tests.
2. **Junior Frontend Developer / React Developer:** Translating UI/UX Figma wireframes into responsive, accessible React/TypeScript components, managing state, and integrating REST APIs.
3. **Junior Backend Developer / Node.js Developer:** Authoring Express route handlers, validating payloads, maintaining PostgreSQL schemas, and configuring third-party integrations.
4. **Web Application Developer:** Maintaining, debugging, and enhancing commercial web applications, fixing issues, and deploying updates via CI/CD.
5. **Software Engineering Intern / Trainee:** Contributing clean code in agile development environments under senior engineer mentorship.

---

### 10.2 Realistic Entry Salaries & Hiring Reality
Nova Skills enforces strict truth-in-education governance. We reject inflated salary claims and deceptive guarantees:
- **Indian Market Reality (October 2026):** Starting compensation for junior full-stack developers in India ranges from **INR 3.6 LPA to INR 7.5 LPA** for entry-level positions, with specialized product startups and tech hubs (Bengaluru, Hyderabad, Pune, NCR) offering higher bands based on verifiable portfolio proof-of-work.
- **Remote / International Opportunities:** Junior developers with strong English communication and verified GitHub proof-of-work can secure remote global contractor or junior developer roles ranging from **\$1,000 to \$2,500 / month**.
- **The Deciding Factor:** Tech hiring managers do not hire based on course completion certificates; they hire based on **public GitHub code quality, live working deployments, and the candidate's oral ability to explain technical decisions and trade-offs**.

---

### 10.3 Freelance & Client Monetization Services
Graduates can monetize their skills independently by offering structured digital services to small businesses, startups, and agencies:
- **Custom Responsive Business Websites:** Building fast, accessible, SEO-optimized web presences using React/Next.js and Tailwind CSS (INR 15,000 – INR 45,000 / project).
- **Full-Stack Minimum Viable Products (MVPs):** Developing database-driven prototypes for early-stage startup founders (INR 40,000 – INR 1,20,000 / MVP).
- **REST API & Database Development:** Authoring custom Node.js/PostgreSQL backend services and integrations (INR 20,000 – INR 60,000).
- **Website Maintenance & Technical Retainers:** Monthly updates, performance tuning, database backups, and feature enhancements (INR 10,000 – INR 25,000 / month).

---

## 11. 24 Institutional FAQs

1. **Can complete beginners with no prior coding experience succeed in this program?**  
   Yes. The program is designed using a strict "Foundation First" pedagogy. We begin with computer architecture, terminal navigation, algorithmic thinking, and problem decomposition before introducing syntax, ensuring learners build genuine logic from the ground up.
2. **What is the duration and weekly time commitment required?**  
   The program runs for exactly 6 Months (24 calendar weeks), delivering 240 Guided Instructional Hours (10 hours per week of live workshops, lab studios, and code reviews). Students are recommended to dedicate an additional 4–5 hours per week of independent coding practice.
3. **How does Full Stack Programming Foundation differ from Python Developer Professional?**  
   Full Stack Programming Foundation focuses on web application development across the modern TypeScript, React 19, Node.js 24 LTS, and PostgreSQL stack. Python Developer Professional focuses deeply on backend systems, automation scripting, and the Python ecosystem (FastAPI/Django).
4. **How does this course differ from AI Web Development Professional?**  
   Full Stack Programming Foundation teaches foundational software engineering, algorithms, databases, and full-stack architecture. AI Web Development Professional focuses specifically on consuming AI model APIs, building prompt-driven LLM applications, and RAG pipelines.
5. **How does this program differ from No-Code Website Professional?**  
   No-Code Website Professional uses visual platforms (Webflow, Shopify, WordPress) where zero code is written. Full Stack Programming Foundation is a rigorous computer science and software development program where students write code from scratch in TypeScript, React, and Node.js.
6. **Why is TypeScript taught as a core requirement rather than plain JavaScript?**  
   TypeScript is the universal industry standard for production web development in 2026. Teaching TypeScript prepares students for professional codebases where static typing, interfaces, and compile-time error detection are mandatory.
7. **Why does the curriculum prioritize PostgreSQL and Prisma over MongoDB?**  
   Industry hiring overwhelmingly prioritizes relational database competence (SQL, joins, ACID transactions, data normalization). PostgreSQL is the gold standard for web applications. Prisma ORM provides type-safe database queries that integrate seamlessly with TypeScript. MongoDB is introduced conceptually for comparison.
8. **Why are beginners not started directly on Next.js or meta-frameworks?**  
   Starting beginners on Next.js creates fragile developers who do not understand what is happening on the client vs the server. By mastering vanilla HTML, CSS, JavaScript, and React 19 first, students understand the underlying mechanics that Next.js abstracts.
9. **How is Generative AI integrated into the coding curriculum?**  
   AI tools (Cursor, Copilot, Claude Code) are taught as professional engineering accelerators for task decomposition, test generation, and debugging. Students are held to strict oversight policies: they must conduct line-by-line git diff reviews and be able to explain every line of code independently.
10. **Can a student simply use AI to write their projects and pass?**  
    No. During project reviews and the mandatory Capstone Viva Voce defense, faculty conduct live code walk-throughs and oral questioning. If a student cannot articulate their architectural logic or explain how their code works, the submission is rejected.
11. **Are paid software licenses or expensive cloud servers required?**  
    No. The program operates under a Strict Zero-Cost Policy. All tools used (VS Code, Git, Node.js, PostgreSQL, Vite, Postman) and all cloud hosting platforms (Vercel, Neon, Render, GitHub) provide free tiers that completely cover all coursework and portfolio deployments.
12. **Do students need an expensive high-end laptop to participate?**  
    No. Standard development in Node.js, TypeScript, and React runs efficiently on any standard PC or laptop with 8GB RAM, an Intel i3/i5 or AMD Ryzen processor, and a stable broadband internet connection. Linux, macOS, and Windows 10/11 are fully supported.
13. **How many portfolio projects do students complete for their CV?**  
    Students complete Three Major Production Projects: (1) A Responsive Interactive Web Application with Vanilla JS and APIs, (2) A Multi-Tier React 19 + Node.js REST API Application with PostgreSQL and Prisma, and (3) A Full-Stack Enterprise Capstone with Auth, Security, and CI/CD.
14. **How are student assignments and projects evaluated?**  
    Evaluation is competency-based: Continuous Studio Labs (30%), Progressive Portfolio Projects (40%), and Flagship Capstone Viva Voce Defense (30%). Projects are evaluated against non-negotiable quality benchmarks including type safety, test coverage, and OWASP security.
15. **What web security standards are taught in this program?**  
    Students are trained on the OWASP Top 10:2025 standard, learning practical defenses against SQL injection, XSS attacks, CSRF, insecure authentication, credential leaks, and broken access control.
16. **What is the commercial tuition fee and tax treatment?**  
    The working commercial tuition baseline is INR 29,999. In accordance with Indian statutory tax regulations, 18% GST (INR 5,400) is applicable, resulting in a total payable tuition of INR 35,399.
17. **Are flexible No-Cost EMI payment options available?**  
    Yes. Nova Skills offers transparent No-Cost EMI plans starting at approximately INR 5,900 / month across 6 months, as well as 3-month and 9-month options through partner banking providers with zero hidden interest.
18. **Does Nova Skills offer an illegal "100% Job Guarantee"?**  
    No. Nova Skills strictly adheres to truth-in-education governance. We guarantee world-class curriculum standards, hands-on lab training, and rigorous portfolio defense. Hiring decisions rest on a student's public code and technical performance.
19. **What placement and career support does Nova Skills provide?**  
    Students receive personalized GitHub portfolio reviews, technical resume engineering, LinkedIn inbound positioning coaching, mock technical interview sessions, and direct introductions to our hiring partner network.
20. **What job roles are graduates qualified to apply for?**  
    Graduates are qualified for Junior Full-Stack Developer, Junior Frontend Developer, Junior React Developer, Junior Node.js Developer, Web Application Developer, and Software Engineering Intern positions.
21. **Will students own the source code and repositories they create?**  
    Yes. 100% of all code written by students is hosted on their personal GitHub accounts under open-source licenses. Students retain full intellectual property and ownership of all their projects.
22. **What happens if a student struggles with a specific programming module?**  
    Students receive dedicated lab mentorship during weekly studio hours, peer study group support, and guided remediation labs to ensure no student is left behind before moving to subsequent modules.
23. **What certificate is awarded upon graduation?**  
    Graduates who successfully complete all lab requirements and pass their Capstone Viva Voce defense are awarded the ISO 9001:2015 verified **Professional Certificate in Full Stack Software Development** from Nova Skills with online QR-code verification.
24. **How does this curriculum stay relevant with rapid technological shifts?**  
    Curriculum specifications are updated and audited semi-annually by the Nova Skills Academic Board and Industry Advisory Panel to ensure synchronization with current active LTS tool releases (e.g., React 19, Node.js 24 LTS, Next.js 16).

---

## 12. Operational Blueprint & Governance

### 12.1 Instructor Qualifications & Technical Bench
To ensure exceptional educational delivery, all instructors and lab mentors for Full Stack Programming Foundation must meet strict technical benchmarks:
- **Professional Experience:** Minimum 3+ years of active commercial software development experience in full-stack JavaScript/TypeScript production environments.
- **Production Competence:** Demonstrated mastery of modern React 19, Node.js 24 LTS, PostgreSQL, Prisma ORM, and Git collaborative workflows.
- **Pedagogical Empathy:** Ability to deconstruct complex technical concepts into intuitive mental models, conduct compassionate code reviews, and guide debugging sessions without writing the code for the student.

---

### 12.2 Hardware & Software Infrastructure Requirements
- **Learner Hardware:** Laptop or desktop computer with minimum 8GB RAM (16GB recommended), 64-bit multi-core processor, 20GB free disk space, and reliable broadband internet.
- **Supported Operating Systems:** Windows 10/11 (with WSL2 recommended), macOS (12.0+), or Linux (Ubuntu 22.04+ LTS).
- **Software Toolchain:** Node.js 24 LTS, Git v2.40+, VS Code or Cursor, Chrome/Firefox Developer Edition, Postman/Bruno, TablePlus/pgAdmin.

---

### 12.3 Truth-in-Education Compliance Statement
The Nova Skills Academic Board hereby certifies that this specification:
1. Reflects contemporary, production-proven technical standards for October 2026.
2. Contains zero deceptive marketing claims, artificial price anchor manipulation, or illegal employment guarantees.
3. Provides honest, achievable learning pathways grounded in verifiable proof-of-work engineering.

---

### 12.4 Pre-Implementation Verification Checklist for NOVA-FSP-02 through 07

Before proceeding with downstream implementation tasks, ensure the following checkpoints are verified against this approved specification:

- [x] Canonical course ID confirmed as `fullstack-foundation`.
- [x] Total Guided Instructional Hours confirmed at exactly 240 hours.
- [x] Total duration confirmed at 6 Months (24 calendar weeks).
- [x] 10-module progressive curriculum approved without cognitive jumping.
- [x] Software stack standardized on TypeScript, React 19, Node.js 24 LTS, PostgreSQL, Prisma, Tailwind CSS.
- [x] Three major progressive portfolio projects specified with rigorous criteria.
- [x] Disciplined AI engineering guidelines established with mandatory human oversight.
- [x] Working commercial baseline noted (INR 29,999) pending formal NOVA-FSP-02 pricing update.
- [x] 24 institutional FAQs authored with authentic, course-specific answers.
- [x] Zero website files modified in this task (`data.js`, individual course JSON, and master JSON remain untouched).

*Approved by the Nova Skills Academic Board & Technical Curriculum Committee — October 25, 2026.*
