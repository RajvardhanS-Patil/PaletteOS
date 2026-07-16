# Feature Specifications: PaletteOS

## Purpose
This document provides exact technical specifications for the core features of PaletteOS. It details inputs, outputs, validation parameters, states, edge cases, and developer notes for each module.

---

## 1. Palette Generator

### Purpose
Allows users to create a full color palette based on a primary seed color, choosing from standard color harmony rules.

### Mechanics & Specifications
- **Inputs**:
  - `seedColor`: Hex, RGB, HSL, or OKLCH string. Must validate as a color.
  - `harmonyType`: `'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'split-complementary'`.
  - `steps`: Integer, range 3 to 12. Default is 5.
- **Outputs**:
  - `palette`: Array of objects containing `{ hex: string, oklch: string, name: string, isLocked: boolean }`.
- **States**:
  - `Empty`: Default state with no seed color. Shows seed input panel.
  - `Generating`: Recalculating arrays (typically instant, <16ms).
  - `Rendered`: Renders swatches with option to lock, edit, or swap values.
- **Edge Cases**:
  - *Out-of-Gamut values*: Seed color falls outside target sRGB gamut when calculated in OKLCH.
    - *Remediation*: The Color Engine maps the values to the closest displayable sRGB hex code.
- **Validation Rules**:
  - Input seed color must match a standard regex for color formats (hex, HSL, RGB).
- **Error Cases**:
  - `ERR_INVALID_COLOR`: Display feedback border around seed input.

---

## 2. Palette Analyzer

### Purpose
Audits a complete palette, assigning a global Health Score and highlighting contrast and harmony issues.

### Mechanics & Specifications
- **Inputs**:
  - `palette`: Array of colors (minimum 2, maximum 24).
- **Outputs**:
  - `overallScore`: Integer (0-100).
  - `harmonyScore`: Integer (0-30).
  - `contrastScore`: Integer (0-50).
  - `utilityScore`: Integer (0-20).
  - `deductions`: Array of `{ reason: string, penalty: number, selector: string }`.
- **States**:
  - `Loading`: Recalculating score.
  - `Audited`: Renders global score, category grades, and improvement buttons.
- **Edge Cases**:
  - *Identical Colors*: User inputs a palette containing duplicates.
    - *Remediation*: Flag duplicates in a warning card; exclude duplicates from harmony calculations to avoid skewing weights.

---

## 3. Contrast Checker (Accessibility Checker)

### Purpose
Calculates relative luminance contrast ratios for every color pairing in the palette to verify WCAG and APCA compliance.

### Mechanics & Specifications
- **Inputs**:
  - `palette`: Array of colors.
- **Outputs**:
  - `matrix`: Two-dimensional array mapping each color against all others.
  - Value: `{ wcagRatio: number, wcagGrade: 'AAA' | 'AA' | 'AA Large' | 'Fail', apcaLc: number }`.
- **Edge Cases**:
  - *Luminance equivalence*: Text and background have the same color (e.g., `#ffffff` on `#ffffff`), division-by-zero risk.
    - *Remediation*: Explicit fallback check returning `1.0` ratio.
- **Validation Rules**:
  - Must evaluate against standard WCAG 2.1 threshold: `4.5:1` for normal text, `3.0:1` for large text, and APCA Lc thresholds.

---

## 4. Color Blindness Simulator

### Purpose
Applies digital filters to colors to simulate Deuteranopia, Protanopia, Tritanopia, and Achromatopsia.

### Mechanics & Specifications
- **Inputs**:
  - `hexColor`: Hex code string.
  - `impairmentType`: `'deuteranopia' | 'protanopia' | 'tritanopia' | 'achromatopsia'`.
- **Outputs**:
  - `simulatedHex`: The color as seen by the user.
- **Technical Logic**:
  - Employs Brettel's mathematical projection algorithm using RGB matrices.
- **Performance**:
  - Simulated values must be computed client-side in a fast mapping loop to prevent rendering lag.

---

## 5. Screenshot Analyzer

### Purpose
Extracts dominant colors from user-uploaded screenshots to quickly reverse-engineer color systems.

### Mechanics & Specifications
- **Inputs**:
  - File upload (`image/png`, `image/jpeg`) or clipboard input.
- **Outputs**:
  - Array of 5-10 extracted dominant Hex colors.
- **Technical Logic**:
  - Draw image onto a hidden `<canvas>` context, extract pixel data, and run a **k-Means clustering** or **Median Cut** quantization algorithm client-side.
- **Validation Rules**:
  - File size limit: 5MB. Must be raster image formats.
- **Edge Cases**:
  - *Monochromatic Images*: Returns too few clusters.
    - *Remediation*: Pad results with monochromatic light/dark variations if clusters < 5.

---

## 6. Component Playground (Live Preview)

### Purpose
Previews palettes in real-time on typical UI components (Buttons, Navbars, Cards, Charts, Forms) to see visual hierarchy and contrast in practice.

### Mechanics & Specifications
- **Inputs**:
  - `palette`: Active color object mapping (e.g., `primary`, `secondary`, `neutral`, `bg`, `surface`).
  - `mode`: `'light' | 'dark'`.
- **Outputs**:
  - Live iframe or DOM container rendering pre-designed interactive mockups styled dynamically via inline CSS custom variables.
- **Validation**:
  - Re-checks contrast ratios of rendered component text on-the-fly and displays warning badges next to components failing the test.

---

## 7. Theme Generator

### Purpose
Expands a single primary brand color into a full semantic UI theme including primary, secondary, backgrounds, borders, and status colors.

### Mechanics & Specifications
- **Inputs**:
  - `brandPrimaryHex`: String hex.
- **Outputs**:
  - Standardized UI Theme object mapping:
    - Primary Scale (50-950)
    - Neutrals (Zinc/Gray equivalent matching primary saturation)
    - Semantic validation states (Success, Danger, Warning, Info).
- **Edge Cases**:
  - *Extremely saturated seed*: Leads to jarring, eye-straining semantic scales.
    - *Remediation*: Desaturate status base seeds automatically during calculations.

---

## 8. Export Engine

### Purpose
Outputs the generated color codes into multiple design and development formats.

### Mechanics & Specifications
- **Inputs**:
  - Current palette state.
  - Target format: `'css-vars' | 'tailwind' | 'design-tokens-json' | 'scss' | 'flutter' | 'swift'`.
- **Outputs**:
  - Pure string block containing the formatted code.
- **Actions**:
  - "Copy" writes the string to system clipboard.
  - "Download" triggers a raw file download (e.g., `theme.json` or `tailwind.config.js`).

---

## 9. Projects & Dashboard

### Purpose
Allows authenticated users to organize palettes into project folders, tag workspaces, and track revision history.

### Mechanics & Specifications
- **Inputs**:
  - Database entries for Projects and Palettes.
- **States**:
  - `Empty`: Show empty-state illustration prompting the user to generate their first palette.
  - `Loading`: Skeleton frames mapping existing project cards.
  - `Fetched`: Cards showing palette previews, overall health scores, and metadata.

---

## 10. Authentication

### Purpose
Ensures secure creation and sync of user accounts.

### Mechanics & Specifications
- **Provider**: Clerk Auth.
- **Onboarding Integration**:
  - Clerk React middleware gates private paths (`/dashboard`).
  - On user creation, webhook triggers Supabase row mapping.

---

## 11. Settings & Profile

### Purpose
Allows users to configure application preferences, dark mode defaults, default export formats, and system constraints.

### Mechanics & Specifications
- **Inputs**:
  - User options. Saved to DB profiles and local client state.
- **Settings Options**:
  - Default Contrast Standard: `WCAG 2.1 AA` (default) vs `WCAG 2.1 AAA` vs `APCA`.
  - Default Color Blindness Filter overlay: `None` vs selected impairment.

---

## 12. Future AI Assistant

### Purpose
Conversational optimization of color systems ("Make the primary safer," "Create a warm dashboard theme").

### Mechanics & Specifications
- **Inputs**:
  - Chat text prompt.
  - Current palette state.
- **Outputs**:
  - JSON response containing the suggested colors and text explanations.
- **Error Cases**:
  - *Invalid JSON returned by LLM*: The engine catches parsing errors and requests a clean retry, or falls back to nearest safe mathematical rules.

## Developer Notes
- Feature specs are strict contracts. Ensure code changes in `/features` meet the requirements defined here.
- Refer to `ERROR_CATALOG.md` for error codes associated with validation errors.
