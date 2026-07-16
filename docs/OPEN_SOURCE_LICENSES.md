# Open Source Licenses: PaletteOS

## Purpose
This document logs all planned third-party open-source dependencies for the PaletteOS platform. It tracks licenses, advantages, alternatives, and compatibility considerations to prevent licensing conflicts and maintain a clean audit trail.

---

## Dependency Stack Audit

| Package Name | Purpose | License | Advantage | Alternatives Considered | Compatibility |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **react** | Framework core | MIT | Industry standard UI component layout | Vue, Svelte | Excellent |
| **next** | Meta-framework | MIT | Server-side rendering (SEO) & Edge API routes | Vite, Remix | Excellent |
| **typescript** | Strict typing | Apache-2.0 | Complete compile-time type checking | Vanilla JavaScript | Excellent |
| **zustand** | Client state management | MIT | Extremely lightweight, no boilerplate | Redux, Recoil | Excellent |
| **culori** | Color manipulation math | MIT | Superior support for OKLCH, CIELAB color spaces | chroma.js, d3-color | Excellent |
| **framer-motion** | Animation framework | MIT | Snappy physical layouts, layout animations | GSAP, React Spring | Excellent |
| **radix-ui** | Headless accessible primitives | MIT | Out of the box WCAG keyboard accessibility | Headless UI, Custom | Excellent |
| **tailwindcss** | Layout styling | MIT | Rapid styling classes matching theme configs | CSS Modules, Sass | Excellent |
| **zod** | Validation schema | MIT | Synchronous parsing on frontend and backend | Yup, Joi | Excellent |
| **lucide-react** | SVG icon set | ISC | Lightweight, responsive vector SVG components | Heroicons, FontAwesome | Excellent |
| **drizzle-orm** | Database ORM | Apache-2.0 | Lightweight database query operations | Prisma, TypeORM | Edge compatible |

---

## Licensing Guidelines
- **Permitted Licenses**: `MIT`, `Apache-2.0`, `ISC`, `BSD-3-Clause`.
- **Prohibited Licenses**: `GPL-3.0`, `AGPL-3.0` (these copyleft licenses require making our proprietary SaaS application open source, presenting business risk).
- **License Scan**: Our CI pipeline must run an automated audit (`license-checker`) on every build to prevent prohibited packages from entering the codebase.

## Developer Notes
- Before installing any npm package, run `npm info [package] license` to ensure compliance with this register.
