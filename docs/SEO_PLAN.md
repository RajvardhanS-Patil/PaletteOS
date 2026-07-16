# SEO Plan: PaletteOS

## Purpose
Ensure that PaletteOS is highly discoverable on search engines, driving organic traffic from developers and designers searching for color tools, accessibility checkers, and design system generators.

## Architecture

We rely on Next.js (Server-Side Rendering / Static Site Generation) for public-facing pages to ensure crawlers can easily index content.

### Target Keywords
- "WCAG color contrast checker"
- "accessible color palette generator"
- "Tailwind color theme generator"
- "color blindness simulator online"

### URL Structure
- `/` - Landing Page (Targeting broad "color palette generator" keywords).
- `/contrast-checker` - Dedicated tool page for high search volume keywords.
- `/palettes/` - Public gallery of user-generated, highly rated palettes (e.g., `/palettes/cyberpunk-neon`).

## Responsibilities
- **Dynamic Meta Tags**: Every public palette page must have unique `<title>`, `<meta name="description">`, and Open Graph (OG) tags based on the colors in the palette.
- **OG Images**: Automatically generate Open Graph images for shared palettes (showing the colors in the image itself) via `@vercel/og`.

## Best Practices
- **Semantic HTML**: Ensure perfect heading hierarchy (H1, H2, H3). The `accessibility-engine` ensures the UI is accessible, which also highly correlates with good technical SEO.
- **Sitemaps & Robots**: Automatically generate a dynamic `sitemap.xml` for all public palette routes.

## Risks
- If PaletteOS is built purely as a Vite SPA (Client-Side Rendered), SEO performance will severely degrade. This is why Next.js App Router is the preferred architecture for the public marketing pages.

## Developer Notes
- Leverage the `frontend-seo` skill guidelines.
- Always include an `aria-label` or `alt` text for color swatches if they convey meaning.
