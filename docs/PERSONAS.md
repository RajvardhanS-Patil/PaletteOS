# User Personas: PaletteOS

## Purpose
This document outlines user personas for the target audience of PaletteOS. These personas help ground our UX and engineering decisions in real-world user scenarios, workflows, and pain points.

---

### Persona 1: Elena — Senior UI/UX Product Designer
- **Role**: Lead Visual Designer at a mid-sized B2B SaaS startup.
- **Skill Level**: Expert in visual design and layout design; Intermediate in coding terminology.
- **Goals**:
  - Build polished, brand-aligned color systems that feel modern.
  - Deliver layouts that engineers can build without back-and-forth design revisions.
- **Pain Points**:
  - Spent hours manually creating shades (50-950) in Figma.
  - Discovered late in the development cycle that the brand colors fail WCAG AA contrast standards.
- **Workflow**:
  - Researches mood boards -> Picks primary/accent colors in Figma -> Creates components -> Handoff to dev.
- **Needs**:
  - Rapid, beautiful, mathematically accurate palette generator.
  - Real-time previews on typical UI components (buttons, nav, cards) to inspect visual weight.
- **Expected Features in PaletteOS**:
  - Palette Generator (Monochromatic / Analogous).
  - Component Playground / Live Preview.
  - Interactive export directly to Figma token models.

---

### Persona 2: Devona — Senior Frontend Engineer
- **Role**: Tech Lead at a web development agency.
- **Skill Level**: Expert in CSS, TypeScript, React, and build configurations; Basic design eye.
- **Goals**:
  - Maintain clean, standardized code design tokens in a central repository.
  - Support automatic Dark Mode adjustments seamlessly.
- **Pain Points**:
  - Receives sketchy design screenshots with hexadecimal color specs that fail legibility.
  - Manually mapping raw HEX codes into `tailwind.config.js` objects is tedious.
- **Workflow**:
  - Receives Figma files -> Sets up repo configurations -> Builds components -> Fixes code bugs.
- **Needs**:
  - Automated export configurations (Tailwind extensions, CSS variables).
  - Strict mapping validations ensuring no type or syntax errors.
- **Expected Features in PaletteOS**:
  - Export Engine (Tailwind, CSS custom variables).
  - API and Token outputs.

---

### Persona 3: Marcus — Accessibility Specialist / Auditor
- **Role**: Compliance Auditor at a federal agency.
- **Skill Level**: Expert in WCAG 2.1/3.0 regulations; Basic understanding of CSS styling.
- **Goals**:
  - Identify legal compliance risks in public digital properties.
  - Educate teams on remediating contrast issues.
- **Pain Points**:
  - Color validation tools are typically single-input (swatch-by-swatch), making theme audits slow.
  - Current tools fail to simulate color vision deficiency (CVD) overlay conditions accurately.
- **Workflow**:
  - Crawls public pages -> Audits elements using DevTools -> Writes reports -> Advises developers.
- **Needs**:
  - Full Contrast matrix audit (10x10 contrast matrix checks).
  - Simulators mapping real CVD visual transformations.
- **Expected Features in PaletteOS**:
  - Contrast Checker (WCAG 2.1 AAA / APCA scales).
  - Color Blindness Simulator matrix.

---

### Persona 4: Sam — Computer Science Student
- **Role**: University student learning frontend development.
- **Skill Level**: Novice in design; Intermediate in coding.
- **Goals**:
  - Create personal portfolios that look professional and accessible.
- **Pain Points**:
  - Lacks the "design instinct" to pick colors that look cohesive together.
- **Workflow**:
  - Clones templates -> Changes hex codes randomly -> Tests in browser.
- **Needs**:
  - Automated recommendations to suggest matching color combinations.
- **Expected Features in PaletteOS**:
  - Intelligent Rule Recommendations.
  - Preset galleries and Screenshot Analyzer to extract successful designs.

## Developer Notes
- User interfaces must serve Marcus (needs dense regulatory data) and Sam (needs simple presets) gracefully using progressive disclosure. Refer to `UI_GUIDELINES.md` for layout hierarchy details.
