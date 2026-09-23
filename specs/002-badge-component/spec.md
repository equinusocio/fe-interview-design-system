# Feature Specification: Badge Component

**Feature Branch**: `002-badge-component`

**Created**: 2026-09-23

**Status**: Draft

**Input**: User description: "Ora creiamo il primo componente, Badge, utilizzando anche le skill authoring. Il badge ha accetta children, e ha la prop variants: neutral, positive, negative. Trovi le specifiche figma qua (node 47-677) usando i design tokens definiti. Il badge su mobile aggiusta i padding come mostra la spec. Mobile padding y 4xs, padding x 3xs, su desktop padding y 3xs, padding x 2xs. In ogni caso il Badge su mobile é alto massimo 22px (in rem) e su desktop 26 (in rem) da arrotondare in css round() per evitare altezze dispari. No wrap del testo dentro. Radius 2xs su mobile e xs su desktop. Bisogna creare la relativa storia su Storybook che mostra le varianti. Includi anche i test del componente."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Display status as a Badge (Priority: P1)

A product builder places a Badge next to a label (for example on a future Tab) and shows a short status label with the correct visual treatment for neutral, positive, or negative meaning, using the shared design-system look from Figma.

**Why this priority**: Badge is the first reusable status primitive; Tabs and other surfaces will compose it. Without a correct variant contract, status meaning is unclear.

**Independent Test**: Render three Badges with the same short label and each variant; each is visually distinct and matches the Figma Badge treatments for that variant. No Tabs required.

**Acceptance Scenarios**:

1. **Given** a Badge with short text children and `variant` set to `neutral`, **When** it is shown, **Then** it uses the neutral visual treatment from the Figma Badge spec and remains readable on the page background.
2. **Given** a Badge with short text children and `variant` set to `positive`, **When** it is shown, **Then** it uses the positive (success) treatment aligned with the green highlight token.
3. **Given** a Badge with short text children and `variant` set to `negative`, **When** it is shown, **Then** it uses the negative (error/warning) treatment aligned with the red highlight token.
4. **Given** a Badge, **When** a consumer passes arbitrary React children (text or inline nodes), **Then** those children render inside the Badge without requiring a separate text prop.

---

### User Story 2 - Responsive Badge sizing matches Figma (Priority: P1)

A reviewer checks Badge layout on a narrow (mobile) viewport and a wide (desktop) viewport and sees padding, corner radius, and height match the responsive Figma rules, with text staying on one line.

**Why this priority**: Figma defines distinct mobile/desktop metrics; wrong spacing or wrapping breaks density next to Tabs and other compact UI.

**Independent Test**: Render one Badge; resize across the project mobile/desktop breakpoint; compare padding, radius, max height, and wrapping to the acceptance table below. No Storybook required for this check.

**Acceptance Scenarios**:

1. **Given** a viewport at or below the project desktop threshold, **When** a Badge is shown, **Then** vertical padding uses the `4xs` spacing token, horizontal padding uses the `3xs` spacing token, and corner radius uses the `2xs` spacing token as the radius length.
2. **Given** a viewport above the project desktop threshold, **When** a Badge is shown, **Then** vertical padding uses the `3xs` spacing token, horizontal padding uses the `2xs` spacing token, and corner radius uses the `xs` spacing token as the radius length.
3. **Given** a Badge on mobile, **When** layout is computed, **Then** its height is at most `1.375rem` (22px at a 16px root), with the used max-height value rounded so the resolved height is not an odd pixel size.
4. **Given** a Badge on desktop, **When** layout is computed, **Then** its height is at most `1.625rem` (26px at a 16px root), with the used max-height value rounded so the resolved height is not an odd pixel size.
5. **Given** Badge label text that would otherwise wrap, **When** the Badge is shown, **Then** the label stays on a single line (no wrapping inside the Badge).

---

### User Story 3 - Review Badge variants in Storybook (Priority: P2)

A reviewer opens Storybook and finds a Badge story that shows the `neutral`, `positive`, and `negative` variants side by side (or as selectable controls) so they can evaluate the component without reading source.

**Why this priority**: Constitution requires Storybook for variant review; Badge is the first component story and sets the pattern for Tabs.

**Independent Test**: Start Storybook; open the Badge story; confirm all three variants are visible and distinguishable.

**Acceptance Scenarios**:

1. **Given** Storybook is running, **When** a reviewer opens the Badge story, **Then** they can see examples for `neutral`, `positive`, and `negative` without editing application entry code.
2. **Given** the Badge story, **When** a reviewer compares variants, **Then** each example uses the same short sample label so visual differences come from the variant, not from different copy.

---

### User Story 4 - Automated Badge contract tests (Priority: P1)

A maintainer runs the project test suite and gets a failing result if Badge breaks its public contract: children rendering, default/explicit variants, or required presentational behavior covered by the suite — so regressions cannot silently ship.

**Why this priority**: Constitution Principle V requires Vitest + Testing Library coverage under `test/`; Badge is the first component and sets the test pattern for Tabs.

**Independent Test**: Run the automated test suite; Badge tests pass when the contract holds and fail when children, default variant, or variant distinction regressions are introduced.

**Acceptance Scenarios**:

1. **Given** a Badge rendered with text children, **When** the Badge component tests run, **Then** the tests assert that those children are present in the output.
2. **Given** a Badge rendered without a `variant` prop, **When** the Badge component tests run, **Then** the tests assert the default `neutral` treatment is applied (via the same observable hook the implementation uses for variants, e.g. accessible name/role text plus variant marker).
3. **Given** Badges rendered with `positive` and `negative` variants, **When** the Badge component tests run, **Then** the tests assert each variant is distinguishable from `neutral` and from each other.
4. **Given** a required Badge contract assertion is broken (missing children, wrong default, or collapsed variant distinction), **When** the test suite runs, **Then** the relevant Badge test fails within one run.

---

### Edge Cases

- Empty or whitespace-only children: Badge still renders the shell (padding/height/radius) so layout does not collapse unexpectedly; consumers SHOULD pass meaningful labels in product use.
- Very long unbroken children: text MUST NOT wrap; overflow MAY clip or remain on one line per standard single-line label behavior (no forced multi-line).
- Missing `variant`: default MUST be `neutral` so callers can omit the prop for the common case.
- Unknown `variant` values are out of scope for runtime recovery; the public contract is the three named variants only.
- Badge is presentational (not a button); it MUST NOT introduce interactive keyboard behavior beyond what children already have.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a reusable Badge building block that accepts `children` as its label/content.
- **FR-002**: Badge MUST support a `variant` prop with exactly three values: `neutral`, `positive`, `negative`. Default when omitted: `neutral`.
- **FR-003**: Badge visuals MUST follow the Figma Badge specification ([node 47-677](https://www.figma.com/design/OclakAGLSXDoMKLFvwLNMP/%F0%9F%92%BB-Design-System-Home-Test---Tabs-Component?node-id=47-677)) and MUST consume existing foundation design tokens (spacing, color, typography) rather than hardcoded one-off values for those concerns.
- **FR-004**: Variant color mapping MUST use foundation tokens as follows:
  - `neutral` — muted/contrast treatment using semantic global tokens (e.g. contrast surface with foreground text) per Figma
  - `positive` — treatment using `--highlight-green`
  - `negative` — treatment using `--highlight-red`
- **FR-005**: Responsive spacing and radius MUST follow this contract (mobile-first; desktop from the project breakpoint `width > 48em`):

  | Viewport | Padding-block | Padding-inline | Border radius |
  |----------|---------------|----------------|---------------|
  | Mobile (default) | `--space-4xs` | `--space-3xs` | `--space-2xs` |
  | Desktop (`width > 48em`) | `--space-3xs` | `--space-2xs` | `--space-xs` |

- **FR-006**: Badge MUST constrain height with a maximum of `1.375rem` (22px) on mobile and `1.625rem` (26px) on desktop. The max-height declaration MUST use CSS `round()` so the resolved height avoids odd pixel sizes.
- **FR-007**: Badge label content MUST NOT wrap (`white-space` / equivalent single-line behavior).
- **FR-008**: Typography inside Badge MUST use the body S type style from foundation tokens: `font-family` via `--font-family-body`, `font-size` via `--font-scale-s`, `line-height` via `--font-lh`, and `font-weight: 700` (Bold).
- **FR-009**: Storybook MUST include a Badge story that documents and displays all three variants.
- **FR-010**: Badge styling MUST be handcrafted (no Tailwind/utility CSS frameworks), per project constitution. Implementation authoring MUST follow the project `authoring-css` and `authoring-react` skills when writing styles and component code.
- **FR-011**: Badge MUST be independently importable and typed for consumers (public props: at least `children` and `variant`).
- **FR-012**: Automated tests (Vitest + Testing Library) MUST live under `test/` and MUST cover the Badge public contract: children render; default `variant` is `neutral`; explicit `neutral`, `positive`, and `negative` variants are distinguishable. Tests MUST NOT assert pixel-perfect Figma layout (padding/radius/max-height/`round()` remain visual/Storybook review concerns unless a stable, token-backed observable is already part of the public API).

### Key Entities

- **Badge**: Compact, non-interactive status label showing short content with a semantic variant.
- **Badge variant**: One of `neutral` | `positive` | `negative`, driving color treatment via foundation tokens.
- **Responsive size recipe**: Mobile vs desktop padding, radius, and max-height rules tied to the project breakpoint.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A consumer can render Badges for all three variants with the same children string and get three visually distinct treatments in under one minute of setup (import + three instances).
- **SC-002**: On a mobile-width viewport, measured Badge max height does not exceed 22px (at 16px root); on desktop-width, does not exceed 26px; resolved heights are even pixel sizes after rounding.
- **SC-003**: Changing only the viewport across the project desktop threshold updates padding and radius to the mobile/desktop token pairs in FR-005 without changing the Badge API.
- **SC-004**: With a long label, the Badge never shows a second line of text.
- **SC-005**: A reviewer can open Storybook and identify all three variants without reading source files.
- **SC-006**: 100% of spacing, radius, and status colors used by Badge resolve through foundation tokens (no parallel ad-hoc hex/spacing for those roles).
- **SC-007**: The automated test suite fails within one run if Badge children, default variant, or variant distinction regressions are introduced.

## Assumptions

- Foundation tokens from `001-ds-foundation` are already available on `:root` and are the sole source for spacing, semantic globals, highlights, and typography.
- Figma node `47-677` is the visual source of truth for Badge; when the written responsive padding/height/radius rules in this brief differ from other Figma frames, this brief wins for those metrics.
- Border radius reuses `--space-2xs` / `--space-xs` lengths (no separate radius token scale in the foundation).
- Desktop threshold is the constitution value `@media (width > 48em)` (768px at 16px root); mobile-first defaults apply below that.
- Default `variant` is `neutral`.
- Badge is presentational only in this feature (no click/dismiss API); composition into Tabs is out of scope here.
- Component tests under `test/` are in scope for this feature alongside Storybook; layout metrics (padding, radius, max-height, `round()`) are verified via Figma/Storybook review, not brittle computed-style assertions, unless the public API exposes a stable variant marker tests can query.
- Implementation will follow `authoring-css` and `authoring-react` project skills (file layout, CSS conventions, typed React props) without changing the product requirements above.
- Exact neutral surface/text pairing (which global tokens) follows Figma Badge fills/inks; positive/negative use highlight green/red as fills with readable foreground ink per Figma.
- Badge type is body S Bold: `--font-scale-s` + `font-weight: 700`. No foundation weight token exists yet, so `700` is declared directly in the component stylesheet.
