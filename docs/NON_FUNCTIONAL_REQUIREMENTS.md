# Non-Functional Requirements (NFRs): PaletteOS

## Purpose
This document specifies non-functional constraints for PaletteOS, defining latency limits, security parameters, system availability, caching strategies, and performance benchmarks.

---

## 1. Speed & Latency Targets
- **Interactive Swatch Rendering**: UI shifts on hue dragging must trigger color calculations and render updates within **$16\text{ms}$** (60 frames per second).
- **Page Load Speed**: Overall Largest Contentful Paint (LCP) under **$1.2\text{seconds}$** on fast 3G network conditions.
- **API Edge Latency**: Serverless Edge route functions handling project reads must return responses under **$150\text{ms}$** globally (utilizing regional database replicas or edge cache).

---

## 2. Security & Compliance
- **Authentication**: Gated strictly via Clerk JWT validations on protected endpoints.
- **Database Row Protection**: RLS (Row Level Security) enabled on all Supabase tables, restricting mutations to workspace owner IDs.
- **Input Sanitization**: Raw image parsing and markdown generation sanitized client-side using `DOMPurify` to prevent Cross-Site Scripting (XSS).

---

## 3. Reliability & Availability
- **Platform Availability**: Strive for **99.9%** uptime on production client hosting (handled automatically by Vercel's global CDN network).
- **Database Health**: PostgreSQL connection pools handled via PgBouncer to prevent database locks under concurrent serverless spikes.

---

## 4. Caching & Data Persistence
- **Client Cache**: Use `SWR` or `React Query` configuration presets to cache GET API requests locally (max-age 5 minutes).
- **Local Sandbox Storage**: Unauthenticated user state synced to client browser `localStorage` to allow offline continuity.

## Developer Notes
- Ensure all Next.js API routes implement rate limits to protect Vercel compute limits. Refer to `PERFORMANCE.md` for specific browser rendering techniques.
