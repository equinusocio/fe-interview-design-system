# Tasks: Tabs Component

**Input**: Design documents from `/specs/003-tabs-component/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Included (spec US6 / FR-015 — all parts)

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [x] T001 Create `src/components/tabs/` folder for compound Tabs files

---

## Phase 2: Foundational

- [x] T002 [P] Add `src/components/tabs/tabs-context.ts` (selection, variant, ids, register/claimDefault)
- [x] T003 [P] Scaffold CSS module `src/components/tabs/tabs.module.css` (List/Tab spacing tokens from research; pill + underline shells)

**Checkpoint**: Context + styles ready

---

## Phase 3: US1 - Composable selection (P1) 🎯 MVP

- [x] T004 [US1] Implement `Tabs.Root` in `src/components/tabs/tabs.tsx` (controlled/uncontrolled, precedence FR-008)
- [x] T005 [P] [US1] Implement `Tabs.List` in `src/components/tabs/tabs-list.tsx`
- [x] T006 [P] [US1] Implement `Tabs.Tab` in `src/components/tabs/tabs-tab.tsx` (`value`, `selected` default seed, roving tabindex)
- [x] T007 [P] [US1] Implement `Tabs.Viewport` in `src/components/tabs/tabs-viewport.tsx`
- [x] T008 [P] [US1] Implement `Tabs.Panel` in `src/components/tabs/tabs-panel.tsx` (mounted+hidden)
- [x] T009 [US1] Export `Tabs` namespace from `src/components/tabs/index.ts`

**Checkpoint**: Three-tab composition switches panels

---

## Phase 4: US3 - APG keyboard/a11y (P1)

- [x] T010 [US3] Wire APG roles/attrs + Arrow/Home/End + automatic activation in Tab/List/Panel
- [x] T011 [US3] Ensure tablist accessible name (`aria-label` on List or forwarded from Root)

**Checkpoint**: Keyboard + roles match APG

---

## Phase 5: US2 - Variants + anchor underline (P1)

- [x] T012 [US2] Root `variant` pill|underline; reflect `data-variant` on List/Tab
- [x] T013 [US2] CSS underline indicator via anchor-position + `@supports` fallback in `tabs.module.css`
- [x] T014 [US2] Responsive List/Tab spacing per research recipe `@media (width > 48em)`

**Checkpoint**: Both variants + responsive spacing

---

## Phase 6: US4 - addon (P1)

- [x] T015 [US4] Render `addon` after label in `tabs-tab.tsx`; gap tokens

**Checkpoint**: Badge-as-addon works

---

## Phase 7: US6 - Tests (P1)

- [x] T016 [US6] Write `test/tabs.test.tsx` covering Root/List/Tab/Viewport/Panel + integration + keyboard + addon

**Checkpoint**: `pnpm test` green for Tabs

---

## Phase 8: US5 + Storybook (P2)

- [x] T017 [US5] Confirm compound API / mounted panels (no unmount); document RSC note in stories if needed
- [x] T018 [US6/US2] Add `src/components/tabs/tabs.stories.tsx` (pill, underline, addon Badge variants)

---

## Phase 9: Polish

- [x] T019 Run `pnpm test`, `pnpm tsc`, `pnpm check`; fix until green
- [x] T020 Adversarial pass vs spec/a11y/authoring-react; iterate

---

## Dependencies

Setup → Foundational → US1 → US3/US2/US4 (can overlap after US1) → US6 tests → Stories → Polish

## MVP

T001–T009 then T016 minimal selection tests.
