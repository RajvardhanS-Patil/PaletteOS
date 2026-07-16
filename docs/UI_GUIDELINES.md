# UI & UX Guidelines: PaletteOS

## Purpose
Define the interaction paradigms, layout structures, and responsiveness rules for the application.

## Layout Architecture

### Desktop
- **Sidebar Navigation**: Collapsible, left-aligned. Minimal icons.
- **Main Canvas**: The primary workspace (Palette Generator or Analyzer). Takes up 70% of width.
- **Inspector/Context Panel**: Right-aligned. Shows detailed data (Contrast scores, Hex codes, specific tweaks) for the currently selected color or element in the Main Canvas.

### Tablet
- Inspector panel becomes a collapsible drawer on the right.
- Sidebar collapses to icons only.

### Mobile
- **Bottom Navigation**: Replaces the sidebar.
- **Main Canvas**: Stacked vertically.
- **Inspector**: Opens as a Bottom Sheet (Drawer) when a color is tapped.

## Interaction Paradigms

### "Focus Mode"
When a user is tweaking a specific color, the rest of the interface should slightly dim to draw focus to the color controls and the immediate contrast preview.

### "Infinite Canvas" Feel
The Playground component should feel expansive. Use horizontal scrolling or drag-to-pan for wide palettes, rather than squeezing them into a tiny container.

## Best Practices
- **Immediate Feedback**: Any change to a color slider must reflect on the palette and the contrast scores instantly (less than 16ms latency).
- **Undo/Redo**: Crucial for a design tool. Users must be able to hit `Ctrl+Z` to revert a color tweak.

## Scalability Considerations
- The layout must handle a palette of 3 colors just as elegantly as a palette of 20 colors. Use CSS Grid auto-fit/auto-fill for swatch rendering.

## Developer Notes
- Ensure touch targets on mobile (specifically color swatches and sliders) are a minimum of `44x44px` to meet accessibility guidelines.
