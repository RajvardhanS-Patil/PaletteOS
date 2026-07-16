# Development Checklist: PaletteOS

## Purpose
This document provides a set of validation checks that every code modification must pass before it is merged into the `main` branch. This enforces production-grade code quality and prevents regressions.

---

## 1. Code Quality & Formatting
- [ ] Code is written in strict TypeScript with zero `any` declarations.
- [ ] No formatting differences: Run `npx prettier --check .` to ensure files match styling specifications.
- [ ] Linter validation: Run `npm run lint` (ESLint) to ensure zero syntax warnings.
- [ ] Clean of dead code: Unused variables, imports, or dead debug console calls are removed.

## 2. Accessibility (A11y) Compliance
- [ ] Component is keyboard navigable (use `Tab` to select, `Enter` / `Space` to actuate).
- [ ] Visible and distinct `:focus-visible` ring wrapper is implemented.
- [ ] Proper ARIA tags (`aria-label`, `aria-expanded`, `aria-live`) are present and screen-reader testable.
- [ ] Contrast compliance: Verify the element itself achieves WCAG 2.1 AA ($4.5:1$) contrast against background containers.

## 3. Engineering Performance
- [ ] Bundle verification: Gzipped chunk sizes are within standard parameters ($< 150\text{kb}$).
- [ ] Computation thresholds: Color conversion and rendering logic do not freeze UI threads ($< 16\text{ms}$).
- [ ] Layout shift checks: Verify that new modules don't trigger Cumulative Layout Shifts (CLS).

## 4. Test Coverage
- [ ] Unit tests pass: Run `npx vitest run`.
- [ ] Core Engine coverage: All conversions and scoring logic must maintain $\ge 85\%$ statement coverage.

## Developer Instructions
- Copy this checklist and paste it in the PR description whenever submitting code modifications for review.
