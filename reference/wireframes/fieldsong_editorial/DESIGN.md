# Design System Strategy: The Thoughtful Curator

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Private Library."** This is not a standard utility app; it is an editorial sanctuary that prioritizes the "slow digital" movement. We reject the frenetic, high-contrast patterns of typical social apps in favor of a layout that feels like a well-composed book spread.

To move beyond a "template" look, we employ **Intentional Asymmetry**. Rather than perfectly centered grids, we use the generous spacing scale (e.g., `spacing-16` or `spacing-24`) to create "breathing room" that guides the eye. Hero elements should feel draped across the screen, using overlapping typography and image containers to create a sense of tactile depth.

---

## 2. Colors & Surface Philosophy
The palette is rooted in deep, earthy foundations with "illuminated" accents that mimic the glow of a reading lamp in a dim room.

### The "No-Line" Rule
**Borders are strictly prohibited for sectioning.** To define a new content area, use a background shift from `surface` (#131313) to `surface_container_low` (#1C1B1B). This creates a "soft-edge" transition that feels sophisticated and organic rather than clinical.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine paper.
*   **Base:** `surface` (#131313)
*   **Sectioning:** `surface_container` (#20201F)
*   **Prominence:** `surface_container_high` (#2A2A2A)
*   **Active Elements:** `surface_container_highest` (#353535)

### The "Glass & Gradient" Rule
For floating navigation or high-level overlays, use a semi-transparent `surface_variant` (#353535 at 80% opacity) with a `backdrop-filter: blur(20px)`. This "frosted glass" effect allows the rich tones of the underlying content to bleed through, maintaining a sense of place.

### Signature Textures
Main CTAs should never be flat. Use a subtle linear gradient transitioning from `primary` (#F2CA50) to `primary_container` (#D4AF37) at a 135-degree angle. This gives the "Amber" accent a metallic, premium weight.

---

## 3. Typography
The tension between the serif and sans-serif is the soul of this system.

*   **Display & Headlines (Newsreader):** This serif is our "Editorial Voice." Use `display-lg` for hero moments where the text is the art. High-end layouts should allow headlines to bleed slightly into the margins or overlap image containers.
*   **Titles & Body (Manrope):** This sans-serif is our "Functional Voice." It provides a clean, modern counterpoint. Use `body-lg` for long-form reading with a line height of at least 1.6x to ensure a "thoughtful" pace.
*   **Labeling:** `label-md` should always be uppercase with `letter-spacing: 0.05rem` to evoke the feel of a library catalog card.

---

## 4. Elevation & Depth
We eschew traditional material shadows for **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by placing a `surface_container_lowest` (#0E0E0E) element on a `surface_container_low` background. This creates a "recessed" look, like an inset shelf.
*   **Ambient Shadows:** If a floating card is required, use a shadow with a blur of `40px` at `6%` opacity, using the `on_surface` color as the shadow tint. This mimics natural light dispersion.
*   **The "Ghost Border":** For interactive inputs, use the `outline_variant` (#4D4635) at 20% opacity. It should be felt more than seen.

---

## 5. Components

### Buttons
*   **Primary:** Rounded `full`. Background: Gradient (Primary to Primary_Container). Text: `on_primary` (#3C2F00), Semi-bold.
*   **Secondary:** Rounded `full`. Background: `secondary_container`. Text: `on_secondary_container`.
*   **Tertiary:** No background. Text: `primary`. Use for low-priority actions like "Cancel" or "Skip."

### Cards & Lists
*   **Constraint:** Zero dividers. 
*   **Execution:** Use `spacing-6` (2rem) as the standard vertical gap between list items. For cards, use `rounded-xl` (1.5rem) to create a friendly, approachable silhouette.
*   **Content:** Group related items within a `surface_container` block to visually encapsulate them without lines.

### Text Inputs
*   **Style:** Minimalist. No enclosing box. Use a 1px `outline_variant` at 20% opacity only on the bottom edge. 
*   **States:** On focus, the bottom border transitions to `primary` (#F2CA50) and the label floats using `label-sm`.

### Signature Component: "The Reading Progress Ribbon"
A bespoke component for a bookshop app. A thin horizontal bar using the `tertiary` (#BFCDFF) color, placed at the very top of a detail page, indicating scroll depth. It provides a cool-toned contrast to the warm amber palette.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical padding. Try a `spacing-8` left margin and a `spacing-4` right margin for a custom editorial look.
*   **Do** use `display-sm` for pull-quotes within text blocks to break up the rhythm.
*   **Do** treat images with `rounded-lg` corners to match the soft UI.

### Don’t
*   **Don’t** use pure black (#000000). It kills the "warmth" of the earth-tone palette.
*   **Don’t** use "Center Aligned" text for anything longer than three lines. Editorial design is traditionally left-aligned.
*   **Don’t** use high-velocity animations. All transitions should use a "Slightly Slow" cubic-bezier (e.g., `0.4, 0, 0.2, 1`) over 400ms to maintain the "calm" atmosphere.