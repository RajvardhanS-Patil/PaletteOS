# Color Engine: PaletteOS

## Purpose
The Color Engine is the mathematical heart of PaletteOS. It is responsible for all color space conversions, palette generation algorithms (harmonies), and color interpolations.

## Responsibilities
- Convert between color spaces (Hex, RGB, HSL, LCH, OKLCH, LAB).
- Generate color harmonies (Monochromatic, Analogous, Complementary, Triadic).
- Interpolate a base color into a 50-900 scale (e.g., Tailwind scale).
- Ensure perceptive uniformness across generated scales.

## Architecture

The engine is built as a set of pure, functional TypeScript utility methods, relying heavily on the **OKLCH** color space to ensure perceptual accuracy (unlike HSL, which has uneven lightness curves).

### Core Functions
1. `generateScale(baseColor, type)`: Takes a base color and generates a stepped scale.
2. `getHarmony(baseColor, rule)`: Returns an array of colors mathematically related to the base on the color wheel.
3. `shiftLuminance(color, percentage)`: Adjusts the L channel in OKLCH to lighten or darken a color accurately without shifting the hue.

## Best Practices
- **Never mutate colors in UI components**. The UI simply requests a color transformation from the engine.
- **Precision**: Math operations should retain high precision during intermediate steps and only round off (e.g., to Hex) at the final output stage.

## Scalability Considerations
- If generating massive themes (e.g., thousands of color nodes), the color engine functions must be memoized or executed within a Web Worker.

## Risks
- HSL to Hex conversion is straightforward, but OKLCH to Hex can result in out-of-gamut colors (colors that screens cannot display). 
  - *Mitigation*: The Color Engine must implement a gamut-mapping algorithm (like `culori` provides) to smoothly map out-of-gamut OKLCH values to the closest displayable sRGB hex code.

## Developer Notes
- Familiarize yourself with the differences between `HSL` and `OKLCH`. Understanding perceptual uniformity is crucial to maintaining this engine.
