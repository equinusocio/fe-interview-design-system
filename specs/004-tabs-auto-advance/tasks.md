# Tasks: Tabs Auto-Advance (Underline)

**Input**: Design documents from `/specs/004-tabs-auto-advance/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Spec requires Vitest coverage (Assumptions). Tests before implementation per story.

**Organization**: Tasks grouped by user story.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

**Purpose**: Confirm existing Tabs tree; no new packages.

- [x] T001 Confirm `src/components/tabs/` compound layout and `test/` path from plan.md (no new package installs)

---

## Phase 2: Foundational

**Purpose**: Helpers and registry fields all stories need.

- [x] T002 Add `resolveAutoAdvanceInterval` and `nextEnabledTabValue` in `src/components/tabs/auto-advance.ts`
- [x] T003 Add live `usePrefersReducedMotion` in `src/components/tabs/use-prefers-reduced-motion.ts`
- [x] T004 Extend `registerTab` / `TabRegistration` with `disabled` in `src/components/tabs/tabs-context.ts` and `src/components/tabs/tabs.tsx`
- [x] T005 Pass `disabled` into `registerTab` from `src/components/tabs/tabs-tab.tsx`

**Checkpoint**: Helpers + registry ready

---

## Phase 3: User Story 1 - Auto-advance underline tabs on a timer (P1) 🎯 MVP

**Goal**: Loop next enabled tab on a resolved millisecond interval when chrome-active.

**Independent Test**: Underline + `autoAdvance`; fake timers 2000ms → next; last → first; pill ignores; invalid interval → 2000; skip disabled; reduced motion off.

### Tests

- [x] T006 [US1] Write failing auto-step / wrap / pill-ignore / invalid-interval / skip-disabled / reduced-motion-off tests in `test/tabs-auto-advance.test.tsx`

### Implementation

- [x] T007 [US1] Add `autoAdvance` and `autoAdvanceInterval` to `TabsRootProps` and session timer in `src/components/tabs/tabs.tsx`

**Checkpoint**: US1 independently testable (chrome may still be missing)

---

## Phase 4: User Story 2 - Pause and resume (P1)

**Goal**: One play/pause button top-right; pause freeze; play restart full wait.

**Independent Test**: Pause then two intervals → same tab; play → advances; one control visible; keyboard operable.

### Tests

- [x] T008 [US2] Write failing play/pause tests in `test/tabs-auto-advance.test.tsx`

### Implementation

- [x] T009 [US2] Add `tabs-auto-advance-chrome.tsx` play/pause button and wire playback in `src/components/tabs/tabs.tsx`
- [x] T010 [US2] Style chrome row (control inline-end) in `src/components/tabs/tabs.module.css`

**Checkpoint**: US1 + US2

---

## Phase 5: User Story 3 - Remaining-time indicator (P2)

**Goal**: Progress top-left; frozen when paused; cycle matches interval; no AT flood.

**Independent Test**: `progress` present with max=interval; value decreases while running; pause freezes value.

### Tests

- [x] T011 [US3] Write failing remaining-time progress tests in `test/tabs-auto-advance.test.tsx`

### Implementation

- [x] T012 [US3] Render native `progress` in `src/components/tabs/tabs-auto-advance-chrome.tsx` and remaining CSS in `src/components/tabs/tabs.module.css`

**Checkpoint**: US1–US3

---

## Phase 6: User Story 4 - Catalog story (P2)

**Goal**: Dedicated Storybook example.

**Independent Test**: Story `AutoAdvanceUnderline` in catalog.

- [x] T013 [US4] Add `AutoAdvanceUnderline` in `src/components/tabs/tabs.stories.tsx`

**Checkpoint**: Catalog demo

---

## Phase 7: Polish

- [x] T014 Live `matchMedia` change tests in `test/tabs-auto-advance.test.tsx`
- [x] T015 [P] Export types unchanged via `src/components/tabs/index.ts` if Root props already exported
- [x] T016 Run `pnpm test -- test/tabs-auto-advance.test.tsx`, `pnpm tsc`, `pnpm check`

---

## Dependencies & Execution Order

- Setup → Foundational (blocks stories)
- US1 (timer) before US2 (chrome uses session)
- US2 before US3 (same chrome row)
- US4 after chrome exists
- Polish last

### User Story Dependencies

- **US1**: After Phase 2
- **US2**: After US1 timer in Root
- **US3**: After US2 chrome shell
- **US4**: After US2/US3 chrome

### Parallel Opportunities

- T002 / T003 parallel
- Tests T006 written first then T007

---

## Parallel Example: Foundational

```bash
Task: "Add resolveAutoAdvanceInterval in src/components/tabs/auto-advance.ts"
Task: "Add usePrefersReducedMotion in src/components/tabs/use-prefers-reduced-motion.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1–2
2. US1 tests + timer
3. Validate wrap / pill / reduced motion

### Incremental

US2 pause → US3 progress → US4 story → polish

## Notes

- Tests requested by spec Assumptions
- Paths under repo `src/` and `test/`
