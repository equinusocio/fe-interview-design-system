# Tasks: Badge Component

**Input**: Design documents from `/specs/002-badge-component/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Included (spec US4 / FR-012)

**Organization**: Grouped by user story (US1 → US2 → US4 → US3 by delivery dependency; priorities from spec)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1–US4 from spec.md
- Exact file paths in every task

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Scaffold Badge package folder per plan / authoring-react filesystem

- [x] T001 Create `src/components/badge/` folder (remove `src/components/.gitkeep` if unused) for Badge co-located files

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Storybook can resolve foundation tokens before any Badge story

**⚠️ CRITICAL**: Blocks Storybook validation (US3)

- [x] T002 Import foundation stylesheet in `.storybook/preview.ts` via `import "../src/index.css"`

**Checkpoint**: Stories can consume `:root` tokens

---

## Phase 3: User Story 4 - Automated Badge contract tests (Priority: P1)

**Goal**: Vitest + Testing Library contract under `test/` for children + variants

**Independent Test**: `pnpm test` — fail until Badge exists; pass after US1

### Tests for User Story 4

- [x] T003 [US4] Write failing Badge contract tests in `test/badge.test.tsx` (children present; default `data-variant="neutral"`; explicit `neutral`/`positive`/`negative` distinguishable)

**Checkpoint**: Tests exist and fail (red) before component implementation

---

## Phase 4: User Story 1 - Display status as a Badge (Priority: P1) 🎯 MVP

**Goal**: Importable `Badge` with `children` + `variant` and token-backed fills

**Independent Test**: Render three variants; children visible; fills match token mapping

### Implementation for User Story 1

- [x] T004 [US1] Implement `Badge` + `BadgeProps` / `BadgeVariant` in `src/components/badge/badge.tsx` (`React.FC`, default `variant="neutral"`, `data-variant`, span root, authoring-react conventions)
- [x] T005 [US1] Add variant styles in `src/components/badge/badge.module.css` (`.Badge`, neutral/positive/negative token colors, typography tokens, `white-space: nowrap`, inline-flex shell)
- [x] T006 [US1] Export public API from `src/components/badge/index.ts`
- [x] T007 [US1] Confirm `test/badge.test.tsx` passes after T004–T006

**Checkpoint**: US1 + US4 green for API/variants

---

## Phase 5: User Story 2 - Responsive Badge sizing (Priority: P1)

**Goal**: Mobile/desktop padding, radius, rounded max-height per FR-005/FR-006

**Independent Test**: Inspect CSS for token padding/radius and `round()` max-block-size; breakpoint `width > 48em`

### Implementation for User Story 2

- [x] T008 [US2] Extend `src/components/badge/badge.module.css` with mobile padding/radius/max-block-size and `@media (width > 48em)` desktop overrides per data-model recipe

**Checkpoint**: Responsive recipe present in CSS source

---

## Phase 6: User Story 3 - Storybook variants (Priority: P2)

**Goal**: Storybook documents all three variants with the same sample label

**Independent Test**: `pnpm storybook` → Badge stories show neutral/positive/negative

### Implementation for User Story 3

- [x] T009 [US3] Add `src/components/badge/badge.stories.tsx` showcasing `neutral`, `positive`, and `negative` with identical sample children

**Checkpoint**: Reviewer can compare variants in Storybook

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Quality gates from quickstart.md

- [x] T010 Run `pnpm test`, `pnpm tsc`, and `pnpm check`; fix any regressions in Badge files
- [x] T011 [P] Spot-check Storybook Badge stories against Figma node 47-677 (visual: colors, single-line, density)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup → Foundational → US4 (tests) → US1 (component) → US2 (responsive CSS) → US3 (stories) → Polish**
- US4 tests written before US1 so they go red→green
- US2 edits same CSS as US1 → after US1
- US3 needs T002 + US1

### User Story Dependencies

- **US4**: After Setup; before/with US1 (TDD)
- **US1**: After T003; no other story deps
- **US2**: After US1 (shared CSS)
- **US3**: After Foundational + US1

### Parallel Opportunities

- T002 can run while T001 scaffolds (different files)
- T011 after T010

---

## Parallel Example

```bash
# After T001:
Task: "Import foundation stylesheet in .storybook/preview.ts"
# Then sequentially: T003 → T004/T005/T006 → T007 → T008 → T009 → T010
```

---

## Implementation Strategy

### MVP First

1. Setup + Foundational
2. US4 failing tests
3. US1 component → tests green
4. Validate MVP (variants + children)

### Incremental

1. US2 responsive CSS
2. US3 Storybook
3. Polish gates

### Suggested MVP scope

US4 + US1 (contract + visible variants). US2/US3 required for full feature acceptance.
