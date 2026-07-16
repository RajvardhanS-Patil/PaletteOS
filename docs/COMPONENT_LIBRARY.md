# Component Library: PaletteOS

## Purpose
Define the reusable, atomic React components that form the building blocks of PaletteOS. These components must strictly adhere to the `DESIGN_SYSTEM.md` and `UI_GUIDELINES.md`.

## Architecture

We are building a custom component library layered on top of Headless UI primitives (e.g., Radix UI or React Aria) to guarantee baseline accessibility without sacrificing styling control.

### Directory Structure
`/src/components/ui/[Component].tsx`

## Core Components

### 1. `ColorSwatch`
- **Purpose**: Displays a single color block with its Hex/RGB/OKLCH value.
- **Props**: `color` (string), `size` ('sm' | 'md' | 'lg'), `isLocked` (boolean), `onRemove` (function).
- **States**: Default, Hover, Active (Selected), Dragging.
- **Accessibility**: Must include `aria-label` detailing the color name or hex value. Keyboard accessible (Enter to select, Space to lock).

### 2. `ContrastBadge`
- **Purpose**: Displays the WCAG ratio (e.g., `4.5:1`) and a Pass/Fail icon (✅ / ❌).
- **Variants**: `success` (green), `warning` (yellow/orange), `error` (red).
- **Usage**: Used inside the Inspector Panel or overlaying a `ColorSwatch`.

### 3. `Slider`
- **Purpose**: Controls Hue, Saturation, Lightness, etc.
- **Props**: `min`, `max`, `step`, `value`, `onChange`, `label`.
- **Accessibility**: Must use standard `<input type="range">` under the hood or adhere to the `slider` ARIA role with appropriate `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`.

### 4. `CodeBlock`
- **Purpose**: Displays exportable code (Tailwind, CSS, JSON).
- **Props**: `language`, `code`, `showCopyButton`.
- **States**: Shows a brief "Copied!" animation when the copy button is clicked.

### 5. `Button`
- **Purpose**: Standard interactive element.
- **Variants**: `primary`, `secondary`, `ghost`, `destructive`.
- **Sizes**: `sm`, `md`, `lg`, `icon`.

## Component Development Best Practices
- **Composition over Configuration**: Prefer passing `children` to a component rather than creating massive configuration props. 
  - *Good:* `<Card><CardHeader>Title</CardHeader></Card>`
  - *Bad:* `<Card title="Title" hasHeader={true} />`
- **Forwarding Refs**: All base UI components must use `React.forwardRef` to allow animations via Framer Motion or interaction via headless libraries.

## Risks
- Building custom complex components (like Select dropdowns or Dialogs) from scratch is error-prone. 
  - *Mitigation*: Rely on Radix UI primitives for complex accessibility management (focus trapping, keyboard navigation).

## Developer Notes
- The Component Playground (`/features/playground`) will serve as an internal Storybook to test these components in isolation.
