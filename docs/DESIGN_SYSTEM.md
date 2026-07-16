# Design System: PaletteOS

## Purpose
Establish the foundational visual language for PaletteOS. Since PaletteOS is a tool built *for* designers, its own design system must be exemplary, accessible, and visually stunning.

## Architecture & Tokens

Our design system relies on a set of core tokens (CSS Variables) that map directly to Tailwind configuration.

### 1. Typography
- **Primary Font**: `Inter` or `Geist` (clean, highly legible sans-serif for UI).
- **Monospace Font**: `Fira Code` or `JetBrains Mono` (for displaying hex codes, JSON, and CSS snippets).
- **Scale**: Minor Third scale (1.200) starting from a 16px base.

### 2. Spacing
- Based on a strict `4px` grid system. 
- Tokens: `space-1` (4px), `space-2` (8px), `space-4` (16px), `space-8` (32px), `space-16` (64px).

### 3. Radius
- Sharp yet approachable.
- Tokens: `rounded-sm` (4px), `rounded-md` (8px), `rounded-lg` (12px), `rounded-full` (9999px).

### 4. Elevation (Shadows)
- Relying on layered shadows to create depth, mimicking physical lighting rather than flat drop shadows.
- Tokens: `shadow-sm` (buttons), `shadow-md` (cards), `shadow-xl` (modals/dialogs).

### 5. Color Palette (The App's Own Palette)
- **Background (Dark Mode)**: `#09090B` (Zinc-950)
- **Surface**: `#18181B` (Zinc-900)
- **Primary (Accent)**: Highly vibrant Electric Blue or Violet (to contrast against the dark, neutral UI).
- *Note: PaletteOS defaults to Dark Mode to allow generated colors to pop vibrantly.*

## Responsibilities
- Ensure the UI never competes with the user's generated colors. The application chrome must remain strictly neutral (grays/blacks/whites).
- Centralize all design variables in a single `styles/globals.css` file.

## Best Practices
- **No Hardcoded Hex Codes in UI**: Every component must use a Tailwind class (`bg-zinc-900`) or a CSS variable (`var(--surface)`).
- **WCAG AAA for Core UI**: While the app tests for AA, our own UI must strive for AAA contrast wherever text is present.

## Risks
- If the UI is too colorful, it will skew the user's perception of the palette they are generating.

## Developer Notes
- When building a new component, consult the `high-end-visual-design` skill guidelines for layout spacing and typography sizing.
