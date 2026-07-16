# Testing Strategy: PaletteOS

## Purpose
Ensure the reliability, mathematical accuracy, and user experience of PaletteOS through a rigorous, multi-layered testing strategy. As a tool used to validate other developers' code, our own code must be bulletproof.

## Architecture & Layers

### 1. Unit Testing (Vitest)
Unit tests form the bulk of our testing strategy. They are fast, reliable, and crucial for our mathematical engines.
- **Focus**: `COLOR_ENGINE.md`, `SCORING_ENGINE.md`, `ACCESSIBILITY_ENGINE.md`.
- **Requirements**:
  - 100% code coverage on all color conversion functions (e.g., ensuring `hexToOklch` and `oklchToHex` are perfectly reversible).
  - Test boundary conditions (e.g., absolute black, absolute white, out-of-gamut colors).
  - Test the Scoring Engine against known "good" and "bad" palettes to ensure deterministic grading.

### 2. Integration Testing (React Testing Library)
Ensures that components correctly dispatch state to Zustand and re-render accurately when state changes.
- **Focus**: Core UI components (Sliders, Pickers, Modals).
- **Requirements**:
  - Test keyboard navigation (e.g., "Pressing ArrowRight on the hue slider increments the hue by 1").
  - Test accessibility attributes (e.g., ensuring `aria-invalid` is set when an invalid hex code is typed).

### 3. End-to-End Testing (Playwright)
Validates critical user journeys in a real browser environment.
- **Focus**: The "Quick Start" flow and the "Audit & Fix" flow.
- **Requirements**:
  - Simulate a user generating a palette, clicking the AI fix button, and successfully exporting the Tailwind config.

### 4. Visual Regression Testing
- Since PaletteOS is a highly visual tool, we must ensure UI updates don't break the layout. Tools like Percy or Chromatic (if using Storybook) should be integrated into the CI pipeline.

## Best Practices
- **Test-Driven Development (TDD)** for Engines: Write the test for a WCAG calculation *before* writing the calculation logic itself.
- **Mock External Services**: Always mock Supabase DB calls and OpenAI API calls in Unit and Integration tests.

## Risks
- Testing the AI Layer is inherently difficult due to non-deterministic outputs.
  - *Mitigation*: E2E tests for the AI layer should mock the AI response. A separate, scheduled "health check" script can hit the real AI endpoint daily to ensure the prompt structure hasn't degraded.

## Developer Notes
- Run `npm run test:watch` while developing any function inside the `/engines` directory.
