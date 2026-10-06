# Implementation Plan: Tabs Auto-Advance (Underline)

**Branch**: `004-tabs-auto-advance` | **Date**: 2026-10-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-tabs-auto-advance/spec.md`

## Summary

Extend existing compound `Tabs.Root` with opt-in underline auto-advance: loop to the next enabled tab every **2000 ms** (configurable, milliseconds), play/pause + remaining-time chrome above the list (progress top-left, one control top-right), live `prefers-reduced-motion: reduce` that **fully disables** stepping and **hides** chrome. Pill and unset enablement ignore the feature. Catalog story + Vitest coverage. Raw React; no new UI kits.

## Technical Context

**Language/Version**: TypeScript (strict) + CSS Modules; Node `>=24`

**Primary Dependencies**: React 19, Vite 8, Storybook 10, Vitest 5, Testing Library, clsx (existing)

**Storage**: N/A

**Testing**: Vitest + Testing Library + user-event + fake timers; `test/tabs.test.tsx` (extend) and/or `test/tabs-auto-advance.test.tsx`

**Target Platform**: Modern evergreen browsers; `matchMedia('(prefers-reduced-motion: reduce)')` with `change` listener

**Project Type**: Single-package React design-system take-home

**Performance Goals**: One timeout per wait; progress updates without flooding assistive tech; no remount of panels on auto-step

**Constraints**: Constitution I–V; handcrafted CSS; `@media (width > 48em)` only if chrome needs desktop split; native `button` + `progress` (no extra widget roles); `authoring-react` / `authoring-css` / `a11y` skills; Yoda / existing Tabs patterns

**Scale/Scope**: Root props + chrome in `src/components/tabs/`; stories; tests under `test/`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Design-System Reusability | PASS | Root `autoAdvance` + `autoAdvanceInterval`; compound tree unchanged |
| II. Accessibility First | PASS | Native play/pause button; native progress; reduced motion live off; tablist APG unchanged |
| III. Handcrafted Styles | PASS | CSS module; tokens; no Tailwind |
| IV. Raw React Composition | PASS | Project-owned timer + `matchMedia`; no headless kits |
| V. Verify with Tests and Stories | PASS | Vitest + dedicated Storybook story |

**Post-design re-check**: PASS — no new packages; chrome lives under Root; registry grows `disabled` for skip.

## Project Structure

### Documentation (this feature)

```text
specs/004-tabs-auto-advance/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── tabs-auto-advance.md
└── tasks.md
```

### Source Code (repository root)

```text
src/components/tabs/
├── index.ts
├── tabs.tsx                      # Root: autoAdvance props, timer, chrome slot
├── tabs-auto-advance-chrome.tsx  # progress + play/pause
├── use-prefers-reduced-motion.ts
├── auto-advance.ts               # interval resolve + next enabled value
├── tabs-context.ts               # registerTab disabled; optional playback if needed
├── tabs-tab.tsx                  # pass disabled into registerTab
├── tabs.module.css
└── tabs.stories.tsx              # AutoAdvanceUnderline story

test/
└── tabs-auto-advance.test.tsx
```

**Structure Decision**: Same `tabs/` folder as 003. Helpers + chrome co-located. Tests in dedicated file to keep `tabs.test.tsx` stable.

## Complexity Tracking

> None — no constitution violations.
