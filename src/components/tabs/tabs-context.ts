import { createContext, useContext } from "react";

export type TabsVariant = "pill" | "underline";

/** Shared state from Root to List / Tab / Panel / Viewport. */
export type TabsContextValue = {
  /** `useId()` prefix for stable tab and panel ids. */
  readonly baseId: string;
  readonly variant: TabsVariant;
  /** Currently selected tab `value`. */
  readonly value: string;
  readonly setValue: (next: string) => void;
  /** Mount-time registry; cleanup unregisters. */
  readonly registerTab: (
    tabValue: string,
    opts: { selected?: boolean; disabled?: boolean },
  ) => () => void;
  readonly orientation: "horizontal";
  /** Root `aria-label` forwarded so List can name the tablist. */
  readonly listLabel?: string;
  readonly listLabelledBy?: string;
};

const TabsContext = createContext<TabsContextValue | null>(null);

export const TabsProvider = TabsContext.Provider;

export const useTabsContext = (): TabsContextValue => {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error("Tabs compound parts must be used within Tabs.Root");
  }
  return ctx;
};

/** Tab button `id` — Panel `aria-labelledby` points here. */
export const tabId = (baseId: string, value: string) => `${baseId}-tab-${value}`;
/** Panel `id` — Tab `aria-controls` points here. */
export const panelId = (baseId: string, value: string) => `${baseId}-panel-${value}`;
