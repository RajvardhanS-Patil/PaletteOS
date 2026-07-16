# Animation Guide: PaletteOS

## Purpose
Define the motion language of PaletteOS. Animations should feel intentional, snappy, and physical, enhancing the "premium SaaS" feel without slowing down the workflow.

## Architecture

We use **Framer Motion** for all complex layout animations and Vanilla CSS `transition` for simple hover states.

### Core Motion Curves
We avoid linear animations. Everything uses physics-based spring animations or customized cubic-beziers.
- **The "Snappy" Spring**: `stiffness: 400, damping: 30` (Used for layout shifts, opening panels).
- **The "Smooth" Curve**: `cubic-bezier(0.32, 0.72, 0, 1)` (Used for hover states, opacity fades).

## Defined Animations

### 1. Hover States (Micro-interactions)
- Buttons slightly scale down on active/click (`scale: 0.97`) to feel tactile.
- Color swatches elevate slightly on hover (`translateY: -2px`) with a subtle glow.

### 2. Layout Transitions
- When the Inspector Panel opens, the Main Canvas smoothly resizes (using Framer Motion's `layout` prop).
- Reordering colors in the generator triggers a smooth layout animation so swatches visually slide past one another rather than snapping instantly.

### 3. State Changes (Success/Error)
- **Success (e.g., Exporting Config)**: A swift, satisfying checkmark animation inside the button.
- **Error (e.g., Contrast Failure)**: A subtle, physical "shake" animation on the failing color node.

## Best Practices
- **Respect "Prefers Reduced Motion"**: All animations must be wrapped in a check for the user's OS-level motion preferences. If true, swap springs for instant snaps or simple opacity fades.
- **Don't Overdo It**: If an animation takes longer than 300ms, it is too slow. The user is here to work, not watch a movie.

## Developer Notes
- Use Framer Motion's `<AnimatePresence>` for mounting/unmounting components (like modals or toast notifications) to ensure they transition out gracefully rather than disappearing instantly.
