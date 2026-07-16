# Future Features: PaletteOS

## Purpose
Document the long-term vision and potential expansion modules for PaletteOS beyond Phase 4. This ensures current architectural decisions don't block future innovation.

## Explored Concepts

### 1. The Figma Plugin
- **Concept**: A plugin that runs PaletteOS's Scoring and Accessibility engines directly inside Figma.
- **Architecture Requirement**: The Core Engines (`color-engine`, `scoring-engine`, `accessibility-engine`) must remain 100% pure TypeScript with zero DOM/React dependencies so they can be compiled and run inside Figma's UI environment.

### 2. Browser Extension (The Live Auditor)
- **Concept**: A Chrome extension that injects a script into any live website, extracts all CSS color variables, and runs a PaletteOS Lighthouse Audit on the live DOM.
- **Architecture Requirement**: The Accessibility Engine must be able to parse computed CSS styles and evaluate contrast based on actual DOM layering (background over background).

### 3. Automated CI/CD Action
- **Concept**: A GitHub action (`paletteos-action`) that runs on Pull Requests. It parses a project's `tailwind.config.js` or `globals.css` and fails the PR if a developer introduces a color combination that drops the project's overall Health Score below a defined threshold (e.g., 85/100).
- **Architecture Requirement**: The Scoring Engine must be executable as a standalone Node.js CLI tool.

### 4. Enterprise Brand Kits
- **Concept**: Large organizations can lock specific colors. If a designer tries to use a slightly off-brand hex code, PaletteOS auto-corrects it to the nearest approved Brand Token.

## Best Practices for Future-Proofing
- **Strict Modularity**: As reiterated throughout the documentation, the separation of UI (React) and Logic (Engines) is the single most important architectural rule to allow these future features to exist.

## Developer Notes
- If you find yourself writing `window.localStorage` inside a Core Engine, stop. That engine can now no longer run in a Node.js CI/CD environment. Pass data into the engine; do not let the engine fetch data.
