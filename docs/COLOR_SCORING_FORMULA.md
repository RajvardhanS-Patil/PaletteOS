# Color Scoring Formula: PaletteOS

## Purpose
This document provides the exact mathematical framework for scoring color systems in PaletteOS. It translates subjective design metrics into deterministic algorithms, ensuring that the overall Health Score (0-100) is reproducible and auditable.

---

## Overall Health Score Calculation

The overall health score $S_{\text{total}}$ is a weighted sum of four key categories:
$$S_{\text{total}} = S_{\text{contrast}} \cdot 0.50 + S_{\text{harmony}} \cdot 0.30 + S_{\text{semantic}} \cdot 0.10 + S_{\text{comfort}} \cdot 0.10$$

Where:
- $S_{\text{contrast}}$: Contrast & Accessibility Score (Max 100) - **Weight: 50%**
- $S_{\text{harmony}}$: Color Harmony Score (Max 100) - **Weight: 30%**
- $S_{\text{semantic}}$: Semantic & Component Coverage Score (Max 100) - **Weight: 10%**
- $S_{\text{comfort}}$: Eye Comfort & CVD Safety Score (Max 100) - **Weight: 10%**

---

## 1. Contrast & Accessibility Score ($S_{\text{contrast}}$)
- **Weight**: 50%
- **Thresholds**: 
  - Pass: Ratio $\ge 4.5:1$ (WCAG AA normal text)
  - Warning: $3.0:1 \le \text{Ratio} < 4.5:1$
  - Fail: Ratio $< 3.0:1$
- **Mathematical Formula**:
  Let $N$ be the count of critical text-background pairings (e.g., text on primary background, body on page background).
  Let $C_i$ be the contrast ratio of pairing $i$.
  Let $P_i$ be the penalty for pairing $i$:
  $$P_i = \begin{cases} 
  0 & \text{if } C_i \ge 4.5 \\ 
  0.5 \cdot \left(1 - \frac{C_i - 3.0}{1.5}\right) & \text{if } 3.0 \le C_i < 4.5 \\ 
  1.0 & \text{if } C_i < 3.0 
  \end{cases}$$
  
  The score is:
  $$S_{\text{contrast}} = 100 \cdot \left(1 - \frac{1}{N} \sum_{i=1}^N P_i\right)$$

---

## 2. Color Harmony Score ($S_{\text{harmony}}$)
- **Weight**: 30%
- **Mathematical Formula**:
  Harmony is measured by analyzing the distribution of colors in the OKLCH color space (Lightness $L$, Chroma $C$, Hue $H$).
  For a target harmony (e.g., monochromatic), we calculate the variance in hue.
  Let $H_j$ be the hue angle of color $j$ in degrees (0-360).
  Let $\bar{H}$ be the mean hue angle.
  Variance $V_H$ is:
  $$V_H = \frac{1}{M} \sum_{j=1}^M (H_j - \bar{H})^2$$
  
  For Monochromatic palettes, the target variance is 0. The penalty scales with $V_H$:
  $$S_{\text{harmony}} = 100 \cdot e^{-\lambda V_H}$$
  Where $\lambda = 0.005$ is a decay coefficient.

---

## 3. Semantic & Component Coverage Score ($S_{\text{semantic}}$)
- **Weight**: 10%
- **Mathematical Formula**:
  Checks if the color system provides necessary UI roles (Success, Info, Warning, Danger, Background, Surface, Text).
  Let $R$ be the number of required system roles (e.g., 7 core roles).
  Let $U_k \in \{0, 1\}$ represent whether semantic role $k$ is defined and passes baseline readability contrast:
  $$S_{\text{semantic}} = \frac{100}{R} \sum_{k=1}^R U_k$$

---

## 4. Eye Comfort & CVD Safety Score ($S_{\text{comfort}}$)
- **Weight**: 10%
- **Thresholds**: 
  - Pass: Distinguishable for all 3 color blindness simulators (Deuteranopia, Protanopia, Tritanopia).
  - Fail: Red/Green combinations that render identical under Deuteranopia simulation.
- **Mathematical Formula**:
  Let $P_{\text{CVD}}$ be the color blindness penalty. We check the Euclidean distance $\Delta E_{94}$ of every pair of colors under CVD simulation. If $\Delta E_{94} < 8.0$ (colors are indistinguishable), a penalty is applied.
  Let $K$ be the number of simulated color pairs:
  $$S_{\text{comfort}} = 100 \cdot \left(1 - \frac{\text{Indistinguishable Pairs}}{K}\right)$$

---

## Scoring Ranges & Status Indicators
- **Overall Score $S_{\text{total}}$ Matrix**:
  - `90 - 100`: **AA+ / Excellent (Pass - Green badge)**
  - `70 - 89`: **A / Fair (Warning - Amber badge)**
  - `0 - 69`: **Critical / Fail (Action Required - Red badge)**

## Developer Notes
- Ensure all intermediate mathematical variables (luminance ratios, CVD matrices) are processed as floats. Round only the final output $S_{\text{total}}$ to the nearest integer.
- Refer to `COLOR_RULE_ENGINE.md` for specific logical transformations applied when a category drops to a "Warning" or "Fail" state.
