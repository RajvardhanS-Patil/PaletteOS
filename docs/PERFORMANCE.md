# Performance: PaletteOS

## Purpose
Ensure that PaletteOS remains highly responsive and fluid, even when executing complex mathematical color calculations or rendering hundreds of color nodes simultaneously.

## Responsibilities
- Maintain a stable 60fps during UI interactions (like dragging color sliders).
- Ensure Time to Interactive (TTI) is under 2 seconds.
- Optimize database queries and AI response times.

## Architecture & Strategies

### 1. Client-Side Rendering Optimization
- **Memoization**: Heavy components (like the contrast matrix table) must be wrapped in `React.memo` to prevent unnecessary re-renders when a single, unrelated state changes.
- **Debouncing**: Color inputs (hue sliders, hex inputs) trigger massive recalculations. The `onChange` event must be debounced (e.g., 50ms) before hitting the Core Engines, while local state updates immediately for visual feedback.
- **Virtualization**: If rendering a massive list of saved palettes, use a library like `@tanstack/react-virtual` to only render items currently in the viewport.

### 2. Computational Offloading
- If the `accessibility-engine` matrix calculations exceed 16ms (causing frame drops) for large palettes, the math MUST be moved to a **Web Worker**. This keeps the main thread unblocked so the UI remains buttery smooth.

### 3. Asset & Network Optimization
- Use Next.js `next/font` for self-hosting and zero layout shift fonts.
- Compress any uploaded images before sending them to the `/api/v1/analyze/image` endpoint.

## Best Practices
- **Bundle Phobia**: Always check the size of a library before adding it to `package.json`. Prefer native browser APIs (like `Intl.NumberFormat`) over heavy libraries.
- **Lazy Loading**: Code-split routes and heavy components (like the Playground previewer) using `React.lazy` or Next.js `dynamic` imports.

## Risks
- The `culori` or `chroma.js` libraries can be large. Ensure we are only importing the specific functions we need (tree-shaking).

## Developer Notes
- During development, frequently run the React Profiler to identify components that are rendering unnecessarily.
- Performance is a feature. A laggy color picker ruins the premium feel of the product.
