# Feature Specification: Tabs Auto-Advance (Underline)

**Feature Branch**: `004-tabs-auto-advance`

**Created**: 2026-10-06

**Status**: Draft

**Input**: User description: "nel componente tabs serve una prop nuova per controllare l'avanzamento automatico del tab ogni 2 secondi, passando al tab successivo, in loop (dall'ultimo torna al primo). Questa prop si applica solo alla variante underline. Quando la prop è presente compaiono anche due controlli play/pausa alternati. Crea una storia relativa per dimostrare questa versione. Oltre ai controlli mostra anche un indicatore progress che mostra il tempo restante al passaggio successivo. Posizionalo in alto a sinistra, sopra il tab, i controlli in alto a destra (solo uno visibile alla volta play o pausa). Il tempo tra un tab all'altro è configurabile anch'esso tramite prop."

## Clarifications

### Session 2026-10-06

- Q: When the environment prefers reduced motion, should auto-advance still run if the product enabled it? → A: No. Auto-advance MUST stay fully off whenever reduced motion is preferred, whether or not the enablement setting is present. Play MUST NOT re-enable it.
- Q: When reduced motion is on and auto-advance would otherwise be enabled, should play/pause and the remaining-time indicator still appear? → A: Hide play/pause and remaining-time indicator whenever reduced motion is preferred or auto-advance enablement is not set (same as pill / not enabled).
- Q: If the viewer turns reduced motion on or off while the tab set is already on screen, should auto-advance and chrome update immediately? → A: Yes, live. Turning reduced motion on stops the timer and hides chrome at once. Turning it off (underline + enablement still set) shows chrome and starts stepping again.
- Q: In what unit should the product set the wait between automatic tab changes? → A: Milliseconds. Default 2000.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Auto-advance underline tabs on a timer (Priority: P1)

A product owner shows an underline tab set that steps through panels on its own: after a wait (default two seconds), the next tab becomes selected; after the last tab, the first tab is selected again. The wait between steps is configurable.

**Why this priority**: Core value of the feature; without timed looping selection, chrome and catalog examples have nothing to demonstrate.

**Independent Test**: Enable auto-advance on an underline tab set with at least three tabs; leave it running; confirm selection walks in document order and wraps; change the wait duration and confirm the interval changes; confirm pill tab sets do not auto-advance even if the same enablement is attempted.

**Acceptance Scenarios**:

1. **Given** underline tabs with auto-advance enabled and the default wait, **When** the interface is left running without user interaction, **Then** the selected tab moves to the next tab after two seconds, repeatedly.
2. **Given** the last tab is selected and auto-advance is running, **When** the wait elapses, **Then** the first tab becomes selected (loop).
3. **Given** auto-advance is enabled with a custom wait duration, **When** the interface is left running, **Then** each automatic step happens after that duration, not the default two seconds.
4. **Given** tabs using the pill visual treatment, **When** auto-advance enablement is present, **Then** tabs do not auto-advance and play/pause plus remaining-time progress do not appear.
5. **Given** auto-advance is not enabled on underline tabs, **When** the interface is shown, **Then** selection changes only from user (or existing controlled) actions; play/pause and remaining-time progress do not appear.
6. **Given** the environment prefers reduced motion, **When** auto-advance enablement is present on underline tabs, **Then** tabs MUST NOT auto-advance and play/pause plus remaining-time progress MUST NOT appear.

---

### User Story 2 - Pause and resume auto-advance (Priority: P1)

A viewer can stop the timed stepping to read a panel, then start it again. Only one of two controls is visible at a time: pause while running, play while stopped. The control sits at the top right, above the tab list.

**Why this priority**: Auto-advance without a stop control traps people who need more time; it is required whenever auto-advance is on.

**Independent Test**: Enable auto-advance on underline tabs; use pause; confirm selection stays put past the wait; use play; confirm stepping resumes; confirm only one of play or pause is shown at a time, top-right above the tabs.

**Acceptance Scenarios**:

1. **Given** auto-advance is running, **When** the viewer activates pause, **Then** the selected tab does not change when the remaining wait would have elapsed, and the visible control becomes play.
2. **Given** auto-advance is paused, **When** the viewer activates play, **Then** timed stepping resumes and the visible control becomes pause.
3. **Given** underline tabs with auto-advance enabled and reduced motion not preferred, **When** the chrome is shown, **Then** play/pause sit at the top right above the tab list, and never both play and pause at once.
4. **Given** auto-advance chrome is shown, **When** a keyboard or screen-reader user reaches the control, **Then** they can pause and play without a keyboard trap, and the control has a clear accessible name that matches the current action.

---

### User Story 3 - See remaining time until the next tab (Priority: P2)

A viewer sees how much of the current wait remains before the next automatic step. The remaining-time indicator sits at the top left, above the tab list (not over the tab labels).

**Why this priority**: Makes the timer understandable and supports the catalog demo; depends on auto-advance being on.

**Independent Test**: Enable auto-advance on underline tabs; watch the indicator fill or empty across one wait; pause and confirm it stops; resume and confirm it continues for the remaining or restarted wait per assumptions.

**Acceptance Scenarios**:

1. **Given** auto-advance is running, **When** a wait interval is in progress, **Then** a remaining-time indicator at the top left above the tab list reflects how much time is left until the next automatic tab change.
2. **Given** auto-advance is paused, **When** the viewer looks at the indicator, **Then** remaining-time progress does not continue until play is activated.
3. **Given** auto-advance is enabled, **When** the wait duration is configured to a different value, **Then** the indicator’s full cycle matches that duration.
4. **Given** assistive technology, **When** the indicator is present, **Then** it exposes remaining-time progress in an accessible way (name and current progress) without being announced on every tiny tick in a way that floods the user.

---

### User Story 4 - Catalog story for auto-advance underline tabs (Priority: P2)

A reviewer opens the component catalog and finds a dedicated example of underline tabs with auto-advance, remaining-time indicator, play/pause, and a configurable wait, so they can evaluate the behavior without assembling it themselves.

**Why this priority**: Constitution requires catalog coverage of key states; this variant is otherwise easy to miss.

**Independent Test**: Open the catalog, locate the auto-advance underline story, confirm looping selection, chrome placement (progress top-left, control top-right), and that the wait is demonstrably not hard-coded only in that one demo if a distinct duration is shown.

**Acceptance Scenarios**:

1. **Given** the component catalog, **When** a reviewer looks for auto-advance tabs, **Then** a dedicated story shows the underline variant with auto-advance enabled.
2. **Given** that story, **When** it runs, **Then** play/pause and remaining-time progress appear in the specified positions and auto-advance loops through the story’s tabs.

---

### Edge Cases

- One enabled tab only: auto-advance stays on that tab; wait may still cycle the indicator, but selection does not jump to a hidden or missing tab.
- Disabled tabs in the list: automatic stepping skips disabled tabs; wrap still lands on the next enabled tab.
- Viewer selects a tab while running: that tab becomes selected immediately and the wait for the *next* automatic step restarts from full duration.
- Viewer selects a tab while paused: selection updates; auto-advance stays paused until play.
- Controlled selection from the product: automatic steps still request the next tab through the same selection path as a user activation; the product remains able to hold or override selection as it does today.
- Wait duration of zero, negative, or non-numeric: treat as default 2000 milliseconds; do not crash or spin without bound.
- Auto-advance enablement on pill: ignore; no chrome, no timer.
- Reduced motion preference: auto-advance is fully off even if enablement is present; play/pause and remaining-time progress are hidden; play cannot start stepping because the control is not shown. Preference is followed live: if it turns on while the tab set is shown, stepping stops and chrome hides immediately; if it turns off while enablement and underline still apply, chrome appears and stepping starts.
- Rapid pause/play: no skipped or doubled steps beyond a single in-flight wait; at most one automatic change per completed wait.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Tabs MUST offer an opt-in auto-advance setting on the root of the tab set. When the setting is present, the visual treatment is underline, and reduced motion is not preferred, automatic selection MUST be active according to FR-002–FR-010.
- **FR-002**: Auto-advance MUST apply only to the underline visual treatment. Pill MUST ignore the setting and MUST NOT show auto-advance chrome.
- **FR-003**: While auto-advance is running, the selected tab MUST move to the next enabled tab in document order after each wait. After the last enabled tab, the first enabled tab MUST be selected.
- **FR-004**: Default wait between automatic steps MUST be 2000 milliseconds (two seconds).
- **FR-005**: Tabs MUST offer a configurable wait duration in milliseconds for the interval between automatic steps. When a valid duration is provided, that duration MUST replace the default for both stepping and the remaining-time indicator.
- **FR-006**: When auto-advance chrome is active (underline, enablement set, reduced motion not preferred), the interface MUST show a remaining-time indicator at the top left, above the tab list, communicating time left until the next automatic step.
- **FR-007**: When auto-advance chrome is active, the interface MUST show a play or pause control at the top right, above the tab list. Exactly one of play or pause MUST be visible: pause while running, play while paused.
- **FR-008**: Activating pause MUST freeze selection and remaining-time progress. Activating play MUST resume automatic stepping.
- **FR-009**: Remaining-time indicator and play/pause MUST NOT be shown, and tabs MUST NOT auto-advance, when any of these is true: auto-advance is not enabled; visual treatment is pill; reduced motion is preferred.
- **FR-010**: Manual tab activation while auto-advance is running MUST select that tab and restart the wait from the full configured duration. Manual activation while paused MUST select that tab and leave auto-advance paused.
- **FR-011**: Automatic stepping MUST skip disabled tabs.
- **FR-012**: Play/pause MUST be operable by pointer and keyboard, MUST have an accessible name matching the current action, and MUST NOT create a keyboard trap. Remaining-time progress MUST have an accessible name and current value without flooding assistive technology on every animation frame.
- **FR-013**: If the environment indicates a reduced-motion preference, auto-advance MUST be fully off regardless of whether the enablement setting is present. Play/pause and remaining-time progress MUST NOT appear. There is no viewer action that starts automatic stepping while reduced motion remains preferred. The tab set MUST follow the current preference for as long as it is shown (not a first-paint snapshot): reduced motion turning on MUST stop the timer and hide chrome immediately; reduced motion turning off MUST restore chrome and start stepping when underline and enablement still apply.
- **FR-014**: The component catalog MUST include a dedicated story of underline tabs with auto-advance, remaining-time indicator, play/pause, and looping selection.
- **FR-015**: Invalid wait durations (missing, zero, negative, non-numeric) MUST fall back to 2000 milliseconds without breaking the tab set.
- **FR-016**: Existing tab selection, keyboard tab-list behavior, and panel association MUST keep working; auto-advance is additive and MUST NOT replace arrow-key movement or tab/panel semantics.

### Key Entities

- **Tab set**: Compound tabs instance (list of tabs + panels) with a visual treatment and optional auto-advance.
- **Auto-advance session**: Running or paused timed walk through enabled tabs; owns wait duration and remaining time in the current interval.
- **Wait duration**: Time between automatic tab changes in milliseconds; default 2000; overridable.
- **Remaining-time indicator**: Visual (and accessible) progress of the current wait, top-left above the tab list.
- **Playback control**: Single visible play or pause action, top-right above the tab list.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: With auto-advance on underline tabs and default wait, 100% of automatic steps occur after two seconds (±10%) and wrap from last enabled tab to first in a 10-cycle observation.
- **SC-002**: Reviewers can pause before the next step in one action; after pause, zero automatic tab changes occur for at least two full wait durations; play resumes stepping.
- **SC-003**: 100% of catalog reviewers can find the dedicated auto-advance underline example and observe progress top-left, control top-right, and looping panels without reading source.
- **SC-004**: Keyboard-only users can pause and play on the first encounter with the control (accessible name matches action) and still move through the tab list per existing tab keyboard rules.
- **SC-005**: Configuring a wait other than two seconds (e.g. four seconds) changes both step timing and a full remaining-time cycle to that duration (±10%) in observation.
- **SC-006**: Pill tabs with the auto-advance setting attempted show no extra chrome and zero automatic selection changes over at least two default waits.
- **SC-007**: With reduced motion preferred, zero automatic tab changes occur over at least two full wait durations even when auto-advance enablement is present, and play/pause plus remaining-time progress are not shown. If reduced motion is turned on while auto-advance was running, stepping and chrome stop within one second; if it is then turned off with enablement still set, chrome returns and stepping resumes within one second.

## Assumptions

- Auto-advance is opt-in via a dedicated root setting; absence means today’s tabs behavior with no extra chrome (hidden play/pause and remaining-time progress).
- Auto-advance chrome (play/pause + remaining-time progress) is shown only when all of these hold: underline treatment, enablement set, reduced motion not preferred. Otherwise chrome is hidden.
- When auto-advance chrome is shown, stepping starts in the running state. When reduced motion is preferred, auto-advance is off irrespective of enablement and chrome is hidden. Reduced motion is observed continuously, not only at first appearance.
- “Prop presente” means the auto-advance setting is opted in (including an explicit on/true-style enablement). A separate wait-duration setting configures interval only and does not by itself turn auto-advance on.
- Remaining-time indicator is one indicator for the current wait of the whole tab set, not a per-tab mark on each label.
- “Sopra il tab” means above the tab list row, not overlapping tab labels: progress top-left of that chrome row, control top-right of that chrome row.
- After pause then play, the wait restarts from full duration (simpler and predictable), not from leftover milliseconds.
- Manual selection while running also restarts the wait from full duration.
- Disabled tabs are skipped; if every tab is disabled, selection does not rotate.
- Wait duration is a positive number of milliseconds; default 2000. Interval setting does not by itself enable auto-advance.
- Visual styling of play, pause, and progress follows existing design tokens; no separate Figma node was given for this chrome.
- Tests under the project test suite MUST cover auto-advance, pause/play, wrap, pill ignore, invalid duration fallback, and skip-disabled, in addition to the catalog story.
- Compound composition (`Root` / `List` / `Tab` / `Panel` / `Viewport`) stays unchanged aside from the new root settings and auto-advance chrome.
