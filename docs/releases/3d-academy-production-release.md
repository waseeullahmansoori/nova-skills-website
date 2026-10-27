# Nova Skills: 3D Academy Production Release Manifest
**Document Version:** 1.0.0  
**Generated Date:** 2026-10-27T19:40:00+05:30  
**Target Release Branch:** `release/3d-academy-2026`  
**Target Production Branch:** `main` (`origin/main`)  
**Production Baseline Commit:** `6a92461256dd690246c0a45d1aa5a0e74b415e52` (`feat(courses): release all completed and approved Nova Skills course redesigns`)  
**Source Development Commit:** `0aeadcf5e408ec21ba09c379a29e46a7ddfafe06` (`feat(3d-academy): redesign 3d visualisation professional for product CGI and animation`)  
**Development Branch:** `transformation/nova-course-redesign`

---

## 1. Executive Release Scope

This release delivers the modern, comprehensive curriculum redesigns for the two flagship career and professional programs within Nova Skills' **3D Animation & VFX Academy** (`3d`):

1. **Course 19: Architectural Visualisation Master** (`archviz-mastery`)
2. **Course 20: 3D Visualisation Professional** (`3d-viz-pro`)

### Scope Summary:
- **Eligible New Courses for Production Release:** **2 Courses**
  - `archviz-mastery`: Modernized to 8 Months, 320 Guided Hours, 17 Modules, 4 Portfolio Projects, INR 69,900.
  - `3d-viz-pro`: Redesigned to 5 Months, 200 Guided Hours, 15 Modules, 1 Integrated Industry Capstone (4 Deliverables), INR 39,900.
- **Preserved Existing Baseline Courses:** **107 Courses**
  - All other 107 courses across No-Code Web, Video & Motion, AI & Automation, Digital Marketing, Programming, Design, etc. remain 100% untouched and preserved from production `origin/main`.
- **Release Strategy:** Isolated Git worktree (`release/3d-academy-2026`) branched from `origin/main` at `6a92461`.
- **Integration Approach:** Selective semantic record integration into shared files (`data.js`, `nova-skills-109-course-content.json`), dedicated course JSON transfer (`data/courses/archviz-mastery.json`, `data/courses/3d-viz-pro.json`), and deterministic rebuild of derived assets (`js/data.min.js`, `_rendered_courses/`, `functions/_rendered_courses.js`, `academies/3d/index.html`, `courses.html`, `sitemap.xml`).

---

## 2. Approved Course Specifications

| Course Name | Canonical ID | Specialization / Focus | Level | Duration | Guided Hours | Approved Selling Price | Modules | Portfolio Projects / Capstones |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Architectural Visualisation Master** | `archviz-mastery` | Architectural Visualization (CAD-to-BIM, Interiors, Exteriors, Real-Time) | Career Mastery | 8 Months | 320h | ₹69,900 | 17 | 4 Portfolio Projects |
| **3D Visualisation Professional** | `3d-viz-pro` | Product Visualization, 3D Advertising & Animation | Professional | 5 Months | 200h | ₹39,900 | 15 | 1 Integrated Capstone (4 Deliverables) |

---

## 3. Detailed Course Specifications & Academic Verification

### Course 19: Architectural Visualisation Master (`archviz-mastery`)
- **Academy:** 3D Animation & VFX Academy (`3d`)
- **Canonical ID:** `archviz-mastery`
- **Level:** Career Mastery
- **Duration:** 8 Months (32 Academic Weeks)
- **Guided Hours:** 320 Guided Hours
  - Monthly Allocation: 40 + 40 + 40 + 40 + 40 + 40 + 40 + 40 = 320h
  - Module Hours: 14 + 26 + 26 + 14 + 12 + 28 + 20 + 20 + 20 + 12 + 8 + 28 + 12 + 18 + 22 + 28 + 12 = 320h
- **Pricing:**
  - Approved Selling Fee: INR 69,900
  - Original Price: INR 69,900 (0% fake discount, honest commercial pricing)
- **Primary Software Stack:**
  - AutoCAD
  - Autodesk 3ds Max 2027
  - Chaos V-Ray
  - Twinmotion 2026.1
- **Supporting Software:**
  - Adobe Photoshop
  - Trimble SketchUp
- **Advanced Exposure:**
  - Epic Games Unreal Engine 5.8
  - Blender 5.1+ (Geometry Nodes, Python Automation, Supervised Blender MCP)
  - Chaos Corona comparisons
  - AI-assisted architectural visualization
- **Four Mandatory Portfolio Projects:**
  1. Photorealistic Residential Interior
  2. Commercial Architectural Exterior
  3. Real-Time Architectural Walkthrough (Twinmotion)
  4. Advanced Real-Time / AI-Assisted Visualization (Unreal Engine 5.8 / Blender)
- **Blender Python & Secure MCP Compliance (Module 15):**
  - Isolated classroom execution
  - Disposable scene files
  - Restricted host privileges
  - Strict human review of generated scripts
  - Zero access to sensitive client files
  - Explicit operator write approval
  - Backup before execution
  - Safe fallback to manual modeling/shading

---

### Course 20: 3D Visualisation Professional (`3d-viz-pro`)
- **Academy:** 3D Animation & VFX Academy (`3d`)
- **Canonical ID:** `3d-viz-pro`
- **Specialization:** Product Visualization, 3D Advertising & Animation
- **Level:** Professional
- **Duration:** 5 Months (20 Academic Weeks)
- **Guided Hours:** 200 Guided Hours
  - Monthly Allocation: 40 + 40 + 40 + 40 + 40 = 200h
  - Module Hours: 12 + 18 + 10 + 18 + 12 + 10 + 12 + 16 + 12 + 18 + 10 + 12 + 10 + 10 + 20 = 200h
- **Pricing:**
  - Approved Selling Fee: INR 39,900
  - Original Price: INR 39,900 (0% fake discount, honest commercial pricing)
- **Primary Software Stack:**
  - Blender 5.1+ (LTS preferred)
  - Cycles
  - EEVEE
- **Supporting Software:**
  - Adobe Photoshop
  - Blackmagic DaVinci Resolve
  - Adobe Substance 3D Painter (where licensed)
- **Advanced Exposure:**
  - Blender Geometry Nodes (Procedural packaging, cable arrays, scatter grids)
  - Blender Python Automation
  - Supervised Blender MCP Integration
  - Generative AI concept & reference generation
  - Selected image-to-3D mesh inspection & clean retopology
- **Mandatory Industry Capstone:**
  - **Complete 3D Product Advertising Package** comprising 4 integrated deliverables:
    1. Hero Product Render (Photorealistic studio lighting & macro detail)
    2. Lifestyle Product Render (In-context environment with depth of field)
    3. Technical Product Image (Orthographic callouts, cutaway/x-ray, exploded view)
    4. 10–20-Second Animated Product Advertisement (Dynamic camera moves, lighting shifts, motion graphics, DaVinci Resolve color finish)
- **Blender Python & Secure MCP Compliance (Module 14):**
  - Isolated classroom execution
  - Disposable scene files
  - Restricted host privileges
  - Strict human review of generated code
  - Zero access to sensitive client assets
  - Explicit operator write approval
  - Backup and restore procedures
  - Fallback workflow when MCP is unavailable
- **Complete Differentiation from ArchViz:**
  - Obsolete architectural references removed from Course 20
  - Architectural CAD, building walkthroughs, and V-Ray primary claims classified as out-of-scope

---

## 4. Release File Scope & Inventory

### Authoritative Course Files to Update:
1. `data/courses/archviz-mastery.json` (Transfer complete approved 17-module specification)
2. `data/courses/3d-viz-pro.json` (Transfer complete approved 15-module specification)
3. `data.js` (Selective semantic transfer of `archviz-mastery` and `3d-viz-pro` records in `NS_COURSES`)
4. `nova-skills-109-course-content.json` (Selective semantic transfer of `archviz-mastery` and `3d-viz-pro` full records)

### Course Specification Documentation:
5. `docs/course-redesign/3d/architectural-visualisation-master-spec.md`
6. `docs/course-redesign/3d/3d-visualisation-professional-spec.md`
7. `docs/releases/3d-academy-production-release.md` (This release manifest)

### Derived Assets to Rebuild via Supported Tooling:
8. `js/data.min.js` (Built via `node scripts/build_min_js.js`)
9. `academies/3d/index.html` (Built via `node scripts/build-academy-pages.js`)
10. `courses.html` (Built via `node scripts/build-courses-page.js`)
11. `_rendered_courses/archviz-mastery.html` (Built via `node scripts/build-course-pages.js`)
12. `_rendered_courses/3d-viz-pro.html` (Built via `node scripts/build-course-pages.js`)
13. `functions/_rendered_courses.js` (Built via `node scripts/build-course-pages.js`)
14. `sitemap.xml` (Built via `node scripts/generate-sitemap.js`)

### Files Explicitly Excluded from Release:
- Experimental scratch files (`scratch/*`, `test-*.js` scratch suites)
- Non-release development scripts
- All 107 other course files in `data/courses/`
- Any unapproved academy changes
