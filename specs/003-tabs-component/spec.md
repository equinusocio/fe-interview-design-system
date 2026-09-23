# Feature Specification: Tabs Component

**Feature Branch**: `003-tabs-component`

**Created**: 2026-09-23

**Status**: Draft

**Input**: User description: "Creiamo il componente Tabs come da Introduction.mdx. Componibile (Root / List / Tab / Panel / Viewport). Varianti pill | underline, selected su Tab. Indicatore underline con CSS anchor-position. Spaziature List/Tab da Figma Tabs.Tab node 47-2303. Accessibile per WAI-ARIA APG Tabs. Performante e compatibile con React Server Components senza cambiare la composizione. Tabs.Tab prop addon (ReactNode) dopo la label per decorazioni (es. Badge/Chip). Skill a11y / authoring-react / authoring-css."

## Clarifications

### Session 2026-09-23

- Q: How do consumers attach Badge/Chip-like decorations on a Tab? → A: `Tabs.Tab` accepts an `addon` prop (`ReactNode`) rendered **after** the tab label. Introduction “Badge via Tab API” is satisfied by passing `<Badge variant="…">…</Badge>` (or similar) as `addon`.
- Q: Which Figma node is the Tabs.Tab spacing / visual source of truth? → A: [node 47-2303](https://www.figma.com/design/OclakAGLSXDoMKLFvwLNMP/%F0%9F%92%BB-Design-System-Home-Test---Tabs-Component?node-id=47-2303) (replaces earlier node 12-128 reference for Tab metrics).
- Q: Are automated tests required for Tabs parts? → A: Yes — Vitest + Testing Library under `test/` MUST cover **all** public Tabs compound parts (`Root`, `List`, `Tab`, `Viewport`, `Panel`) and their integration contracts (selection, a11y, variants, `addon`), not only a subset.
- Q: Where should the Tabs visual `variant` (`pill` | `underline`) be set? → A: Only on `Tabs.Root`; each `Tabs.Tab` reflects Root’s variant for styling (no per-Tab override; mixed variants in one list out of scope).
- Q: Should `Tabs.Tab`’s `selected` be consumer-set or Root-only reflection? → A: Consumer MAY pass `selected` on `Tabs.Tab` (Option B). A default selected tab MUST be expressible this way and MUST remain a normal selectable tab (not locked/disabled merely because it is the default). Selection still coordinates with Root; see FR-008 precedence.
- Q: When tab/panel `value`s are missing, duplicated, or orphaned, what should Tabs do? → A: Silent + deterministic: first match in document order wins; orphan panels/tabs ignored for association; MUST NOT throw in production UI (Option A).
- Q: Should inactive tab panels stay mounted or unmount? → A: Always keep inactive panels mounted and hidden (Option A); no unmount opt-in in v1.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Switch tab panels with a composable Tabs API (Priority: P1)

A product builder assembles a tabbed section with the documented compound parts (`Root`, `List`, `Tab`, `Panel`, `Viewport`), assigns each tab/panel a shared `value`, and end users activate a tab to show only that panel’s content.

**Why this priority**: Core product of the take-home; without working selection and panel switching, variants and addons are irrelevant.

**Independent Test**: Render three tabs (e.g. General / Billing / Goals) with matching panels; activate each tab with pointer and keyboard; only the matching panel is visible/available; composition tree matches the public compound API.

**Acceptance Scenarios**:

1. **Given** a `Tabs.Root` with a `Tabs.List` of three `Tabs.Tab` values and three `Tabs.Panel` values inside `Tabs.Viewport`, **When** the interface initializes, **Then** exactly one panel is shown and its associated tab is the active/selected tab.
2. **Given** an inactive tab, **When** the user activates it (pointer or keyboard per APG), **Then** that tab becomes selected, its panel is shown, and the previously selected tab’s panel is hidden.
3. **Given** consumer markup using only the compound parts and `value` associations (no alternate parallel API required), **When** the page renders, **Then** the same composition shape works for review in Storybook and in the app entry.

---

### User Story 2 - Choose Tabs visual variants (Priority: P1)

A developer switches between `pill` and `underline` treatments so the tab list matches the Design System Figma, including responsive spacing for the list and each tab across mobile and desktop.

**Why this priority**: Introduction acceptance story #1; visual contract is part of the interview deliverable.

**Independent Test**: Render the same three tabs once as `pill` and once as `underline`; compare layout and chrome to Figma Tabs.Tab ([node 47-2303](https://www.figma.com/design/OclakAGLSXDoMKLFvwLNMP/%F0%9F%92%BB-Design-System-Home-Test---Tabs-Component?node-id=47-2303)); resize across the project breakpoint and confirm List/Tab spacing change.

**Acceptance Scenarios**:

1. **Given** tabs configured with variant `pill` on `Tabs.Root`, **When** shown, **Then** the list and tabs use the pill visual treatment from Figma (shape, selected vs unselected contrast).
2. **Given** tabs configured with variant `underline` on `Tabs.Root`, **When** shown, **Then** the list and tabs use the underline treatment from Figma, with a distinct active indicator under the selected tab.
3. **Given** the underline variant and a selected tab, **When** the user selects a different tab, **Then** the active underline indicator moves from the previous tab to the newly selected tab using CSS anchor positioning (not a discrete jump-only restyle without positional association to the active tab).
4. **Given** a viewport at or below the project desktop threshold, **When** List and Tab are shown, **Then** their spacing matches the mobile metrics in Figma node 47-2303 (token-backed).
5. **Given** a viewport above the project desktop threshold (`width > 48em`), **When** List and Tab are shown, **Then** their spacing matches the desktop metrics in Figma node 47-2303 (token-backed).
6. **Given** a `Tabs.Tab`, **When** it is selected vs not selected, **Then** its selected visual state is observable via the Tab `selected` contract and assistive tech stay aligned.
7. **Given** a consumer marks one Tab with `selected` as the default in an uncontrolled Tabs tree, **When** the interface initializes, **Then** that tab is the active/selected tab and remains activatable like any other tab (pointer and keyboard).

---

### User Story 3 - Keyboard and screen-reader Tabs (APG) (Priority: P1)

A keyboard and screen-reader user can move among tabs and into panel content following the [WAI-ARIA APG Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/), without traps or missing name/selected relationships.

**Why this priority**: Constitution Principle II (NON-NEGOTIABLE); interview brief requires accessibility.

**Independent Test**: Keyboard-only pass on a three-tab example: Tab key enters the tab list on the active tab; arrows move among tabs; Space/Enter activate when required by the chosen activation mode; focus can reach the panel (or first focusable in panel); roles/states match APG.

**Acceptance Scenarios**:

1. **Given** focus moves into the tab list, **When** the user presses Tab, **Then** focus lands on the active `tab`, and a further Tab leaves the tab list toward the `tabpanel` (or the first focusable meaningful control inside it).
2. **Given** focus is on a tab in a horizontal list, **When** the user presses Left/Right Arrow, **Then** focus moves to the previous/next tab (wrapping at ends per APG).
3. **Given** the chosen activation mode, **When** the user focuses or activates a tab, **Then** selection and panel visibility follow that mode (automatic on focus, or manual via Space/Enter) consistently.
4. **Given** any tab/panel pair, **When** inspected for accessibility semantics, **Then**: container has `tablist`; each tab has `tab` with `aria-selected` true/false and `aria-controls` pointing at its panel; each panel has `tabpanel` with `aria-labelledby` pointing at its tab; inactive panels are not exposed as the current panel content.
5. **Given** a `tablist` without a visible separate heading, **When** announced, **Then** it has an accessible name (`aria-label` or `aria-labelledby`).

---

### User Story 4 - Addon after the tab label (Badge / Chip) (Priority: P1)

A developer passes an `addon` node after the tab label (for example the design-system Badge, or another chip-like decoration) so status or extra info appears without hand-wiring layout. Introduction stories for Badge on Tab and Badge variants are met by composing Badge inside `addon`.

**Why this priority**: Introduction acceptance stories #2 and #3; user-defined Tab API is `addon`.

**Independent Test**: Render tabs with and without `addon`; pass `<Badge variant="positive">…</Badge>` (and other Badge variants) as `addon`; decoration appears after the label; omit `addon` → no decoration.

**Acceptance Scenarios**:

1. **Given** a `Tabs.Tab` with `addon` set to a React node (e.g. Badge), **When** the tab is shown, **Then** that node renders **after** the tab label in the tab’s layout.
2. **Given** a `Tabs.Tab` with `addon={<Badge variant="neutral|positive|negative">…</Badge>}`, **When** the tab is shown, **Then** the Badge uses the requested variant (Introduction: Badge variants via Tab composition).
3. **Given** a `Tabs.Tab` without `addon` (or `addon` omitted/`undefined`), **When** the tab is shown, **Then** no addon region is rendered and the label layout remains valid.
4. **Given** label + addon on a Tab, **When** the accessible name of the tab is computed, **Then** the name remains meaningful (label and addon text are not lost or duplicated in a confusing way).
5. **Given** an interactive control inside `addon`, **When** the user navigates the tab list, **Then** the tab remains the primary activatable control per APG (addon SHOULD be presentational / non-tab-stopping; interactive addons are discouraged and out of scope to specially support).

---

### User Story 5 - Server-friendly composition and efficient updates (Priority: P2)

A developer hosts the same compound Tabs tree in a React Server Components app shell: interactive behavior stays behind a client boundary without forcing a different composition (no rewrite to a single monolithic component). Selecting tabs does not cause needless full-tree thrash for unrelated panel content.

**Why this priority**: Explicit product constraint for future RSC hosts; performance is part of DS quality without changing the public tree.

**Independent Test**: Documented usage shows the same `Root` → `List`/`Tab` → `Viewport`/`Panel` tree; only the interactive boundary is client-side; switching tabs updates selection/panel visibility without remounting the entire consumer page tree or requiring consumers to flatten the API.

**Acceptance Scenarios**:

1. **Given** the public compound API, **When** used under an RSC-capable host, **Then** consumers keep the same composition shape; they are not required to replace compound parts with a different non-compound API for server compatibility.
2. **Given** multiple panels with distinct content, **When** the user switches tabs repeatedly, **Then** inactive panels remain mounted and hidden (not unmounted); only selection state, panel visibility, and the underline indicator (if underline) update as needed—without remounting the entire Tabs tree or sibling app chrome.
3. **Given** Storybook and unit tests, **When** reviewers exercise selection, **Then** behavior matches the APG contract without requiring third-party headless Tabs libraries.

---

### User Story 6 - Storybook and automated contract tests for every Tabs part (Priority: P1)

A reviewer opens Storybook for variants, Tab `addon` (including Badge), and keyboard-critical states; a maintainer runs Vitest and fails the suite if any public Tabs compound part or their integration contracts regress. Tests are mandatory for **all** parts: `Root`, `List`, `Tab`, `Viewport`, and `Panel` (plus composed behavior), not only one showcase file.

**Why this priority**: Constitution Principle V; explicit product requirement that every component ships with automated coverage.

**Independent Test**: Storybook shows pill, underline, and `addon` with Badge variants; `pnpm test` includes suites (or clearly named cases) that exercise each public part’s contract and full Root→Panel integration.

**Acceptance Scenarios**:

1. **Given** Storybook is running, **When** a reviewer opens Tabs stories, **Then** they can see `pill` and `underline`, selected/unselected, and Tab `addon` examples (including Badge variants) without editing app entry code.
2. **Given** the automated test suite, **When** run, **Then** tests under `test/` cover each public part:
   - `Root` — uncontrolled/`defaultValue` and controlled `value` + change callback; initial selected panel (including Tab `selected` default)
   - `List` — exposes `tablist` (accessible name when required)
   - `Tab` — `value`, Root-driven `variant` reflection, consumer `selected` for default + ongoing selected state, `addon` after label, role `tab` / `aria-selected`
   - `Viewport` — hosts panels for the active selection without breaking association
   - `Panel` — matching `value` shown/hidden while remaining mounted; role `tabpanel` / `aria-labelledby`; inactive panels not presented as current content
3. **Given** integration across parts, **When** tests run, **Then** selection ↔ panel visibility, APG-critical keyboard/semantics stable in jsdom, and `addon` rendering are asserted.
4. **Given** a broken contract on any part (Root selection, List semantics, Tab props/`addon`, Viewport hosting, Panel visibility) or integration, **When** tests run, **Then** the suite fails within one run.

---

### Edge Cases

- Missing or duplicate `value` among tabs/panels: silent + deterministic — first matching tab/panel in document order wins; orphan panels (no tab) and orphan tabs (no panel) are ignored for association; MUST NOT throw in production UI.
- Zero tabs: Root renders without crashing; no selected tab/panel.
- One tab: that tab is selected; arrows may no-op or wrap to itself per APG wrapping rules without error.
- Controlled vs uncontrolled selection: both supported; controlled Root `value` wins when provided (see FR-008 precedence including Tab `selected` for default).
- Default selected tab via Tab `selected={true}` MUST initialize as selected and MUST remain selectable afterward.
- Disabled tab (if exposed): skipped by arrow navigation and not selectable; out of scope to invent unless Figma shows it—default: no disabled API required for v1 unless already in Figma.
- Long tab labels: stay on one line or truncate per Figma; MUST NOT break list layout catastrophically.
- Panels with no focusable children: panel itself is focusable (`tabindex="0"`) so Tab from the tab list can move into it (APG note).
- CSS anchor-position unsupported browsers: underline indicator MUST still mark the selected tab (static position acceptable fallback); motion MAY degrade.
- `addon={null}` / `undefined` / omitted: treat as no addon.
- Empty / whitespace-only addon node: layout SHOULD NOT leave a confusing empty gap; prefer consumers omit `addon` when unused.
- Focusable controls inside `addon`: not specially supported; consumers SHOULD keep addon presentational (e.g. Badge).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a reusable compound Tabs building block with parts: `Tabs.Root`, `Tabs.List`, `Tabs.Tab`, `Tabs.Viewport`, `Tabs.Panel`, composable in this shape:

  ```text
  Tabs.Root
    Tabs.List
      Tabs.Tab (value=…)
    Tabs.Viewport
      Tabs.Panel (value=…)
  ```

- **FR-002**: Each `Tabs.Tab` and `Tabs.Panel` MUST associate via a shared `value`. Exactly one panel corresponding to the selected value is the active panel content at a time. On missing, duplicate, or orphaned `value`s: resolve silently and deterministically (first match in document order; ignore orphans); MUST NOT throw in production UI.
- **FR-003**: `Tabs.Root` MUST accept a visual `variant` prop with values `pill` and `underline` (default `pill` unless plan notes a Figma-driven override). The chosen variant applies to the whole tab list. Each `Tabs.Tab` MUST reflect Root’s variant for styling (e.g. data attribute or equivalent) and MUST NOT accept a consumer `variant` override. `Tabs.Tab` MUST accept an optional boolean `selected` prop so consumers can designate a default selected tab; that tab MUST remain normally selectable (not disabled solely for being default).
- **FR-004**: Underline variant MUST show an active indicator that tracks the selected tab using CSS anchor positioning when the browser supports it, so the indicator’s position is anchored to the active tab as selection changes.
- **FR-005**: List and Tab spacing MUST differ between mobile and desktop per Figma Tabs.Tab ([node 47-2303](https://www.figma.com/design/OclakAGLSXDoMKLFvwLNMP/%F0%9F%92%BB-Design-System-Home-Test---Tabs-Component?node-id=47-2303)), using foundation `--space-*` tokens and `@media (width > 48em)`. Implemented recipe (see `research.md`; adjust if Figma review differs):

  | Surface | Mobile | Desktop (`width > 48em`) |
  |---------| | ------ | ------------------------ |
  | List gap | `--space-2xs` | `--space-xs` |
  | Tab padding-block | `--space-2xs` | `--space-xs` |
  | Tab padding-inline | `--space-xs` | `--space-s` |
  | Tab ↔ addon gap | `--space-3xs` | `--space-2xs` |
  | Pill radius | `--space-2xs` | `--space-xs` |
- **FR-006**: Tabs MUST implement the [APG Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) for roles, states, properties, and keyboard interaction (horizontal list): `tablist` / `tab` / `tabpanel`, `aria-selected`, `aria-controls`, `aria-labelledby`, focus movement with arrows, Tab key behavior into/out of the list, and panel focusability when the panel has no focusable descendants.
- **FR-007**: Activation mode MUST be automatic on focus when panel content can be shown without noticeable latency; otherwise manual (Space/Enter). Default for this design system: **automatic** activation.
- **FR-008**: Selection MUST support uncontrolled and controlled usage on `Tabs.Root` (`defaultValue` / `value` + change callback). `Tabs.Tab` MAY declare `selected` to choose the default selected tab. Precedence when sources disagree: controlled Root `value` wins; else Root `defaultValue` if provided; else the first `Tabs.Tab` with `selected={true}` in document order; else the first tab. A tab that is the default MUST stay selectable like any other tab after init.
- **FR-009**: `Tabs.Tab` MUST accept an optional `addon` prop of type `ReactNode`, rendered **after** the tab label, for decorations such as Badge/Chip. Tabs MUST NOT require a separate Badge-specific prop surface; Introduction Badge stories are satisfied by composing the existing Badge inside `addon` (including Badge `variant` choices).
- **FR-010**: Public composition MUST remain the compound tree in FR-001 under React Server Components hosts: interactivity MAY live behind a client boundary, but consumers MUST NOT be forced to a different non-compound API to satisfy RSC.
- **FR-011**: Tab selection updates MUST be efficient: avoid remounting the entire Tabs tree or sibling app chrome on each selection change. Inactive panels MUST stay mounted and hidden (e.g. `hidden` / equivalent); unmounting inactive panels is out of scope for v1.
- **FR-012**: Styling MUST be handcrafted (no Tailwind/CSS frameworks), consume foundation tokens, and follow project `authoring-css` conventions. React authoring MUST follow `authoring-react` and raw React only (no headless Tabs kits), per constitution.
- **FR-013**: Accessibility authoring MUST follow the project `a11y` skill and APG Tabs guidance (Read Me First + pattern page); no decorative ARIA that breaks native/APG expectations.
- **FR-014**: Storybook MUST document `pill` / `underline`, selection states, and Tab `addon` (including Badge composed as addon with each Badge variant).
- **FR-015**: Automated tests (Vitest + Testing Library) under `test/` MUST cover **all** public Tabs compound parts — `Root`, `List`, `Tab`, `Viewport`, `Panel` — and their integration: selection ↔ panel visibility; APG-critical semantics/keyboard behaviors stable in jsdom; Root `variant`; Tab `selected` (including default) / `addon`. Omitting tests for any public part is out of scope for “done”. Pixel-perfect Figma spacing and anchor-position animation remain visual/Storybook concerns unless a stable public marker exists.

### Key Entities

- **Tabs.Root**: Owner of selection state and shared context for the compound tree.
- **Tabs.List**: Container for tabs (`tablist`); responsive spacing per Figma.
- **Tabs.Tab**: Selectable label for one panel; props include `value`, optional consumer `selected` (default selection), and optional `addon`; visual `variant` comes from Root, not a Tab consumer prop.
- **Tabs.Viewport**: Region that hosts panels for the active selection.
- **Tabs.Panel**: Content associated with a tab `value` (`tabpanel`).
- **Tabs variant**: `pill` | `underline` visual treatment.
- **Active underline indicator**: Positional marker for the selected tab in underline variant, anchored via CSS anchor positioning when supported.
- **Tab addon**: Optional `ReactNode` rendered after the label (e.g. Badge/Chip); Tabs does not own Badge variants—consumers pass Badge (or other nodes) via `addon`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A consumer can assemble a three-tab example with the compound API and switch panels with pointer in under two minutes of setup.
- **SC-002**: 100% of APG-required roles/relationships for the rendered tabs widget are present for the active set (tablist/tab/tabpanel + selected/controls/labelledby) in an accessibility inspection.
- **SC-003**: Keyboard-only users can reach every tab and the active panel content without a focus trap, using Tab and arrow keys as defined by APG, on the first attempt in a scripted review checklist.
- **SC-004**: Switching between `pill` and `underline` is a single `variant` change on `Tabs.Root` (no per-Tab variant props); both match Figma treatments in Storybook side-by-side review.
- **SC-005**: On underline variant, selecting another tab moves the active indicator to the new tab; in supporting browsers the movement is driven by CSS anchor positioning tied to the active tab.
- **SC-006**: Crossing the project desktop breakpoint updates List and Tab spacing to the Figma node 47-2303 mobile/desktop recipes without API changes.
- **SC-007**: A Tab can render an `addon` after its label; composing Badge with each of the three Badge variants as `addon` works; omitting `addon` shows no decoration.
- **SC-008**: The same compound composition works for RSC-style hosting documentation (client boundary internal); reviewers do not need a second API shape.
- **SC-009**: Storybook exposes pill, underline, and `addon` (Badge) examples without reading source.
- **SC-010**: Automated tests fail within one run if any public Tabs part (`Root`, `List`, `Tab`, `Viewport`, `Panel`) or their integration (selection/panel wiring, APG-critical semantics covered by the suite, `addon`) regresses.
- **SC-011**: The test suite includes explicit coverage for each of the five public compound parts (dedicated cases or clearly identifiable assertions per part), so a reviewer can confirm no part shipped untested.
- **SC-012**: A consumer can mark a default selected tab via Tab `selected` (uncontrolled); that tab starts selected and remains selectable like any other tab.

## Assumptions

- Composition typo in the request (opening `Tabs.Root`, closing `Tabs.Viewport`) means: `Root` wraps `List` + `Viewport`; `Viewport` wraps `Panel`s; `Root` closes last.
- `variant` is set only on `Tabs.Root` and reflected onto each Tab for styling; per-tab mixed variants in one list are out of scope.
- Default `variant` when omitted on Root: `pill`. If Figma’s primary component state is underline, plan.md MAY override the default and MUST note the change; visuals still follow Figma either way.
- Automatic activation is the default (APG recommendation when panels are local/preloaded).
- Horizontal orientation only for v1 (`aria-orientation` default horizontal); vertical tabs out of scope.
- Disabled tabs, closable tabs, and popup menus on tabs are out of scope.
- Foundation tokens and Badge (`002-badge-component`) already exist; Badge is composed via `addon`, not a dedicated Tab `badge`/`badgeVariant` API.
- Desktop threshold remains `@media (width > 48em)` per constitution; no breakpoint custom properties.
- Exact mobile/desktop padding/gap token pairs for List and Tab come from Figma node 47-2303 and are copied into `plan.md` during planning (not invented here without file access).
- Malformed value graphs (duplicates/orphans) are consumer mistakes; Tabs degrades silently with first-match rules rather than failing the page.
- Label content is `children` of `Tabs.Tab`; `addon` is a sibling slot after the label, not a replacement for children.
- Tab `selected` is a consumer-facing prop for default (and for reflecting selection in uncontrolled/controlled trees as implemented); it does not make the default tab non-interactive.
- RSC compatibility means preserving compound composition for consumers; it does not require shipping a separate server-only Tabs implementation.
- Inactive panels always remain mounted and hidden; no forceMount/unmount API in v1.
- Implementation follows `a11y`, `authoring-react`, and `authoring-css` skills; they refine practice and MUST NOT override APG or this spec’s product contracts.
- No third-party Tabs/headless UI libraries.
- “All components” for this feature means every public Tabs compound export (`Root`, `List`, `Tab`, `Viewport`, `Panel`) plus integration tests; Badge keeps its own suite from `002-badge-component` (Tabs may add Addon+Badge composition cases without duplicating the full Badge suite).
