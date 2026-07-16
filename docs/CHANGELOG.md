# Changelog

All notable changes to the PaletteOS project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
