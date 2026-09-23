# Tasks: Design System Foundation Tokens

**Input**: Design documents from `/specs/001-ds-foundation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Included — spec requires Vitest presence checks for all foundation tokens on `:root`.

**Organization**: Tasks grouped by user story (US1 tokens → US3 presence tests → US2 base chrome).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm existing Vite/React/Vitest project is ready for foundation work

- [x] T001 Verify Vitest config includes `src/**/*.test.{js,ts,tsx}` and jsdom setup in `vite.config.ts` / `src/setupTests.ts`
- [x] T002 Confirm `.gitignore` covers `node_modules/`, `dist/`, `*.log`, `.env*` for this Node project

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Clear competing placeholder styles so `:root` / `body` can host the foundation contract

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Remove placeholder `:root` variables (`--background`, `--content`) and demo-only `body` layout rules from `src/index.css` that conflict with foundation chrome

**Checkpoint**: `src/index.css` ready to receive foundation tokens

---

## Phase 3: User Story 1 - Publish core design tokens (Priority: P1) 🎯 MVP

**Goal**: All 20 foundation tokens published on `:root` in `src/index.css` per contracts/tokens.md

**Independent Test**: In DevTools or a temporary read of `getComputedStyle(document.documentElement)`, every required custom property name resolves to a non-empty value.

### Implementation for User Story 1

- [x] T004 [US1] Add spacing tokens `--space-0` … `--space-2xl` (px→rem base 16) to `:root` in `src/index.css`
- [x] T005 [US1] Add `--global-*` and `--highlight-*` color tokens to `:root` in `src/index.css`
- [x] T006 [US1] Add typography tokens `--font-scale-m`, `--font-scale-s`, `--font-lh`, `--font-family-body` to `:root` in `src/index.css`

**Checkpoint**: Token contract present on `:root` (MVP)

---

## Phase 4: User Story 3 - Automated token presence guard (Priority: P1)

**Goal**: Vitest fails if any required foundation token name is missing from `:root`

**Independent Test**: `pnpm test` passes with all tokens present; removing one token name causes a clear failure

### Tests for User Story 3

> Write the presence suite against the contract list; values MUST NOT be asserted

- [x] T007 [US3] Create presence tests for all required custom properties on `:root` in `src/tokens.test.ts` (import `src/index.css`; assert non-empty `getPropertyValue` per name from `specs/001-ds-foundation/contracts/tokens.md`)

**Checkpoint**: Automated presence guard green

---

## Phase 5: User Story 2 - Base page chrome uses foundation tokens (Priority: P2)

**Goal**: `body` and `:focus-visible` consume tokens; Inter loads from Google Fonts CDN with take-home-only comment

**Independent Test**: `pnpm dev` — body uses global colors + Inter; focus-visible outline uses primary; HTML comment documents CDN take-home exception

### Implementation for User Story 2

- [x] T008 [P] [US2] Add Google Fonts preconnect + Inter stylesheet (`display=swap`) and take-home-only HTML comment in `index.html`
- [x] T009 [US2] Wire `body` (`color`, `background-color`, `font-family` with sans-serif fallback) and `*:focus-visible { outline: var(--global-primary); }` in `src/index.css`

**Checkpoint**: Visual chrome + font loading complete

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate delivery against quickstart

- [x] T010 Run `pnpm test` and confirm quickstart.md automated path passes
- [x] T011 [P] Spot-check `pnpm check` / `pnpm tsc` still pass after CSS and test changes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Immediate
- **Foundational (Phase 2)**: After Setup — BLOCKS stories
- **US1 (Phase 3)**: After Foundational — MVP tokens
- **US3 (Phase 4)**: After US1 (needs tokens on `:root`)
- **US2 (Phase 5)**: After Foundational; can follow US1 (shares `src/index.css` — sequential with T004–T006/T009)
- **Polish (Phase 6)**: After desired stories complete

### User Story Dependencies

- **US1**: No story dependencies
- **US3**: Depends on US1 token publication
- **US2**: Depends on US1 tokens for `var(--…)` references; Inter links independent (`index.html`)

### Parallel Opportunities

- T008 (`index.html`) can run in parallel with token CSS work once Phase 2 is done
- T011 can run alongside T010 after implementation

---

## Parallel Example: User Story 2

```bash
# After US1 tokens exist:
Task: "Add Google Fonts links in index.html"   # T008
# Then (same CSS file — sequential):
Task: "Wire body + focus-visible in src/index.css"  # T009
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1–2 → clean `index.css`
2. Phase 3 US1 → tokens on `:root`
3. Validate in DevTools
4. Phase 4 US3 → presence tests
5. Phase 5 US2 → chrome + Inter
6. Phase 6 polish

### Suggested MVP scope

US1 tokens alone are the MVP; US3 presence tests should ship with them before review.
