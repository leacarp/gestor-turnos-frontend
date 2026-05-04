# Design System Document

## 1. Overview & Creative North Star: "The Digital Architect"

This design system is built upon the concept of **"The Digital Architect."** In a world of cluttered SaaS platforms, we represent the clarity of a blueprint and the tactile luxury of a high-end physical studio. We move beyond "Standard Minimalist" by embracing **Editorial Fluidity**—using deliberate white space, high-contrast typography scales, and a departure from rigid, boxed-in layouts.

Our goal is to create a sense of "breathe-able efficiency." By utilizing intentional asymmetry (e.g., placing a floating `surface_container_lowest` card slightly off-center against a large `display-lg` headline), we signal to the user that this tool is not a generic template, but a precision instrument for professionals.

---

## 2. Colors: Tonal Depth & The Invisible Grid

We prioritize **chromatic harmony** over structural lines. The palette is anchored by deep, authoritative navies and crisp whites, but the "soul" of the UI lies in how we layer these tones.

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders are strictly prohibited for sectioning or containment. Boundaries must be defined solely through background color shifts. 
- A section transition occurs by moving from `surface` (#f9f9ff) to `surface_container_low` (#f2f3fd).
- Content grouping is achieved through proximity and tonal contrast, never through "boxes."

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of frosted glass.
- **Base Layer:** `surface` (#f9f9ff) for the overall page background.
- **Secondary Tier:** `surface_container` (#ecedf7) for large, grouped sections like "Features" or "Pricing."
- **Floating Tier:** `surface_container_lowest` (#ffffff) for high-priority interactive cards or modals. This creates a natural "lift" without relying on heavy shadows.

### The "Glass & Gradient" Rule
To achieve that signature high-end feel:
- **Glassmorphism:** For floating navigation or sidebars, use `surface` at 80% opacity with a `20px` backdrop-blur. 
- **Signature Textures:** Main CTAs should not be flat. Use a subtle linear gradient from `primary` (#0058be) to `primary_container` (#2170e4) at a 135-degree angle to provide "visual weight" and professional polish.

---

## 3. Typography: The Editorial Voice

We use **Inter** as our geometric foundation. The hierarchy is designed to feel like a premium business journal—bold, confident, and highly readable.

- **Display (lg/md):** Used for Hero statements. Large tracking (-0.02em) and tight line-heights (1.1) create an authoritative, "Apple-esque" impact.
- **Headline (lg/md/sm):** Used for section starts. These should always have ample breathing room above and below.
- **Body (lg/md):** Our workhorse. Use `on_surface_variant` (#424754) for long-form text to reduce eye strain, reserving `on_surface` (#191b23) for titles and emphasized text.
- **Labels (md/sm):** Used for micro-copy and tags. Always set in Medium weight to ensure legibility against subtle surface shifts.

---

## 4. Elevation & Depth: Tonal Layering

We reject traditional structural lines in favor of **Tonal Layering**. Depth is a function of light and material, not "outlines."

- **The Layering Principle:** Place a `surface_container_lowest` card on a `surface_container_low` section. The delta in lightness provides a soft, natural lift.
- **Ambient Shadows:** When a card must "float" (e.g., a hover state), use a shadow with a blur of `40px`, a spread of `-10px`, and an opacity of 6%. The shadow color must be a tinted version of `secondary` (#515f77) to mimic natural ambient light.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` token at **15% opacity**. Never use 100% opaque, high-contrast borders.
- **Radius Scale:** 
    - Buttons/Chips: `full` (9999px) for a modern, friendly feel.
    - Product Cards: `xl` (1.5rem) to soften the business aesthetic.
    - Input Fields: `md` (0.75rem).

---

## 5. Components

### Buttons
- **Primary:** Gradient (`primary` to `primary_container`), `on_primary` text, `full` radius.
- **Secondary:** `surface_container_high` background with `primary` text. No border.
- **Tertiary:** Pure text with `primary` color and an animated underline on hover.

### Cards & Lists
- **Rule:** Forbid the use of divider lines. 
- Separate list items using `body-lg` spacing or by alternating background colors between `surface` and `surface_container_low`. 
- Hover states for list items should use a subtle shift to `surface_container_highest`.

### Input Fields
- Use `surface_container_low` as the background. 
- On focus, transition the background to `surface_container_lowest` and apply a 1px "Ghost Border" using `primary` at 30% opacity.

### Additional Signature Component: The "Focus Pane"
For a SaaS context, use a "Focus Pane"—a large `xl` radius container using `surface_container_lowest` that centers the user's primary task, surrounded by a 48px "moat" of `surface` background to eliminate peripheral distraction.

---

## 6. Do’s and Don’ts

### Do:
- **Embrace Asymmetry:** Place a text block on the left and a floating product UI screenshot slightly overlapping into the right margin.
- **Use "White Space as a Feature":** If you think there is enough space, add 20% more.
- **Tint your Neutrals:** Ensure your "greys" (like `secondary`) always have a hint of navy to keep the palette feeling cohesive and premium.

### Don’t:
- **Don't use pure black (#000):** It breaks the sophisticated navy-white harmony. Use `on_surface` (#191b23) instead.
- **Don't use hard corners:** Every interactive element should have at least a `sm` (0.25rem) radius to maintain the "Soft Minimalist" aesthetic.
- **Don't use Dividers:** If you feel the need to draw a line, try adding 32px of vertical space instead.