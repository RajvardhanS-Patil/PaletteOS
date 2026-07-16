# Screen Inventory: PaletteOS

## Purpose
This document audits every screen, modal, and state within the PaletteOS platform, serving as the blueprint for layout testing and asset mapping.

---

## 1. Primary Screens

### 1. Landing Page (`/`)
- **Components**: Navigation header, Hero banner with interactive quick-swatch editor, "Why PaletteOS" feature grid, dynamic interactive contrast comparison, Pricing table, Footer links.
- **States**: Default, Scroll, Dark mode.

### 2. User Dashboard (`/dashboard`)
- **Components**: Left sidebar navigation (Projects, Brand Kits, Settings), Top search bar (filter folders), Project card grid, Workspace workspace switcher dropdown, "Create Project" CTA button.
- **States**: Loaded, Empty (no projects), Loading (skeleton placeholders), Error (API timeout).

### 3. Palette Generator Canvas (`/generator`)
- **Components**: Seed color input inputs, harmony type selection dropdown, lock icons, swatch list grid, oklch details overlay, lightness/chroma sliders.
- **States**: Loaded, Generating.

### 4. Palette Analyzer Page (`/analyzer`)
- **Components**: 100-point Grade Card, Contrast pair matrix grid, Color Blindness Impairment filter matrix tabs, APCA validation toggle.
- **States**: Loaded, Warning, Critical contrast.

### 5. Component Playground (`/playground`)
- **Components**: Active mockup viewport (iframe), components checklist sidebar, viewport toggle selectors (light vs dark mode, dashboard vs landing mockups).
- **States**: Loaded, Render error.

### 6. Export Manager Screen (`/export`)
- **Components**: Format selections tab checklist (CSS, Tailwind JS, JSON tokens, SCSS), syntax-highlighted code block card, clipboard action CTA, token download button.
- **States**: Idle, Copied.

### 7. Account Settings (`/settings`)
- **Components**: Account credentials profile panel, Organization WCAG compliance standard overrides (AA, AAA, APCA toggle), Billing status card.
- **States**: Default, Saving changes.

---

## 2. Utility & State Screens

### 8. App Loading Screen (`/loading`)
- **Components**: Minimal central logo overlay with animated gradient stroke.
- **States**: Indeterminate loading state.

### 9. Page Not Found (`404`)
- **Components**: Accessible centered card, "Go Home" CTA, color swatch showing `#404040` (gray) humorously.
- **States**: Static.

### 10. System Error Page (`500`)
- **Components**: Centered card showing warning code, error details block, retry trigger CTA.
- **States**: Static.

### 11. Empty Workspace State
- **Components**: Accessible vector asset, description copy ("No palettes generated yet"), primary color generation CTA button.
- **States**: Static.

## Developer Notes
- Ensure all components are tested against the defined layout constraints. Refer to `SCREEN_INVENTORY.md` when running E2E layout audit scripts (Playwright).
