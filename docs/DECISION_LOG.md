# Decision Log (Architectural Decision Records): PaletteOS

## Purpose
This document serves as our central Architectural Decision Record (ADR) log. It tracks critical technology choices, trade-offs, and justifications to maintain context as the team scales.

---

## ADR-001: Selection of Next.js App Router over Vite Single Page App (SPA)

### Context
We need to select the primary framework structure for PaletteOS. The application includes public marketing pages (landing, SEO hubs, guides) and an interactive SaaS web application dashboard.

### Alternatives Considered
1. **Vite SPA**: Simple, fast, client-side only. Very lightweight bundle size.
2. **Next.js (App Router)**: Server-side rendering (SSR), static site generation (SSG), built-in edge route APIs, out-of-the-box SEO optimizations.

### Decision
- **Next.js App Router**.

### Justification
- **SEO is critical**: To achieve the vision of "Lighthouse for Colors", public pages (contrast checkers, theme galleries) must rank highly on Google. Vite SPAs are difficult to optimize for SEO search indexing.
- **Integrated Backend**: Next.js route handlers allow us to run serverless edge APIs (AI, db transactions) in a unified project repository, avoiding the overhead of maintaining a separate Node.js server.

---

## ADR-002: Using Culori over Chroma.js for Color Math

### Context
PaletteOS requires high-precision color conversions, shade interpolations, and gamut mapping, with a strong focus on the OKLCH color space.

### Decision
- **Culori**.

### Justification
- **OKLCH Support**: Culori has excellent native support for OKLCH, while Chroma.js requires extensions and has known gamut mapping inconsistencies.
- **Tree-Shaking**: Culori is modular, allowing us to import only the conversion logic we need, maintaining a small bundle size.

---

## ADR-003: Zustand over Redux Toolkit for State Management

### Context
The application needs to share palette states, layout selections, and user configurations across nested views (generator, analyzer, playground).

### Decision
- **Zustand**.

### Justification
- **Zero Boilerplate**: Zustand stores are simple hooks, reducing the setup overhead compared to Redux slice boilerplate.
- **Performance**: Standard Redux triggers re-renders on context changes. Zustand allows granular subscription selectors, keeping interactive color dragging buttery smooth at 60fps.

## Developer Notes
- Refer to this log when proposing major architectural changes in PR reviews.
