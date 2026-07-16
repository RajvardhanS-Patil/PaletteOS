# Scoring Engine: PaletteOS

## Purpose
The Scoring Engine acts as the "Lighthouse" grader. It ingests a palette and outputs a quantifiable score (0-100) based on accessibility, harmony, and structural integrity.

## Responsibilities
- Aggregate data from the Color Engine and Accessibility Engine.
- Calculate an overall "Health Score" for a palette.
- Provide a breakdown of *why* points were deducted.

## Architecture

The Scoring Engine operates as an aggregator. It runs a series of heuristic checks across a given palette array.

### Scoring Criteria (Total 100 Points)
1. **Accessibility (50 points)**
   - Does every foreground color pass WCAG AA (4.5:1) against its background?
   - Do focus states have sufficient contrast?
2. **Harmony (30 points)**
   - Do the hues align mathematically (e.g., on an analogous scale)?
   - Are the saturation levels balanced, or do they clash unpleasantly?
3. **Utility Completeness (20 points)**
   - Does the palette include a clear Primary, Background, and Surface color?
   - Does it include semantic colors (Warning, Error, Success) that are distinguishable?

## Best Practices
- **Deterministic Scoring**: The same palette must ALWAYS yield the exact same score. Do not introduce randomness.
- **Explainability**: A score of `65` is useless without context. The engine must return a payload like: `{ score: 65, deductions: [{ reason: "Primary color fails contrast on Background", points: -15 }] }`

## Risks
- "Harmony" is somewhat subjective. 
  - *Mitigation*: Base the harmony score purely on mathematical color theory (e.g., variance in saturation across a monochromatic scale) rather than subjective aesthetics.

## Developer Notes
- The Scoring Engine should be executed after a user stops dragging a color (debounced), as it requires iterating over the entire palette to recalculate matrices.
