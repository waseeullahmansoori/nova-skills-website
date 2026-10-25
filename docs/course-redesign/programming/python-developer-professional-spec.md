# Python Developer Professional — Academic Specification & October 2026 Curriculum Blueprint

**Program Title:** Python Developer Professional
**Course Identifier:** `python-developer`
**Academy:** Programming Academy (`programming`)
**Credential Awarded:** Professional Certificate in Python Application Development
**Governing Standard:** Nova Skills Academic Board | October 2026 Production Standard (Version 2.0.0)
**Duration:** 3 Months (12 Instructional Weeks)
**Total Guided Instructional Hours:** 120 Guided Hours (~10 Hours / Week)
**Recommended Independent Coding Practice:** 40–60 Additional Hours (Clearly demarcated from guided hours)
**Working Commercial Tuition Baseline:** INR 14,999 (Statutory 18% GST: INR 2,700; Total Payable: INR 17,699; Approved Installment Options: 3-month term)
**Target Level:** Beginner to Career Applied Professional
**Primary Backend Framework:** FastAPI (Modern, async, type-safe API engineering)
**Secondary Frameworks:** Flask & Django (Architectural comparisons, MVT concepts, Django ORM & Admin)

---

## 1. Executive Summary & Program Positioning

### 1.1 Course Positioning & Commercial Value
In the contemporary October 2026 technology landscape, Python remains one of the world's most versatile, widely adopted programming languages, driving backend web services, data engineering pipelines, process automation, cloud infrastructure, and AI system glue. However, entry-level hiring requirements have evolved dramatically:
- Employers no longer seek candidates with superficial syntax knowledge who merely copy script snippets.
- Industry software squads demand junior Python developers who write **type-safe, PEP 8 compliant, well-tested code** using modern tools (`uv`, `ruff`, `pytest`), design robust RESTful APIs using **FastAPI** and **Pydantic v2**, model relational data with **PostgreSQL** and **SQLAlchemy 2.0**, and manage versions with disciplined Git workflows.

The **Python Developer Professional** program at Nova Skills is engineered as an intensive, hands-on, 3-month (120 guided hours) foundational-to-applied professional curriculum. It equips learners with the core language mechanics, object-oriented software engineering principles, automation techniques, relational database architecture, and backend API capabilities required to secure entry-level roles such as **Junior Python Developer**, **Python Backend Associate**, **Automation Scripting Specialist**, and **Software Engineering Trainee**.

---

### 1.2 Academy Differentiation Matrix
To eliminate syllabus overlap across the Nova Skills catalog, the table below defines the clear architectural boundaries separating the Programming Academy's core offerings:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       NOVA SKILLS PROGRAMMING ACADEMY BOUNDARY MATRIX                                  │
├──────────────────────────────┬──────────────────────────────┬──────────────────────────────┬───────────────────────────┤
│ PROGRAM                      │ CORE TECHNOLOGY STACK        │ PEDAGOGICAL EMPHASIS         │ COMMERCIAL OUTCOME        │
├──────────────────────────────┼──────────────────────────────┼──────────────────────────────┼───────────────────────────┤
│ Full Stack Programming       │ JavaScript (ES2024+), TS,    │ Complete 2-tier web software │ Junior Full-Stack         │
│ Foundation (6 Months / 240h) │ React 19, Node.js, Express,  │ architecture from accessible │ Web Developer /           │
│ INR 29,999                   │ PostgreSQL, Next.js 16       │ DOM UI to backend cloud APIs │ React Developer           │
├──────────────────────────────┼──────────────────────────────┼──────────────────────────────┼───────────────────────────┤
│ Python Developer             │ Python 3.12/3.13 LTS, uv,    │ Language mastery, OOP logic, │ Junior Python Developer / │
│ Professional (3 Months/120h) │ Ruff, pytest, PostgreSQL,    │ automation, SQL modeling,    │ Python Backend Associate /│
│ INR 14,999 [THIS PROGRAM]    │ SQLAlchemy, FastAPI, Docker  │ and high-throughput REST APIs│ Automation Engineer       │
├──────────────────────────────┼──────────────────────────────┼──────────────────────────────┼───────────────────────────┤
│ AI Web Development           │ Next.js, Python/FastAPI,     │ Consuming LLM model APIs,    │ AI Application Builder /  │
│ Professional (4 Months/160h) │ LangChain, Vector DBs,       │ prompt engineering, agentic  │ Full-Stack AI Product     │
│ INR 34,900                   │ Vercel AI SDK, OpenAI API    │ interfaces, and RAG UI       │ Developer                 │
├──────────────────────────────┼──────────────────────────────┼──────────────────────────────┼───────────────────────────┤
│ AI Solutions Engineering &   │ Python, LangGraph, LlamaIndex│ Autonomous multi-agent       │ Enterprise AI Solutions   │
│ Agentic AI Mastery (6M/240h) │ MCP, AutoGen, Pinecone,      │ orchestration, fine-tuning,  │ Architect / Senior Agentic│
│ INR 89,900                   │ vLLM, Docker, Kubernetes     │ enterprise RAG, and MCP      │ Systems Engineer          │
└──────────────────────────────┴──────────────────────────────┴──────────────────────────────┴───────────────────────────┘
```

---

## 2. Forensic Course Audit & Content Migration Analysis

### 2.1 Audit of Existing Codebase State
The legacy `python-developer` course implementation suffered from multiple structural, pedagogical, and commercial deficiencies:

1. **Abrupt 4-Module Structure:** The existing curriculum crammed Python syntax, OOP, Flask, and Django into just 4 modules with only 4 generic lessons each (16 total lessons), leaving severe educational gaps in type hinting, testing, database migrations, and debugging.
2. **Missing Guided Hours Allocation:** None of the existing modules declared instructional hour allocations or studio lab durations, resulting in unverified scheduling.
3. **Outdated Backend Architecture:** The legacy course attempted to teach full Django MVT and Flask web development simultaneously without teaching modern, industry-standard **FastAPI**, Pydantic validation, asynchronous I/O, or modern type hints.
4. **Tooling Anomalies:** In `data.js`, the tool list literally contained `"Python Developer Professional"` (the course title) as a tool entry, alongside legacy tool names with missing version governance.
5. **Absence of Modern Tooling:** Completely omitted modern Python developer tools: `uv` (fast package manager), `ruff` (linter/formatter), `pytest` (standard testing framework), and Docker.
6. **Artificial Commercial Discount:** `data.js` listed `price: 14999` with `originalPrice: 39999` (an unsubstantiated 62.5% discount) without verifiable business justification.
7. **Generic FAQs and Placeholders:** `what_you_will_build` had two one-sentence placeholder strings, and `faq` contained only 3 generic questions lacking tax, prerequisite, and career reality disclosures.

---

### 2.2 Content Migration & Categorization Matrix
Every component of the legacy curriculum has been systematically evaluated:

| Legacy Component | Audit Finding | Verdict | Action Taken in New Blueprint |
| :--- | :--- | :---: | :--- |
| **Python Syntax & Logic (M01)** | Good foundational concept, but lacks algorithmic problem solving and type hinting. | **EXPAND** | Expanded into **Module 01 (18h)** with memory models, data structures, and algorithmic logic. |
| **OOP & File I/O (M02)** | Covers basic classes and files, but omits modern dataclasses, context managers, and type hints. | **EXPAND** | Expanded into **Module 02 (18h)** with dunder methods, dataclasses, protocols, and type safety. |
| **File I/O & Requests (M02/M03)**| Basic file reading and HTTP calls, but lacks robust CSV/JSON processing and automation. | **EXPAND** | Created dedicated **Module 03 (14h)** for automated file pipelines, regex, web scraping, and API consumption. |
| **Git, Tooling & Debugging** | Completely missing in legacy curriculum. | **ADD** | Created **Module 04 (12h)** covering Git, VS Code, `uv`, `ruff`, Pylance, and Python debugger (`pdb`). |
| **Database & SQL Knowledge** | Legacy briefly touched Django ORM without teaching raw SQL or relational database design. | **ADD** | Created **Module 05 (14h)** teaching relational modeling, PostgreSQL, raw SQL, and SQLAlchemy 2.0 ORM. |
| **Flask Microframework (M03)** | Taught as a standalone framework, but modern industry prefers FastAPI for backend APIs. | **REPOSITION** | Repositioned Flask as a comparative microframework lesson; adopted **FastAPI** as the primary backend in **Module 06 (20h)**. |
| **Django Framework (M04)** | Taught superficially as enterprise MVT; impossible to master in a short beginner course. | **REPOSITION** | Repositioned Django into a focused practical comparison (admin, ORM, auth) in Module 06 without claiming full mastery. |
| **Authentication, Security & Testing**| Completely absent in legacy curriculum; no automated testing or OWASP coverage. | **ADD** | Created **Module 07 (12h)** with JWT auth, password hashing, OWASP Top 10 defenses, `pytest`, and cloud deployment. |
| **Capstones & Portfolio** | Only 2 generic one-sentence placeholders. | **EXPAND** | Created **Module 08 (12h)** with 2 major production-grade portfolio projects and Viva Voce defense. |
| **Tool list in data.js** | Contained course name as a tool. | **REMOVE** | Cleaned and registered 12 canonical professional tools. |

---

## 3. Industry Research & October 2026 Technical Standards

### 3.1 Job Market Requirements & Role Profiles
Analysis of entry-level Python developer job requisitions across technology hubs (Bengaluru, Hyderabad, Pune, NCR, and remote international markets) reveals unambiguous expectations for junior developers:
- **Language Fluency:** Deep understanding of Python collections (lists, dicts, sets, tuples), comprehensions, generators, decorators, and memory references.
- **Type Safety:** Proficiency with Python 3.10+ type hinting (`typing` module, `Union`, `Optional`, `Callable`, generic types) to write clean, self-documenting code.
- **API Engineering with FastAPI:** Overwhelming industry shift toward FastAPI for high-performance REST APIs due to native async/await, Pydantic v2 data validation, and automated OpenAPI/Swagger generation.
- **Relational Databases & SQL:** Solid command of raw SQL (joins, aggregations, transactions) and modern ORMs (SQLAlchemy 2.0 / SQLModel) over PostgreSQL.
- **Automated Testing:** Strict requirement for test-driven habits using `pytest` (fixtures, assertions, parametrization) rather than manual ad-hoc testing.
- **Modern Packaging & Tooling:** Rapid adoption of Astral's `uv` (replacing slow pip/virtualenv) and `ruff` (replacing black, flake8, isort) across modern engineering squads.
- **Responsible AI Assistance:** Ability to use GitHub Copilot / Cursor to accelerate boilerplate creation while maintaining total intellectual comprehension of the resulting code.

---

### 3.2 Official Technical Stack & Version Governance
To prevent environment conflicts and ensure long-term stability, the curriculum standardizes on official LTS and stable releases:

| Tool / Technology | Version Standard | Role in Curriculum | Verification Note |
| :--- | :---: | :--- | :--- |
| **Python** | **3.12 / 3.13 LTS** | Core language runtime | High performance, improved error messages, stable ecosystem |
| **uv** | **0.4+** | Fast package and virtual environment manager | 10x–100x faster than pip; industry standard in 2026 |
| **Ruff** | **0.6+** | Ultra-fast Python linter and code formatter | Replaces flake8, black, and isort with zero configuration |
| **FastAPI** | **0.115+** | Primary backend web and REST API framework | Built-in async, OpenAPI docs, high developer productivity |
| **Pydantic** | **v2.9+** | Data validation, parsing, and serialization | Rust-powered core, strict type checking for API payloads |
| **SQLAlchemy** | **2.0+** | Relational Object-Relational Mapper (ORM) | Modern 2.0 syntax, typed queries, connection pooling |
| **PostgreSQL** | **17.x** | Primary relational database engine | Cloud deployment via Neon / Supabase serverless tiers |
| **Pytest** | **8.x** | Automated unit, functional, and API testing | Fixtures, test discovery, assertion rewriting, coverage |
| **Flask** | **3.0+** | Secondary microframework comparison | Taught for architectural comparison and lightweight endpoints |
| **Django** | **5.1 LTS** | Secondary enterprise framework comparison | Taught for MVT patterns, built-in Admin, and ORM comparison |
| **Docker** | **26+** | Containerization for backend API deployment | Dockerfile authoring, image building, container execution |
| **Git & GitHub** | **2.45+** | Version control, PR workflows, portfolio hosting | Conventional commits, branch hygiene, GitHub Actions |

---

### 3.3 Strict Zero-Cost Policy & Student Tool Licensing
The Python Developer Professional program operates under a **Strict Zero-Cost Policy**:
- **Zero Paid Licenses:** All programming languages, libraries, IDEs, and CLI tools are 100% open-source and free.
- **Free Cloud Infrastructure:** Database hosting (Neon / Supabase), container/API hosting (Render / Railway / Fly.io free tiers), and code hosting (GitHub) operate entirely within verified zero-cost allowances.
- **No Unfunded Paid-Tool Requirements:** Students are never forced or pressured to purchase proprietary cloud credits or commercial tool subscriptions.

---

## 4. Foundation-First Course Architecture & 12-Week Syllabus Rhythm

The program is structured across **12 Instructional Weeks** divided into three 4-week thematic phases:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              12-WEEK INSTRUCTIONAL PROGRESSION (120 GUIDED HOURS)                      │
├────────────────────────────────┬────────────────────────────────┬──────────────────────────────────────┤
│ WEEKS 01–04: FOUNDATIONS       │ WEEKS 05–08: DATA & TOOLING    │ WEEKS 09–12: BACKEND & CAPSTONE      │
│ Core Python, OOP & Logic       │ Files, Git, SQL & PostgreSQL   │ FastAPI, Security, Testing & Defense │
├────────────────────────────────┼────────────────────────────────┼──────────────────────────────────────┤
│ • Module 01: Fundamentals (18h)│ • Module 03: Files & APIs (14h)│ • Module 06: FastAPI Backend (20h)   │
│ • Module 02: OOP & Types (18h) │ • Module 04: Git & Tooling(12h)│ • Module 07: Auth & Testing (12h)    │
│                                │ • Module 05: SQL & ORM (14h)   │ • Module 08: Capstone Projects (12h) │
├────────────────────────────────┼────────────────────────────────┼──────────────────────────────────────┤
│ Outcome: Independent logic,    │ Outcome: Relational schemas,   │ Outcome: Live production REST APIs,  │
│ algorithms, data structures.   │ data pipelines, code quality.  │ automated tests & Viva Voce defense. │
└────────────────────────────────┴────────────────────────────────┴──────────────────────────────────────┘
```

---

## 5. Comprehensive 8-Module Curriculum Specification

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                             8-MODULE GUIDED INSTRUCTIONAL HOURS ALLOCATION                             │
├───────────┬─────────────────────────────────────────────────┬──────────────┬─────────┬─────────────────┤
│ Module    │ Module Title                                    │ Guided Hours │ Lessons │ Core Tools      │
├───────────┼─────────────────────────────────────────────────┼──────────────┼─────────┼─────────────────┤
│ Module 01 │ Python Programming Fundamentals & Logic         │   18 Hours   │    6    │ Python 3.12, VS │
│ Module 02 │ Intermediate Python, OOP & Type-Safe Dev        │   18 Hours   │    6    │ Python, Pylance │
│ Module 03 │ File Processing, Automation & API Integration   │   14 Hours   │    5    │ httpx, regex    │
│ Module 04 │ Git, Python Tooling, Debugging & Code Quality   │   12 Hours   │    4    │ uv, Ruff, Git   │
│ Module 05 │ SQL, PostgreSQL & ORM Integration               │   14 Hours   │    5    │ Postgres, SQLA  │
│ Module 06 │ FastAPI & Backend Application Development       │   20 Hours   │    6    │ FastAPI, Pydantic│
│ Module 07 │ Authentication, Security, Testing & Deployment  │   12 Hours   │    4    │ pytest, Docker  │
│ Module 08 │ Professional Projects, Portfolio & Capstone     │   12 Hours   │    4    │ GitHub, Vercel  │
├───────────┼─────────────────────────────────────────────────┼──────────────┼─────────┼─────────────────┤
│ TOTAL     │ Complete Program (Foundation to Applied Pro)    │  120 Hours   │   40    │ 12 Canonical    │
└───────────┴─────────────────────────────────────────────────┴──────────────┴─────────┴─────────────────┘
```

---

### Module 01: Python Programming Fundamentals & Problem Solving
- **Duration:** 18 Guided Instructional Hours (Weeks 01–02)
- **Primary Tools:** Python 3.12 / 3.13, Visual Studio Code, Terminal (Bash / PowerShell).
- **Module Purpose:** Establish deep computational problem-solving fluency, understand Python runtime execution, master core data structures, and build disciplined algorithmic logic from the ground up.
- **Main Topics & Subtopics:**
  1. *Python Runtime & Execution Model:* How Python executes code; bytecode compilation (`.pyc`), CPython interpreter, GIL overview; configuring VS Code with Python extension; interactive REPL vs scripted execution.
  2. *Variables, Memory References & Data Types:* Dynamic typing mechanics; memory identity (`id()`) vs value equality (`==`); integers, floats, booleans, strings; string slicing, formatting (f-strings), and built-in methods.
  3. *Control Flow & Algorithmic Logic:* Boolean logic, truthy and falsy values; conditional branches (`if`/`elif`/`else`); structural pattern matching (`match`/`case`); while loops, for loops with `range()`, `break`, `continue`, and loop `else` clauses.
  4. *Core Data Structures Mastery:* Lists (indexing, slicing, mutating methods, memory resizing); Tuples (immutability, packing/unpacking); Sets (hashing, mathematical set operations); Dictionaries (hash maps, keys, values, items, collision handling).
  5. *Comprehensions & Pythonic Iteration:* List comprehensions, dictionary comprehensions, set comprehensions; conditional filters in comprehensions; memory-efficient iterator protocol; generator expressions vs lists.
  6. *Functions & Modular Programming:* Function definitions, parameters, return values; default arguments and mutable default hazards; `*args` and `**kwargs` variable arguments; keyword-only arguments; importing standard library modules.
- **Classroom Labs:**
  - *Lab 1.1:* Algorithmic puzzle lab: FizzBuzz, prime number sieve, and palindrome checker in Python REPL.
  - *Lab 1.2:* In-memory student gradebook: manipulating nested dictionaries, calculating averages, and sorting by score.
  - *Lab 1.3:* Text analysis utility: parsing text files, counting word frequencies with dicts, and generating summary tables.
- **Student Deliverable:** A verified GitHub repository containing 5 standalone algorithmic utility scripts with comprehensive docstrings and zero PEP 8 warnings.
- **Assessment:** Timed algorithmic coding challenge and manual code review.

---

### Module 02: Intermediate Python, OOP & Type-Safe Development
- **Duration:** 18 Guided Instructional Hours (Weeks 03–04)
- **Primary Tools:** Python 3.12, VS Code Pylance, `typing` module.
- **Module Purpose:** Transition from procedural scripting to professional object-oriented software engineering, mastering class architecture, inheritance, special dunder methods, type hinting, and modern dataclasses.
- **Main Topics & Subtopics:**
  1. *Object-Oriented Programming (OOP) Architecture:* The OOP mental model; classes vs instances; constructors (`__init__`); instance attributes vs class attributes; methods, `@classmethod`, and `@staticmethod`.
  2. *Encapsulation & Property Management:* Public, protected (`_`), and private (`__`) attributes; getter and setter properties with `@property` and `@prop.setter`; validating attribute mutations.
  3. *Inheritance, Polymorphism & Composition:* Single and multiple inheritance; the Method Resolution Order (MRO) and `super()`; method overriding; favoring composition over inheritance in software design.
  4. *Special "Dunder" Methods & Operator Overloading:* String representation (`__str__` vs `__repr__`); equality (`__eq__`) and comparison (`__lt__`); container methods (`__len__`, `__getitem__`); context management protocol (`__enter__`, `__exit__`).
  5. *Modern Dataclasses & Data Modeling:* Introduction to `@dataclass`; automatic generation of `__init__`, `__repr__`, and `__eq__`; immutable dataclasses (`frozen=True`); field defaults with `field(default_factory=...)`.
  6. *Static Type Hinting & Code Contracts:* The value of static types in dynamic Python; type annotations for variables, function arguments, and return types; `typing` module (`List`, `Dict`, `Optional`, `Union`, `Any`, `Callable`); modern `|` union syntax; type narrowing and runtime type verification.
- **Classroom Labs:**
  - *Lab 2.1:* Building an Object-Oriented Banking System with encapsulation, transaction histories, and custom exception handling.
  - *Lab 2.2:* Creating custom context managers (`with` statement) for measuring code execution time and managing temporary file buffers.
  - *Lab 2.3:* Type-hinting a complete business domain model using dataclasses, validating zero type errors in Pylance.
- **Student Deliverable:** An object-oriented, fully type-annotated inventory management engine with complete class hierarchies and unit tests.
- **Assessment:** OOP architecture defense and static type-checking verification.

---

### Module 03: File Processing, Automation & API Integration
- **Duration:** 14 Guided Instructional Hours (Weeks 05–06)
- **Primary Tools:** Python `pathlib`, `csv`, `json`, `httpx` / `requests`, `BeautifulSoup4`.
- **Module Purpose:** Empower students to automate everyday business tasks, process diverse file formats (CSV, JSON, TXT), parse web content, and consume external REST APIs over HTTP.
- **Main Topics & Subtopics:**
  1. *Modern Filesystem Operations with pathlib:* The `pathlib.Path` API vs legacy `os.path`; creating, moving, renaming, and deleting files and directories; globbing patterns (`path.glob('**/*.py')`); reading and writing text and binary files.
  2. *Structured Data Processing: CSV & JSON:* Reading and writing CSV files with `csv.reader` and `csv.DictReader`; parsing and serializing JSON with `json.loads` and `json.dumps`; handling nested JSON structures; encoding formats (UTF-8).
  3. *Error Handling & Robust Exception Architecture:* Python exception hierarchy; `try`, `except`, `else`, `finally` execution flow; catching specific exceptions (`FileNotFoundError`, `KeyError`, `ValueError`); authoring custom application exceptions.
  4. *HTTP Network Communication & API Consumption:* HTTP protocol review (GET, POST, headers, status codes); making HTTP requests using `httpx` and `requests`; handling query parameters, authentication headers, and JSON responses; timeout handling and retries.
  5. *Automation Scripting & Web Scraping Ethics:* Ethical web scraping principles; parsing HTML with `BeautifulSoup4`; selecting elements via CSS selectors; scheduling automated scripts via system cron / Task Scheduler.
- **Classroom Labs:**
  - *Lab 3.1:* Automated log file parser: scanning a 10,000-line server log file, extracting 404/500 errors with timestamps, and exporting a summary CSV report.
  - *Lab 3.2:* Live REST API integration: querying a public weather or financial API, parsing JSON payloads, and generating an automated email notification.
  - *Lab 3.3:* Ethical web scraper: extracting published product catalog data into structured JSON with polite request throttling.
- **Student Deliverable:** Completion and formal submission of **Portfolio Project 01 (Automated Data Pipeline & ETL Service)**.
- **Assessment:** Practical data transformation lab test and code inspection.

---

### Module 04: Git, Python Tooling, Debugging & Code Quality
- **Duration:** 12 Guided Instructional Hours (Week 07)
- **Primary Tools:** Git, GitHub, `uv`, `Ruff`, VS Code Debugger, `pdb`.
- **Module Purpose:** Inculcate professional engineering hygiene, command-line virtual environment management, lightning-fast linting and formatting with Ruff, professional Git collaboration, and interactive debugging techniques.
- **Main Topics & Subtopics:**
  1. *Modern Package & Environment Management with uv:* The packaging revolution: why `uv` replaces legacy pip/virtualenv; initializing projects with `uv init`; managing dependencies and lockfiles (`uv.lock`); managing multiple Python versions seamlessly.
  2. *Code Quality Automation with Ruff:* PEP 8 style guide; configuring `ruff` for ultra-fast linting and automatic code formatting; enforcing import sorting (`isort`), docstring rules, and catching common anti-patterns; configuring VS Code format-on-save.
  3. *Professional Git & GitHub Workflows:* Git object model; conventional commit messages (`feat:`, `fix:`, `docs:`); branch management (`git switch -c feature/...`); merge vs rebase; resolving merge conflicts; drafting Pull Requests (PRs) with issue templates; `.gitignore` best practices for Python (`__pycache__`, `.env`, `.venv`).
  4. *Debugging Mindset & Interactive Debuggers:* Common Python runtime bugs (AttributeError, TypeError, IndexError); debugging with print statements vs interactive debuggers; using `breakpoint()` and `pdb`; VS Code graphical debugger (breakpoints, watch expressions, call stack navigation).
- **Classroom Labs:**
  - *Lab 4.1:* Setting up a new Python project from scratch using `uv`, adding dependencies, generating a lockfile, and configuring Ruff.
  - *Lab 4.2:* Collaborative Git merge disaster simulation: resolving complex multi-branch merge conflicts and authoring a conventional PR.
  - *Lab 4.3:* Debugging challenge: isolating and fixing 5 deliberate runtime bugs in an unfamiliar codebase using the VS Code debugger.
- **Student Deliverable:** A configured Python project template featuring `uv`, `ruff`, pre-commit hooks, and a clean Git commit history.
- **Assessment:** Practical debugging exam and Git conflict resolution test.

---

### Module 05: SQL, PostgreSQL & ORM Integration
- **Duration:** 14 Guided Instructional Hours (Weeks 08–09)
- **Primary Tools:** PostgreSQL 17, Neon / Supabase, SQLAlchemy 2.0, TablePlus / pgAdmin.
- **Module Purpose:** Master relational database architecture, relational schema design, raw SQL query craftsmanship, transactions, and type-safe database access using modern SQLAlchemy 2.0 ORM.
- **Main Topics & Subtopics:**
  1. *Relational Database Theory & PostgreSQL Architecture:* Relational model fundamentals; tables, columns, rows, data types (INTEGER, VARCHAR, TIMESTAMP, UUID, JSONB); primary keys and foreign keys; referential integrity and cascade rules; 3NF data normalization.
  2. *SQL Query Craftsmanship:* Writing raw SQL queries; DDL (`CREATE TABLE`, `ALTER TABLE`); DML (`SELECT`, `INSERT`, `UPDATE`, `DELETE`); filtering with `WHERE`, `IN`, `LIKE`; sorting and pagination (`ORDER BY`, `LIMIT`, `OFFSET`); aggregations (`COUNT`, `SUM`, `AVG`, `GROUP BY`, `HAVING`); multi-table joins (`INNER JOIN`, `LEFT JOIN`).
  3. *Database Connection & Security:* Connecting Python to PostgreSQL using `psycopg3`; managing connection pools; parameterized queries to eliminate SQL injection attacks; handling database credentials securely via environment variables.
  4. *SQLAlchemy 2.0 ORM Foundations:* What an ORM is; SQLAlchemy 2.0 declarative mapping (`DeclarativeBase`, `Mapped[]`, `mapped_column`); defining entity models; modeling relationships (1:1, 1:N, N:M); session management (`Session`, `scoped_session`).
  5. *CRUD Operations & Database Transactions:* Executing queries with SQLAlchemy (`session.scalars()`, `select()`, `where()`); creating, updating, and deleting records; executing multi-statement atomic transactions with rollback support (`session.commit()`, `session.rollback()`).
- **Classroom Labs:**
  - *Lab 5.1:* Designing and creating a 4-table normalized relational database schema in PostgreSQL via TablePlus.
  - *Lab 5.2:* Writing 10 analytical SQL queries performing multi-table joins, subqueries, and aggregations.
  - *Lab 5.3:* Building an SQLAlchemy 2.0 data layer: mapping Python models to PostgreSQL tables and executing transactional CRUD operations.
- **Student Deliverable:** A tested Python data access module connecting to cloud PostgreSQL, executing queries via SQLAlchemy 2.0 with zero SQL injection risk.
- **Assessment:** Relational schema design review and SQL optimization test.

---

### Module 06: FastAPI & Backend Application Development
- **Duration:** 20 Guided Instructional Hours (Weeks 09–10)
- **Primary Tools:** FastAPI, Pydantic v2, Uvicorn, SQLAlchemy 2.0, Postman / Bruno, Flask, Django.
- **Module Purpose:** Master production-grade backend REST API engineering using FastAPI, Pydantic v2 validation, asynchronous route handlers, and dependency injection, contextualized with comparative lessons on Flask and Django.
- **Main Topics & Subtopics:**
  1. *FastAPI Architecture & Asynchronous Mental Model:* Why FastAPI has become the industry standard; asynchronous I/O with `async`/`await`; running Uvicorn ASGI server; automatic interactive documentation (`/docs` Swagger UI, `/redoc`).
  2. *Routing, Path Parameters & Query Strings:* Creating endpoint routes (`@app.get()`, `@app.post()`, `@app.put()`, `@app.delete()`); path parameters with type validation (`/items/{item_id}`); query parameters for filtering, sorting, and pagination; HTTP status codes.
  3. *Request & Response Validation with Pydantic v2:* Defining request schemas (`BaseModel`); automatic data coercion and validation; custom field validators with `@field_validator`; response schemas (`response_model`) and sensitive data filtering; custom error messages.
  4. *Dependency Injection & Database Integration:* FastAPI's dependency injection system (`Depends`); creating reusable database session dependencies (`get_db`); integrating SQLAlchemy sessions into route handlers; handling transaction lifecycles per HTTP request.
  5. *Modular Application Architecture:* Structuring scalable FastAPI applications: routers (`APIRouter`), controllers, services, models, and schemas; centralized error handling and custom HTTP exceptions (`HTTPException`).
  6. *Python Framework Comparison (FastAPI vs Flask vs Django):* Focused comparative study:
     - *Flask:* Request/response lifecycle, Jinja templates, and when lightweight microservices are appropriate.
     - *Django:* Enterprise Model-View-Template (MVT) architecture, Django ORM vs SQLAlchemy, built-in Django Admin interface, and authentication concepts through practical code walkthroughs.
     - *Synthesis:* Why FastAPI is preferred for modern high-throughput headless APIs while Django excels at rapid monolithic enterprise portals.
- **Classroom Labs:**
  - *Lab 6.1:* Bootstrapping a modular FastAPI application with interactive Swagger documentation and Pydantic validation.
  - *Lab 6.2:* Implementing full CRUD endpoints for a business resource collection backed by PostgreSQL and SQLAlchemy.
  - *Lab 6.3:* Architectural comparison lab: implementing the same simple endpoint in FastAPI, Flask, and Django to compare code ergonomics.
- **Student Deliverable:** A fully functional, documented FastAPI backend service with Pydantic schemas, database persistence, and exported Postman collection.
- **Assessment:** Live API endpoint implementation challenge and Pydantic validation test.

---

### Module 07: Authentication, Security, Testing & Deployment
- **Duration:** 12 Guided Instructional Hours (Week 11)
- **Primary Tools:** Pytest, passlib / bcrypt, PyJWT, Docker, Render / Railway, OWASP guidelines.
- **Module Purpose:** Harden backend services against security vulnerabilities, implement user authentication and role-based authorization, engineer automated test suites with Pytest, containerize with Docker, and deploy to cloud environments.
- **Main Topics & Subtopics:**
  1. *Authentication & Password Security:* Authentication vs authorization; password hashing using `bcrypt` and salt rounds; user registration and login endpoints; issuing and verifying JSON Web Tokens (JWT) with expiration; OAuth2 password bearer flow in FastAPI.
  2. *Role-Based Access Control & Web Security:* Current user dependencies (`get_current_user`); role-based endpoint protection (Admin vs User); mitigating OWASP Top 10 vulnerabilities (SQL injection, XSS, broken access control, CORS configuration, rate limiting).
  3. *Automated Testing with Pytest & TestClient:* Test-driven development principles; configuring `pytest`; writing unit tests; integration testing FastAPI routes using `fastapi.testclient.TestClient`; utilizing Pytest fixtures (`@pytest.fixture`) for database mocking and test isolation.
  4. *Docker Containerization & Production Deployment:* The containerization advantage; authoring a production `Dockerfile` for FastAPI (multi-stage builds, non-root user, minimal base image); building and running Docker containers locally; deploying containerized APIs to cloud platforms (Render / Railway / Fly.io) with production environment variables and SSL.
- **Classroom Labs:**
  - *Lab 7.1:* Implementing a complete JWT authentication flow with password hashing and protected route dependencies in FastAPI.
  - *Lab 7.2:* Authoring a comprehensive Pytest suite testing all CRUD routes, authorization guards, and validation failure responses.
  - *Lab 7.3:* Writing a Dockerfile, building the container image, and deploying a live API to cloud hosting with PostgreSQL.
- **Student Deliverable:** Completion and formal deployment of **Portfolio Project 02 (Production-Grade REST API with FastAPI, PostgreSQL & Pytest)**.
- **Assessment:** Security audit evaluation and automated test execution review.

---

### Module 08: Professional Projects, Portfolio & Capstone
- **Duration:** 12 Guided Instructional Hours (Week 12)
- **Primary Tools:** Git, GitHub, Render / Railway, Loom, Markdown.
- **Module Purpose:** Finalize, document, and polish the 2-project portfolio suite, complete an independent practical coding assessment, and defend the capstone architecture in an oral Viva Voce panel examination.
- **Main Topics & Subtopics:**
  1. *Portfolio Project Polish & Code Quality Audit:* Reviewing codebases for clean architecture, strict type annotations, Ruff formatting compliance, and zero console/debugger artifacts.
  2. *Recruiter-Ready Documentation:* Writing exemplary GitHub `README.md` files: architecture diagrams, setup instructions (`uv sync`), environment variables (`.env.example`), API route tables, and live demo links.
  3. *Independent Practical Coding Assessment:* A 2-hour timed, supervised coding exam where students implement a new backend feature independently without instructor guidance to prove authentic programming capability.
  4. *Technical Interview Preparation & Viva Voce Defense:* Structuring STAR-method technical interview answers; explaining Python memory models, generator mechanics, and REST principles; delivering a 15-minute live oral Viva Voce defense before faculty evaluators.
- **Classroom Labs:**
  - *Lab 8.1:* Peer code review workshop: reviewing peer repositories, auditing security, and submitting pull request reviews.
  - *Lab 8.2:* Technical interview simulation: answering spontaneous oral questions on Python internals, SQL queries, and async execution.
  - *Lab 8.3:* Independent practical coding exam under timed lab conditions.
- **Student Deliverable:** Live deployed portfolio API, public GitHub repositories with exemplary documentation, and successful Viva Voce defense transcript.
- **Assessment:** Capstone Viva Voce defense evaluated against the formal 100-point institutional rubric.

---

## 6. Software-to-Module Competency Matrix

The table below maps each official software tool to its primary and secondary instructional modules:

| Software / Tool | Version | Module 01 | Module 02 | Module 03 | Module 04 | Module 05 | Module 06 | Module 07 | Module 08 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Python** | 3.12 / 3.13 | **PRIMARY** | **PRIMARY** | **PRIMARY** | **PRIMARY** | **PRIMARY** | **PRIMARY** | **PRIMARY** | **PRIMARY** |
| **Visual Studio Code** | Latest | **PRIMARY** | **PRIMARY** | **PRIMARY** | **PRIMARY** | **PRIMARY** | **PRIMARY** | **PRIMARY** | **PRIMARY** |
| **uv** | 0.4+ | Secondary | Secondary | Secondary | **PRIMARY** | **PRIMARY** | **PRIMARY** | **PRIMARY** | **PRIMARY** |
| **Ruff** | 0.6+ | Secondary | Secondary | Secondary | **PRIMARY** | **PRIMARY** | **PRIMARY** | **PRIMARY** | **PRIMARY** |
| **Git & GitHub** | Latest | Secondary | Secondary | Secondary | **PRIMARY** | Secondary | Secondary | **PRIMARY** | **PRIMARY** |
| **httpx / requests** | Latest | — | — | **PRIMARY** | — | — | Secondary | Secondary | — |
| **PostgreSQL** | 17.x | — | — | — | — | **PRIMARY** | **PRIMARY** | **PRIMARY** | **PRIMARY** |
| **SQLAlchemy** | 2.0+ | — | — | — | — | **PRIMARY** | **PRIMARY** | **PRIMARY** | **PRIMARY** |
| **FastAPI** | 0.115+ | — | — | — | — | — | **PRIMARY** | **PRIMARY** | **PRIMARY** |
| **Pydantic** | v2.9+ | — | Secondary | — | — | — | **PRIMARY** | **PRIMARY** | **PRIMARY** |
| **Pytest** | 8.x | — | Secondary | — | — | Secondary | Secondary | **PRIMARY** | **PRIMARY** |
| **Docker** | 26+ | — | — | — | — | — | — | **PRIMARY** | **PRIMARY** |
| **Flask** | 3.0+ | — | — | — | — | — | Exposure | — | — |
| **Django** | 5.1 LTS | — | — | — | — | — | Exposure | — | — |
| **GitHub Copilot / Cursor**| Latest | Supervised| Supervised| Supervised| Supervised| Supervised| Supervised| Supervised| Supervised|

---

## 7. Portfolio Architecture & Two Major Assessed Projects

Every graduate completes **Two Comprehensive Production-Grade Portfolio Projects**, providing verified proof-of-work:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              NOVA SKILLS TWO-PROJECT PORTFOLIO SUITE                                   │
├────────────────────────────────────────────────┬───────────────────────────────────────────────────────┤
│ PROJECT 01: AUTOMATION & DATA                  │ PROJECT 02: PRODUCTION BACKEND CAPSTONE               │
│ Automated Data Pipeline & ETL Service          │ Production-Grade REST API with FastAPI & PostgreSQL   │
├────────────────────────────────────────────────┼───────────────────────────────────────────────────────┤
│ • Python 3.12, pathlib, csv, json, httpx       │ • FastAPI, Pydantic v2, SQLAlchemy 2.0, PostgreSQL    │
│ • Data cleaning, validation, transformation    │ • JWT Authentication & Role-Based Access Control      │
│ • Automated error recovery & structured logging│ • Automated Pytest suite (Unit & Integration)         │
│ • Summary reporting & CSV/JSON export          │ • Dockerfile containerization & Cloud Deployment      │
│ • Developed: Weeks 05–06 (Module 03)           │ • Developed: Weeks 09–12 (Modules 06–08)              │
└────────────────────────────────────────────────┴───────────────────────────────────────────────────────┘
```

---

### 7.1 Project 01: Automated Data Pipeline & ETL Service
- **Commercial Context:** An enterprise business operations data pipeline that automatically ingests heterogeneous data (remote REST API payloads, legacy CSV extracts, JSON files), sanitizes invalid records, transforms data according to business rules, and outputs clean analytical reports with automated email/log alerts.
- **Primary Stack:** Python 3.12+, `pathlib`, `csv`, `json`, `httpx`, `BeautifulSoup4` (optional scraping component), `Ruff`.
- **Core Functional Requirements:**
  1. Ingest data from at least two sources: a public external REST API and a multi-thousand-row CSV data extract.
  2. Implement robust data validation: discarding corrupt records, normalizing date formats, handling missing values, and type-casting numeric fields.
  3. Aggregate metrics: calculating business KPIs (averages, totals, growth rates, categorizations).
  4. Export structured outputs: generating clean summary CSV reports and a structured JSON analytics payload.
  5. Error recovery & logging: capturing network timeouts and file read errors using Python's `logging` module without crashing the pipeline.
- **Deliverables:** Public GitHub repository featuring clean modular scripts, comprehensive docstrings, `.env.example`, sample input/output datasets, and a detailed README with architectural diagrams.
- **Assessment Criteria:** Evaluated across Code Modularity (25%), Data Transformation Accuracy (25%), Error Handling & Logging (25%), and Documentation & Git Hygiene (25%).

---

### 7.2 Project 02: Production-Grade REST API with FastAPI, PostgreSQL & Pytest
- **Commercial Context:** A commercial backend API service (e.g., SaaS Subscription & Billing API, Project & Task Operations Service, or Digital Asset Inventory Platform) requiring secure multi-role access, relational data persistence, automated tests, and containerized cloud deployment.
- **Primary Stack:** FastAPI, Pydantic v2, SQLAlchemy 2.0, PostgreSQL 17 (Neon), `pytest`, `httpx`, passlib/bcrypt, PyJWT, Docker, Render / Railway.
- **Core Functional Requirements:**
  1. **Layered Architecture:** Clear separation between API routers, Pydantic schemas, domain services, and SQLAlchemy database models.
  2. **Relational Data Modeling:** At least 3 interrelated database tables (e.g., Users, Projects, Tasks) with foreign keys and cascade rules.
  3. **Secure Authentication:** User registration, password hashing with bcrypt, JWT token generation with expiration, and current-user dependency injection.
  4. **Role-Based Authorization:** Server-side role verification (Admin vs Member) guarding sensitive modification endpoints.
  5. **Full CRUD & Validation:** Complete CRUD operations with Pydantic v2 input validation, custom error responses, and pagination (`skip`/`limit`).
  6. **Automated Testing:** Minimum 10 automated test cases using `pytest` and `TestClient` covering happy paths, authentication failures, and validation errors.
  7. **Docker & Cloud Deployment:** Production `Dockerfile` and live verified cloud deployment on Render or Railway with managed PostgreSQL.
- **Deliverables:** Public GitHub repository with passing automated test suite, Dockerfile, live cloud API deployment URL, interactive Swagger documentation (`/docs`), exported Postman collection, and Capstone Viva Voce defense transcript.
- **Assessment Criteria:** Evaluated against the formal 100-point institutional assessment rubric.

---

## 8. Independent Practical Coding Assessment & Viva Voce Defense

To guarantee authentic student competence and prevent passive reliance on AI coding tools, certification requires passing two independent evaluation milestones:

### 8.1 Timed Independent Practical Coding Assessment (2 Hours)
- **Format:** Supervised, closed-book coding session conducted in a monitored studio lab.
- **Challenge:** Students are provided with a working FastAPI and SQLAlchemy codebase and given 2 hours to independently implement a discrete new feature (e.g., implementing a new authenticated resource endpoint, adding complex filtering, or writing a custom Pytest test suite) without instructor guidance.
- **Passing Standard:** The implemented feature must pass all automated tests, compile with zero Ruff linting errors, and execute successfully within the allotted time.

### 8.2 Capstone Viva Voce Technical Defense (15 Minutes)
- **Format:** Live oral defense before a panel of Nova Skills faculty evaluators.
- **Structure:**
  - *5 Minutes:* Presentation of Project 02 architecture, database schema, and live deployment demonstration.
  - *5 Minutes:* Line-by-line code walk-through where faculty select arbitrary code sections (e.g., dependency injection, database session management, or password hashing) and require the student to explain the execution mechanics.
  - *5 Minutes:* Spontaneous technical questioning covering Python memory models, generator mechanics, SQL indexing, and security trade-offs.
- **Grading:** Students must demonstrate articulate communication, deep comprehension of their code, and the ability to justify architectural trade-offs.

---

## 9. Learning Outcomes (16 Core Competencies)

Upon successful graduation from the program, students are certified to:
1. Write clean, idiomatic, PEP 8 compliant Python code adhering to modern formatting standards.
2. Design object-oriented systems utilizing classes, encapsulation, inheritance, and special dunder methods.
3. Apply static type hinting to author robust, self-documenting code contracts.
4. Automate filesystem operations, data parsing, and file processing across CSV, JSON, and text formats.
5. Ingest and consume external RESTful APIs asynchronously over HTTP using modern client libraries.
6. Manage Python projects, dependencies, and virtual environments efficiently using `uv`.
7. Enforce automated code quality, formatting, and linting standards using `Ruff`.
8. Collaborate using professional Git workflows, conventional commits, and pull requests.
9. Isolate, diagnose, and resolve runtime errors using interactive debuggers (`pdb` and VS Code debugger).
10. Model normalized relational database schemas adhering to 3NF standards in PostgreSQL.
11. Author performant SQL queries executing multi-table joins, aggregations, and subqueries.
12. Build type-safe database layers using SQLAlchemy 2.0 ORM with atomic transactions.
13. Engineer high-throughput, self-documenting REST APIs using FastAPI and Pydantic v2.
14. Implement secure user authentication with bcrypt password hashing, JWTs, and role-based authorization.
15. Author automated unit and integration test suites using `pytest` to guarantee regression resistance.
16. Containerize Python backend services using Docker and deploy live web APIs to cloud hosting platforms.

---

## 10. Institutional Assessment Model & Grading Rubric

### 10.1 Grading Distribution
Evaluation is competency-based, distributed across three pillars:
- **Continuous Studio Labs (30%):** Weekly practical coding exercises, terminal drills, and Git collaboration milestones.
- **Portfolio Projects (40%):** Project 01 Data Pipeline (15%) and Project 02 Production Backend API (25%).
- **Capstone Viva Voce Defense & Practical Assessment (30%):** Independent Coding Exam (15%) and Oral Defense (15%).

### 10.2 Formal 100-Point Institutional Rubric
```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               NOVA SKILLS INSTITUTIONAL EVALUATION RUBRIC                              │
├──────────────────────────────┬────────┬────────────────────────────────────────────────────────────────┤
│ EVALUATION PILLAR            │ POINTS │ CRITERIA & VERIFICATION STANDARDS                              │
├──────────────────────────────┼────────┼────────────────────────────────────────────────────────────────┤
│ 1. Code Quality & Modularity │ 25 Pts │ Strict PEP 8 adherence via Ruff; clean OOP architecture;       │
│                              │        │ comprehensive type hinting; zero unused variables or dead code.│
├──────────────────────────────┼────────┼────────────────────────────────────────────────────────────────┤
│ 2. Backend & Data Design     │ 25 Pts │ FastAPI route architecture; Pydantic v2 validation;            │
│                              │        │ 3NF PostgreSQL schema; type-safe SQLAlchemy 2.0 transactions.  │
├──────────────────────────────┼────────┼────────────────────────────────────────────────────────────────┤
│ 3. Security & Testing        │ 20 Pts │ Bcrypt password hashing; JWT authentication; RBAC; OWASP       │
│                              │        │ defenses; passing Pytest suite (>= 10 test cases).             │
├──────────────────────────────┼────────┼────────────────────────────────────────────────────────────────┤
│ 4. Deployment & Docs         │ 15 Pts │ Verified Dockerfile; live cloud deployment; recruiter-ready    │
│                              │        │ README with setup instructions, Swagger docs, and ERDs.        │
├──────────────────────────────┼────────┼────────────────────────────────────────────────────────────────┤
│ 5. Viva Voce Oral Defense    │ 15 Pts │ Articulate technical explanation; fluent code walk-through;    │
│                              │        │ mature defense of architectural decisions and trade-offs.      │
├──────────────────────────────┼────────┼────────────────────────────────────────────────────────────────┤
│ TOTAL                        │100 Pts │ Passing Threshold: >= 75 Points with zero critical defects.   │
└──────────────────────────────┴────────┴────────────────────────────────────────────────────────────────┘
```

---

## 11. Target Employment Roles & Realistic Career Reality

### 11.1 Qualified Junior Roles
Graduates are qualified to apply for junior and entry-level engineering positions:
- **Junior Python Developer:** Writing core Python scripts, building internal tools, and maintaining existing codebases.
- **Python Backend Developer (Entry Level):** Authoring FastAPI/Flask endpoints, writing Pydantic validation schemas, and integrating databases.
- **Automation & Scripting Specialist:** Developing ETL scripts, web scrapers, data processing pipelines, and scheduled system automations.
- **Software Engineering Trainee / Intern:** Contributing clean, tested Python code within structured agile software squads.

### 11.2 Truth-in-Education Hiring Reality
- **Realistic Entry Salaries (India Market, October 2026):** Entry-level Python developer salaries range from **INR 3.5 LPA to INR 6.5 LPA**, with specialized product startups offering higher bands based strictly on verifiable GitHub code proof-of-work.
- **Zero Placement Guarantees:** Nova Skills strictly rejects deceptive "100% job guarantees". Hiring decisions in engineering squads depend on public code quality, problem-solving capability, and technical interview performance.

---

## 12. Disciplined AI Coding Integration & Academic Integrity

- **Assessed AI Tools:** GitHub Copilot and Cursor in supervised studio labs.
- **Permitted Accelerations:** Drafting boilerplate functions, generating initial Pytest fixtures, regex explanation, and debugging error tracebacks.
- **Mandatory Student Review:** Students must review every AI-generated suggestion line-by-line, verify type correctness with Pylance, run `ruff check`, execute the Pytest suite, and ensure no secrets or API keys are ever transmitted to external models.
- **Non-Negotiable Boundary:** AI assistance is strictly prohibited during the timed practical exam and oral Viva Voce defense.

---

## 13. Data Protection & Application Security Governance

Every backend application developed in the curriculum must enforce baseline security standards:
- **Zero Secret Leakage:** Database passwords, JWT secret keys, and API tokens must be loaded exclusively via environment variables (`.env`) and excluded from Git using `.gitignore`.
- **SQL Injection Prevention:** 100% of database interactions must utilize parameterized queries via SQLAlchemy 2.0. String concatenation in SQL statements results in immediate assignment failure.
- **Cryptographic Security:** Passwords must be hashed using bcrypt with salt rounds $\ge 10$. Plaintext passwords must never be stored, logged, or returned in API responses.
- **CORS & Rate Limiting:** FastAPI backends must restrict allowed origins to specific authorized client domains and apply rate limiting to authentication endpoints.

---

## 14. Instructor Qualifications & Hardware Requirements

### 14.1 Instructor Competencies
- Minimum 3 years of commercial production software development experience in Python, FastAPI/Flask, and PostgreSQL.
- Demonstrated mastery of modern Python tooling (`uv`, `Ruff`, `pytest`, Docker).
- Ability to conduct live code reviews, facilitate interactive debugging sessions, and evaluate Viva Voce oral defenses.

### 14.2 Student Hardware & Infrastructure Requirements
- **Operating System:** Windows 10/11, macOS (Apple Silicon or Intel), or modern Linux distribution.
- **Hardware Specifications:** Minimum 8GB RAM, 64-bit multi-core processor (Intel Core i3/i5 or AMD Ryzen), 20GB free SSD storage, and reliable broadband internet.

---

## 15. Commercial Policy & Institutional Transparency

- **Approved Tuition Fee:** INR 14,999 (baseline preserved).
- **Statutory Tax Treatment:** In compliance with Indian tax law, 18% statutory GST (INR 2,700) is applicable, resulting in a total payable fee of INR 17,699 with zero hidden administrative charges.
- **Transparent Installment Plans:** Approved 3-month installment options through partner banking providers (approximately INR 5,900 / month) with zero deceptive financing schemes.
- **Elimination of Fake Discounts:** In subsequent data synchronization tasks, the unsubstantiated legacy `originalPrice: 39999` will be normalized to eliminate deceptive discount marketing.

---

## 16. Detailed 12-Week Teaching Progression Schedule

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   12-WEEK INSTRUCTIONAL ROADMAP (120 HOURS)                            │
├─────────┬───────────┬───────────────────────────────────────────────────────┬──────────────────────────┤
│ Week    │ Module    │ Core Instructional Topics                             │ Weekly Lab Milestone     │
├─────────┼───────────┼───────────────────────────────────────────────────────┼──────────────────────────┤
│ Week 01 │ Module 01 │ Python runtime, variables, types, control flow        │ Algorithmic puzzle lab   │
│ Week 02 │ Module 01 │ Lists, dicts, sets, comprehensions, functions, scope  │ In-memory gradebook app  │
├─────────┼───────────┼───────────────────────────────────────────────────────┼──────────────────────────┤
│ Week 03 │ Module 02 │ OOP foundations, classes, encapsulation, properties   │ OOP banking system       │
│ Week 04 │ Module 02 │ Inheritance, dunder methods, dataclasses, type hints  │ Typed domain model       │
├─────────┼───────────┼───────────────────────────────────────────────────────┼──────────────────────────┤
│ Week 05 │ Module 03 │ pathlib, CSV/JSON processing, exception handling      │ Log parsing utility      │
│ Week 06 │ Module 03 │ httpx API consumption, BeautifulSoup scraping, cron   │ Project 01 Submission    │
├─────────┼───────────┼───────────────────────────────────────────────────────┼──────────────────────────┤
│ Week 07 │ Module 04 │ uv project setup, Ruff linting, Git branches, pdb     │ Debugging challenge lab  │
├─────────┼───────────┼───────────────────────────────────────────────────────┼──────────────────────────┤
│ Week 08 │ Module 05 │ Relational theory, 3NF, PostgreSQL, DDL & DML queries │ SQL query sprint lab     │
│ Week 09 │ Module 05 │ SQLAlchemy 2.0 declarative mapping, sessions, CRUD    │ SQLAlchemy data layer    │
├─────────┼───────────┼───────────────────────────────────────────────────────┼──────────────────────────┤
│ Week 10 │ Module 06 │ FastAPI routing, async I/O, Pydantic v2 validation    │ CRUD REST API lab        │
│         │ Module 06 │ Dependency injection, Flask & Django comparisons      │ Framework comparison lab │
├─────────┼───────────┼───────────────────────────────────────────────────────┼──────────────────────────┤
│ Week 11 │ Module 07 │ Bcrypt & JWT auth, OWASP security, Pytest, Docker     │ Containerized API lab    │
├─────────┼───────────┼───────────────────────────────────────────────────────┼──────────────────────────┤
│ Week 12 │ Module 08 │ Portfolio polish, Project 02 deployment,              │ Independent Coding Exam  │
│         │ Module 08 │ technical documentation, and oral Viva Voce defense   │ & Capstone Oral Defense  │
└─────────┴───────────┴───────────────────────────────────────────────────────┴──────────────────────────┘
```

---

## 17. Pre-Implementation Verification Checklist for NOVA-PY-02 through NOVA-PY-07

The following milestones define the execution roadmap for subsequent tasks:
- [ ] **NOVA-PY-02 (Metadata Normalization):** Normalize course metadata, eliminate artificial discounts (`originalPrice: 14999`, `discount: 0`), verify INR 14,999 commercial fee, 3 Months duration, and 120 guided hours.
- [ ] **NOVA-PY-03 (Software Stack Upgrade):** Upgrade canonical tools to Python 3.12/3.13, uv, Ruff, FastAPI, Pydantic v2, SQLAlchemy 2.0, PostgreSQL 17, and Pytest.
- [ ] **NOVA-PY-04 (Modules 01–04 Implementation):** Implement Modules 01–04 (Fundamentals, OOP, File Processing, Tooling & Debugging — 62 Hours total).
- [ ] **NOVA-PY-05 (Modules 05–08 Implementation):** Implement Modules 05–08 (PostgreSQL/SQLAlchemy, FastAPI, Auth/Testing/Docker, and Capstones — 58 Hours total).
- [ ] **NOVA-PY-06 (Student Content & Synchronization):** Finalize 2 major projects, 16 outcomes, 24 institutional FAQs, and synchronize `data.js`, `python-developer.json`, and `nova-skills-109-course-content.json`.
- [ ] **NOVA-PY-07 (Build, Test, Commit & Push):** Recompile `js/data.min.js`, run automated regression audits, commit to development branch, and push to origin.
