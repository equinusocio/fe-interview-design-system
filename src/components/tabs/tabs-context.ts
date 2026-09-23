import { createContext, useContext } from "react";

export type TabsVariant = "pill" | "underline";

export type TabsContextValue = {
  readonly baseId: string;
  readonly variant: TabsVariant;
  readonly value: string;
  readonly setValue: (next: string) => void;
  readonly registerTab: (tabValue: string, opts: { selected?: boolean }) => () => void;
  readonly orientation: "horizontal";
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

export const tabId = (baseId: string, value: string) => `${baseId}-tab-${value}`;
export const panelId = (baseId: string, value: string) => `${baseId}-panel-${value}`;
