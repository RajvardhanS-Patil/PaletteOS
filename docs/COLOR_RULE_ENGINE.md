# Color Rule Engine: PaletteOS

## Purpose
This document specifies the rule-based logic of the PaletteOS recommendation engine. It outlines standard heuristics (IF/THEN rules) to detect issues and recommend fixes. This engine operates client-side to provide instant recommendations without requiring a connection to an LLM.

---

## 1. Contrast Remediation Rules

### Rule CR-001: Contrast Failure (Normal Text)
- **Condition**: 
  - `IF` contrast ratio $C$ of text color $T$ on background color $B$ is $< 4.5:1$ (for font size $< 18\text{pt}$ or $< 14\text{pt}$ bold).
- **Remediation**:
  - `THEN` flag standard WCAG AA failure.
  - Determine light/dark relationship:
    - `IF` $L(B) > L(T)$ (Light Background, Dark Text), shift $L(T)$ down by $5\%$ increments in OKLCH until $C \ge 4.5$.
    - `ELSE` (Dark Background, Light Text), shift $L(T)$ up by $5\%$ increments in OKLCH until $C \ge 4.5$.
- **Score Impact**: Deduct 15 points from $S_{\text{contrast}}$.

### Rule CR-002: Contrast Failure (Large Text)
- **Condition**:
  - `IF` contrast ratio $C$ of text color $T$ on background color $B$ is $< 3.0:1$ (for font size $\ge 18\text{pt}$ or $\ge 14\text{pt}$ bold).
- **Remediation**:
  - `THEN` flag WCAG AA Large failure.
  - Apply similar lightness shift rules as CR-001 to reach $3.0:1$.
- **Score Impact**: Deduct 10 points from $S_{\text{contrast}}$.

### Rule CR-003: UI Component Border & Control Contrast
- **Condition**:
  - `IF` border or control component contrast ratio against immediate background is $< 3.0:1$.
- **Remediation**:
  - `THEN` recommend increasing chroma or shifting lightness of the border color to reach $3.0:1$.

---

## 2. Color Harmony Checks

### Rule HR-001: Monochromatic Harmony Variance
- **Condition**:
  - `IF` harmony type is `'monochromatic'` `AND` hue standard deviation $\sigma_H > 5^\circ$ in OKLCH.
- **Remediation**:
  - `THEN` suggest aligning all swatches to match the seed color's exact hue angle $H$.
- **Score Impact**: Deduct 10 points from $S_{\text{harmony}}$.

### Rule HR-002: Complementary Contrast Clash
- **Condition**:
  - `IF` harmony type is `'complementary'` `AND` relative chroma difference $\Delta C < 0.1$ `AND` lightness difference $\Delta L < 0.1$.
- **Remediation**:
  - `THEN` flag "Vibrational Clash Risk" (two highly saturated opposite colors placed directly on top of each other causes eye strain).
  - Recommend desaturating one color by shifting Chroma $C$ down by $15\%$ or increasing Lightness $L$ difference by $20\%$.

---

## 3. UI Component Specific Recommendations

### Rule UI-001: Primary Button Hover State
- **Condition**:
  - `IF` primary button base color $B$ has no hover modifier defined.
- **Remediation**:
  - `THEN` generate hover state color $H_{\text{hover}}$:
    - `IF` $L(B) > 0.5$ (light color), shift Lightness down: $L(H_{\text{hover}}) = L(B) - 0.08$.
    - `ELSE` (dark color), shift Lightness up: $L(H_{\text{hover}}) = L(B) + 0.08$.

### Rule UI-002: Form Field Active Outline
- **Condition**:
  - `IF` form active outline color has a contrast ratio $< 4.5:1$ against the form container background.
- **Remediation**:
  - `THEN` flag focus indicator compliance risk (WCAG 2.4.11).
  - Force active outline to match the primary brand color scale.

### Rule UI-003: Text Inputs
- **Condition**:
  - `IF` placeholder text has contrast ratio $< 4.5:1$ against container background.
- **Remediation**:
  - `THEN` recommend dark grey placeholder text (adjusting opacity to ensure it is distinguishable from filled text while still maintaining $\ge 3.0:1$ placeholder ratio).

---

## 4. Color Blindness (CVD) Safety Rules

### Rule CVD-001: Red/Green Confusion
- **Condition**:
  - `IF` a palette contains a semantic green $G$ and semantic red $R$ `AND` their calculated distance $\Delta E_{94}$ under Deuteranopia simulation is $< 8.0$.
- **Remediation**:
  - `THEN` flag CVD Confusion Risk.
  - Suggest shifting semantic green $G$ towards bluish-green (increase Hue $H$ in OKLCH towards $150^\circ$) and shifting red $R$ towards orange-red (decrease Hue $H$).

---

## 5. Light/Dark Mode Mapping

### Rule LDM-001: Light/Dark Page Contrast Reversibility
- **Condition**:
  - `IF` translating a page theme to Dark Mode `AND` the dark page background $B_{\text{dark}}$ and text $T_{\text{dark}}$ do not achieve reciprocal contrast ratios matching the light theme ($C_{\text{dark}} < C_{\text{light}}$).
- **Remediation**:
  - `THEN` shift $L(B_{\text{dark}})$ down towards $0.05$ and $L(T_{\text{dark}})$ up towards $0.95$.

## Developer Notes
- Write test assertions for all rules in `Vitest` as part of the accessibility audit runner.
- These mathematical evaluations are critical. Keep operations performant to ensure <16ms processing frame times.
