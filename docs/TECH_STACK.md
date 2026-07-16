# Tech Stack: PaletteOS

## Purpose
Define the core technologies and frameworks utilized to build, deploy, and maintain PaletteOS.

## Core Technologies

### Frontend
- **Framework**: React 18+
- **Meta-Framework**: Next.js (App Router) or Vite (SPA). *Decision pending based on SEO requirements. For a SaaS tool, Vite is often sufficient, but Next.js offers better API route integration.* Let's default to **Next.js**.
- **Language**: TypeScript (Strict mode enabled)
- **Styling**: Tailwind CSS + Vanilla CSS (for custom variables/tokens).
- **State Management**: Zustand
- **Animations**: Framer Motion (for fluid micro-interactions)

### Backend (Serverless)
- **API**: Next.js Route Handlers
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM or Prisma (Drizzle preferred for edge compatibility and speed).

### Color & Math Libraries
- **Color Manipulation**: `culori` or `chroma.js` (Culori preferred for excellent OKLCH support and accurate color math).
- **Accessibility**: Custom engine based on WCAG 2.1 & 3.0 APCA formulas.

### Authentication
- **Provider**: Clerk or Supabase Auth (Clerk preferred for seamless B2B/B2C drop-in UI).

### Testing
- **Unit Testing**: Vitest + React Testing Library
- **E2E Testing**: Playwright

## Best Practices
- **Strict Typing**: No `any` types allowed in the codebase. Strict TypeScript configurations must be enforced.
- **Dependency Minimization**: Do not install a library if the functionality can be easily written as a 50-line utility function (e.g., simple date formatting).

## Scalability Considerations
- Next.js allows us to easily scale API routes independently of the static frontend.
- Supabase provides a scalable connection pooler (PgBouncer) out of the box, necessary for serverless environments.

## Future Improvements
- Migration of heavy color generation scripts into WebAssembly (Rust/WASM) if JS performance becomes a bottleneck on mobile devices.

## Developer Notes
- All UI components should be built utilizing the selected tech stack avoiding ad-hoc styling. Stick to Tailwind classes and the defined Design System.
