# Azure Meridian Design System

### 1. Overview & Creative North Star
**Creative North Star: "The Architectural Concierge"**
Azure Meridian is a high-end editorial design system built for professional services. It moves away from the "software-as-a-tool" aesthetic and toward a "software-as-a-service-environment." By utilizing a split-screen vertical architecture and heavy, expressive typography, it creates a sense of reliability and premium craftsmanship. It breaks standard layouts through intentional asymmetry: a dense, rich-colored narrative sidebar contrasted with an expansive, airy, and clinical workspace.

### 2. Colors
Azure Meridian uses a "Deep Sea" palette anchored by high-contrast whites and deep navy tones.
- **Primary Roles:** The primary color (`#003256`) is used for structural grounding and brand presence. 
- **The "No-Line" Rule:** Sectioning is achieved through color-blocking rather than borders. For example, the sidebar uses a solid Primary block, while input fields use `surface_container_low` (`#f3f4f5`) to sit "inside" the `surface`. No 1px lines should separate major sections.
- **Surface Hierarchy:** 
    - `surface`: Pure white (`#ffffff`) for the main interaction area.
    - `surface_container_low`: Used for input field backgrounds to provide "well" depth.
    - `surface_container_high`: Used for decorative placeholders and map backgrounds.
- **Glass & Gradient Rule:** Navigation and CTA elements (like the main "Continuar" button) utilize a 135-degree gradient from `primary` to `primary_container` to suggest tactile depth.

### 3. Typography
The system uses a pairing of **Manrope** (Headlines) and **Inter** (Body/Labels).
- **Display & Headline:** Manrope at `2.25rem` (36px) is used for primary screen titles to establish an authoritative voice. It features extra-bold weights and tight tracking (-0.02em).
- **Body:** Inter provides a neutral, high-legibility foundation at `1.125rem` (18px) for subheadings and `1rem` for general text.
- **Labels:** Uppercase labels at `0.875rem` (14px) with wide tracking (0.1em) create a "Forms & Documents" feel, reminiscent of high-end architectural plans.
- **Metric Scale:** Grounded in the extracted values: `2.25rem` (H1), `1.875rem` (H2), `1.25rem` (Title), `1.125rem` (Large Body), `0.875rem` (Label), and `10px` (Micro-navigation).

### 4. Elevation & Depth
Depth is created through tonal layering and specific lighting effects rather than traditional Material shadows.
- **The Layering Principle:** The sidebar acts as the "Base Layer," with the main content acting as the "Active Layer" shifted to the right. 
- **Ambient Shadows:** Standard UI components use `shadow-lg` for subtle lift. Primary CTAs use `shadow-xl` with a colored tint (`shadow-primary/10`) to create a soft glow effect rather than a gray shadow.
- **Glassmorphism:** Mobile navigation bars use a `backdrop-blur-xl` with 80% opacity to maintain a sense of the content behind while establishing a fixed control point.

### 5. Components
- **Buttons:** Primary buttons are "Pill" shaped (rounded-full) with a signature gradient (`#003256` to `#00497a`) and no border. Secondary buttons are text-only with leading icons.
- **Inputs:** Large, padded fields (`px-6 py-4`) with `rounded-xl` (12px) corners. Backgrounds are `surface_container_low`. Focus states do not use borders but instead a `ring-2` focus ring at low opacity.
- **Bento-style Grid:** Form fields should be grouped in a grid with `gap-6` (24px) spacing, allowing fields to span 1 or 2 columns based on importance.
- **Progress Tracker:** Vertical orientation in the sidebar using high-contrast icons (Material Symbols) and varying font weights to denote status (Completed vs. Active vs. Pending).

### 6. Do's and Don'ts
**Do:**
- Use high-contrast type scales to lead the eye.
- Use iconography with a `FILL` variation of 1 for active states.
- Lean into whitespace; the system relies on `spacing: 3` (Editorial) to feel premium.
- Use "Grayscale" filters on secondary imagery (like maps) to keep focus on functional UI.

**Don't:**
- Use 1px borders to separate content areas.
- Use standard "Blue" links; use `secondary` or `primary` with weight changes.
- Crowd the center of the screen; keep the layout expansive and balanced against the heavy sidebar.
- Mix font families; stick strictly to the Manrope/Inter hierarchy.