# Data Model: Tabs Component

## Entities

### Tabs.Root

| Field | Type | Notes |
|-------|------|-------|
| variant | `pill` \| `underline` | Default `pill` |
| value | `string` | Controlled selection |
| defaultValue | `string` | Uncontrolled initial |
| onValueChange | `(value: string) => void` | Controlled callback |
| children | ReactNode | List + Viewport |

Owns selection state and context.

### Tabs.List

| Field | Type | Notes |
|-------|------|-------|
| aria-label / aria-labelledby | string | Accessible name when no visible label |
| children | ReactNode | Tabs.Tab nodes |

Role: `tablist`. Hosts underline indicator (underline variant).

### Tabs.Tab

| Field | Type | Notes |
|-------|------|-------|
| value | `string` | Required association key |
| selected | `boolean` | Optional; seeds default when uncontrolled |
| addon | `ReactNode` | Optional; after label |
| children | ReactNode | Label |

Role: `tab`. Reflects Root `variant` via `data-variant`. Live selected via context.

### Tabs.Viewport

| Field | Type | Notes |
|-------|------|-------|
| children | ReactNode | Panels |

Presentational host for panels.

### Tabs.Panel

| Field | Type | Notes |
|-------|------|-------|
| value | `string` | Required |
| children | ReactNode | Content |

Role: `tabpanel`. Mounted always; `hidden` when inactive. `tabIndex={0}` when active
and no focusable descendant requirement satisfied by making panel focusable.

## State transitions

```text
init → resolveSelected(value | defaultValue | Tab.selected | first)
user → setSelected + onValueChange
arrow focus → setSelected (automatic activation)
```

## Validation

- Duplicate/orphan values: first match; ignore orphans; no throw
- Zero tabs: render empty; no selection
