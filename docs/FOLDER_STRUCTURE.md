# Folder Structure: PaletteOS

## Purpose
Define a highly scalable, maintainable, and predictable folder architecture suitable for a production-grade React + TypeScript SaaS application. 

## Architecture

We are adopting a feature-based / module-based folder structure combined with strict layer separation.

```text
/
├── .github/                  # CI/CD Workflows
├── docs/                     # Project documentation (You are here)
├── public/                   # Static assets (images, fonts, favicon)
├── src/                      # Source Code
│   ├── app/                  # Application routing (Next.js App Router style or React Router config)
│   ├── assets/               # Local media and global CSS
│   ├── components/           # Shared, dumb UI components (Design System)
│   │   ├── ui/               # Base elements (Buttons, Inputs)
│   │   ├── layout/           # structural elements (Navbar, Sidebar)
│   │   └── shared/           # Cross-feature complex components
│   ├── engines/              # CORE LOGIC (The Brains)
│   │   ├── color/            # Math, conversions, generation
│   │   ├── accessibility/    # WCAG testing, color blindness
│   │   ├── scoring/          # Analytical grading logic
│   │   └── ai/               # Prompt management and API calls
│   ├── features/             # Feature-specific modules
│   │   ├── palette-generator/
│   │   ├── analyzer/
│   │   └── playground/
│   ├── hooks/                # Global custom hooks
│   ├── lib/                  # Third-party wrappers (Axios, Supabase client, etc.)
│   ├── store/                # State management (Zustand)
│   ├── styles/               # Global design tokens, variables, Tailwind config dependencies
│   ├── types/                # Global TypeScript definitions
│   └── utils/                # Small, pure helper functions
├── .eslintrc.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Best Practices
- **Feature Encapsulation**: A feature inside `/features` should contain its own specific components, hooks, and utilities. Do not pollute the global `/components` folder with feature-specific UI.
- **Engine Purity**: Files inside `/engines` must be pure TypeScript (no React dependencies). This ensures they can be easily tested, moved to a Web Worker, or extracted into a Node.js backend if necessary.

## Scalability Considerations
- As the app grows, the `/features` directory prevents the global directories from becoming bloated.
- Pure `/engines` allow for easy migration to Edge functions (e.g., Cloudflare Workers or Vercel Edge) to speed up heavy computations.

## Developer Notes
- When adding a new piece of logic, ask: "Is this specific to a UI feature, or is it core color science?" If the latter, it belongs in `/engines`.
