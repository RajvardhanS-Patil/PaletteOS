# Implementation Roadmap: PaletteOS

## Purpose
This is a living document that tracks the active engineering phases during the development of PaletteOS. It is updated at the completion of every major milestone to coordinate architecture, testing, and deployment.

---

## Active Roadmap Phases

### Phase 1: Foundational setup & Configuration (Current)
- [x] Scaffolding Next.js App Router, TS, and Tailwind CSS.
- [x] Configure path aliases and dependencies (Zustand, Culori, Lucide, Vitest).
- [ ] Create core engineering documents.
- [ ] Configure ESLint, Prettier, and git hooks.

### Phase 2: Core Math Engines
- [ ] Implement `color-engine` (Hex/RGB/HSL/OKLCH conversions, harmony formulas).
- [ ] Implement `accessibility-engine` (WCAG 2.1 contrast matrix, APCA contrast calculations).
- [ ] Implement `scoring-engine` (100-point visual scoring heuristic).
- [ ] Implement `rule-engine` (rem-based remediation guidelines).
- [ ] Establish 85%+ Vitest test coverage on all pure logic.

### Phase 3: Design System Tokens & Base UI Components
- [ ] Setup CSS tokens in `globals.css` mapping primitives to semantics.
- [ ] Build base components (Button, Input, Card, Badge, Dialog, Tabs, Skeleton).
- [ ] Perform keyboard accessibility audits on custom components.

### Phase 4: State Management & Client-Side Routing
- [ ] Construct Zustand slices (`generator`, `analysis`, `settings`).
- [ ] Set up Next.js file-system routes (Landing, Generator, Analyzer, Playground, Settings, 404, 500).
- [ ] Validate E2E client flows via Playwright.

---

## Change Log & Revision History
- **v0.5.0**: Scaffolding initialized, standard dependencies installed, paths absolute aliases verified.

## Developer Notes
- Ensure all logic in Phase 2 is kept pure (framework-independent) to allow potential future Node CLI compilation. Refer to [System Architecture](./SYSTEM_ARCHITECTURE.md) guidelines.
