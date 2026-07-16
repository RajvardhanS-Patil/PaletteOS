# Accessibility Engine: PaletteOS

## Purpose
The Accessibility Engine ensures that PaletteOS adheres to its core vision of inclusivity. It runs contrast checks and simulates visual impairments against generated color systems.

## Responsibilities
- Calculate WCAG 2.1 (AA and AAA) contrast ratios between two colors.
- Calculate APCA (Advanced Perceptual Contrast Algorithm - WCAG 3.0 draft) contrast values.
- Simulate Color Blindness (Protanomaly, Deuteranomaly, Tritanomaly, Achromatopsia).

## Architecture

This engine operates entirely client-side using pure mathematical matrices.

### Core Functions
1. `getContrastRatio(color1, color2)`: Returns the standard WCAG relative luminance ratio (e.g., 4.5).
2. `getAPCA(color1, color2)`: Returns the Lc (Lightness contrast) value.
3. `simulateColorBlindness(color, type)`: Applies a transformation matrix to the RGB values to output how the color appears to a specific impairment.

### The Contrast Matrix
When a palette of 10 colors is generated, the engine creates a 10x10 matrix to show the contrast ratio of every color against every other color.

## Best Practices
- **Dual Support**: While APCA is the future, WCAG 2.1 is currently the legal standard. The engine must support and display both metrics.
- **Performance**: A 10x10 matrix is 100 calculations. A 50x50 palette is 2,500 calculations. Matrix generation must be optimized.

## Risks
- Color blindness simulation involves complex matrix multiplication. Rounding errors can lead to inaccurate representations. Ensure high-precision floating-point math is used.

## Developer Notes
- Heavily leverage the `accessibility-compliance-accessibility-audit` skill concepts.
- The output of this engine feeds directly into the `Scoring Engine` and triggers UI warnings (e.g., Red "Fail" badges).
