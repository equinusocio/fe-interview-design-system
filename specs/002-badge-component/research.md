# Research: Badge Component

## 1. Variant observability for tests

**Decision**: Expose `data-variant` on the root element with the string value
(`"neutral"` | `"positive"` | `"negative"`). Tests query this attribute for
default/explicit variant distinction without asserting computed colors.

**Rationale**: Spec FR-012 forbids brittle pixel asserts; constitution wants
stable contract coverage. `data-variant` matches `authoring-react` preference
for `data-*` driven styling.

**Alternatives considered**:
- Class-name sniffing — couples tests to CSS module hashes
- Computed `background-color` — brittle across jsdom/color spaces
- `aria-label` encoding variant — pollutes a11y for presentational badge

## 2. Neutral / positive / negative color mapping

**Decision**:
- `neutral`: `background-color: var(--global-contrast)`; `color: var(--global-foreground)`
- `positive`: `background-color: var(--highlight-green)`; `color: var(--global-foreground)`
- `negative`: `background-color: var(--highlight-red)`; `color: var(--global-foreground)`

**Rationale**: Spec FR-004; highlight tokens exist for status; contrast gives
muted neutral surface on white page background; dark foreground keeps contrast
on pastel highlights.

**Alternatives considered**:
- Neutral using `--global-background` + border — weaker Figma “filled pill” read
- Separate ink tokens — none published in foundation

## 3. Max-height + `round()`

**Decision**: `max-block-size: round(nearest, 1.375rem, 2px)` mobile;
`round(nearest, 1.625rem, 2px)` desktop. Interval `2px` keeps resolved heights
even (avoids odd pixel sizes).

**Rationale**: Spec FR-006; user asked for `round()` specifically for odd-height
avoidance. Logical property `max-block-size` aligns with modern CSS skill.

**Alternatives considered**:
- `round(..., 1px)` — nearest pixel only; may still be odd
- Fixed `22px`/`26px` — violates rem + token rem culture

## 4. CSS modules vs plain CSS

**Decision**: CSS modules (`badge.module.css`) with root class `.Badge`
(PascalCase).

**Rationale**: `authoring-css` + `authoring-react` conventions; scoping avoids
global collisions as DS grows.

**Alternatives considered**: Plain global `.Badge` CSS — works but weaker isolation

## 5. Storybook token wiring

**Decision**: Side-effect import `../src/index.css` from `.storybook/preview.ts`.

**Rationale**: Stories need foundation tokens; app entry already imports them
but Storybook does not use `index.tsx`.

**Alternatives considered**: Per-story import — easy to forget; decorator — more
boilerplate

## 6. Element semantics

**Decision**: Render a `<span>` (inline status label), not a button.

**Rationale**: Spec edge case — presentational only; badge is not interactive.

**Alternatives considered**: `<div>` — block by default, needs extra display rules
