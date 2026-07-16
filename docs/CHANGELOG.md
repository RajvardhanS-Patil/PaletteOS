# Changelog

All notable changes to the PaletteOS project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-07-17

### Added
- **Design System Auditing & Brand Consistency**: Added polar coordinate hue drift detection (BR-001), focus state visibility audits (UI-002), and disabled states balance audits (UI-003).
- **Interactive tabbed Analyzer layout**: Replaced page layout with 4 responsive workspace view tabs.
- **Version history comparisons**: Added save checkpoint actions to history logs, delta visualizer, and rollback restore functions.
- **Printable Audit Reports**: Created styled print-ready HTML/PDF summaries hiding navigation side-menus automatically when printing.

## [1.3.0] - 2026-07-17

### Added
- **Accessibility Auto-Fix Engine**: Built an in-app contrast auto-fixer shifting failing swatches dynamically in OKLCH color space while preserving original hue/chroma values.
- **Dynamic System Neutrals**: Refactored evaluation pipelines to use dynamic text and background system color sets mapped to the active dark/light mode preference.
- **Expanded Audit Rules**: Added brand accent contrast verification (CR-002) mapping base swatches S6 against theme backgrounds.
- **Auto-Fix Dashboard Indicators**: Added side-by-side visual difference swatches and apply action triggers inside the recommendations cards.

## [1.2.0] - 2026-07-17

### Added
- **Command Palette (`Cmd+K`)**: Global command search list matching Radix Dialog triggers, mapping navigation pathways, settings overrides, and direct HEX seeds values sets.
- **Sized Website Preview Viewports**: Expanded Component Playground with mock sidebar/dashboard layouts and Mobile (375px), Tablet (768px), and Desktop viewport bezel frame modes.
- **Universal Exporters & Downloads**: Added SCSS, Flutter, SwiftUI, and Jetpack Compose file generators, syntax validations, and direct download blob triggers.
- **In-App Documentation Viewer**: Server-side file reader rendering workspace specifications `/docs/*.md` safely.

## [1.1.0] - 2026-07-17

### Added
- **LocalStorage State Persistence**: Zustand `persist` middleware integrated to recover active sandbox seed, lock configurations, and targets automatically.
- **Screenshot Analyzer Extractor**: Canvas manipulation downscaler and K-Means clustering algorithm extracting dominant colors client-side.
- **Playground Verification Extensions**: Dynamic contrast warning badges checking text-on-surface readability in real-time, plus text size/weight simulation selectors.
- **Dashboard Workspace Folder Sync**: Saved project folders categories stored in localStorage.

## [1.0.0] - 2026-07-17

### Added
- **Core Math Engines**: Complete pure TypeScript color space conversion modules (Hex, RGB, HSL, HSV, LAB, LCH, OKLAB, OKLCH, XYZ65).
- **Accessibility & Grading**: WCAG 2.1 and APCA contrast ratio calculation models and real-time matrix builder.
- **Scoring & Heuristic Logic**: 100-point algorithmic evaluation checking harmony, visual balance, CVD safety, and contrast.
- **Rule Engine Recommendations**: Rule-based logic (IF/THEN overrides) suggesting safety contrast and red/green confusion adjustments.
- **Design System & Components**: Styled variables in `globals.css` with accessibility elements (Button, Input, Card, Badge, Dialog, Tabs, Skeleton).
- **Client Routing Pages**: Layout configurations and routing paths (Landing, Sandbox Canvas, Analyzer, Playground, Export, Dashboard, Settings, Profile, 404, 500).
- **Vitest Unit Tests**: Over 26 unit tests covering all core engine calculations and Zustand store state changes.
- Comprehensive architecture and planning documentation suite (`/docs`).
- Initialized core repository structure.

---
*Note: As development begins in Phase 1, this changelog will be updated following standard commit conventions (`feat:`, `fix:`, `chore:`).*
