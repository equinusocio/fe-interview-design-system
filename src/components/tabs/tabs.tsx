import { clsx } from "clsx";
import type React from "react";
import { useCallback, useId, useMemo, useRef, useState } from "react";

import styles from "./tabs.module.css";
import { type TabsContextValue, TabsProvider, type TabsVariant } from "./tabs-context";
import { TabsList } from "./tabs-list";
import { TabsPanel } from "./tabs-panel";
import { TabsTab } from "./tabs-tab";
import { TabsViewport } from "./tabs-viewport";

export type TabsRootProps = React.ComponentPropsWithRef<"div"> & {
  /**
   * Visual treatment for the whole tab list.
   * @defaultValue 'pill'
   */
  variant?: TabsVariant;
  /**
   * Controlled selected tab value.
   */
  value?: string;
  /**
   * Uncontrolled initial selected tab value.
   */
  defaultValue?: string;
  /**
   * Called when the selected tab value changes.
   */
  onValueChange?: (value: string) => void;
};

type TabRegistration = {
  value: string;
  selected?: boolean;
};

const TabsRoot: React.FC<TabsRootProps> = ({
  variant = "pill",
  value: valueProp,
  defaultValue,
  onValueChange,
  className,
  children,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...otherProps
}) => {
  const baseId = useId();
  const isControlled = valueProp !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? "");
  const registryRef = useRef<TabRegistration[]>([]);
  const defaultClaimedRef = useRef(false);

  const value = isControlled ? valueProp : uncontrolled;

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) {
        setUncontrolled(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const resolveFirstTabFallback = useCallback(() => {
    queueMicrotask(() => {
      if (isControlled || defaultValue !== undefined || defaultClaimedRef.current) {
        return;
      }
      const regs = registryRef.current;
      const next = regs[0]?.value;
      if (next) {
        defaultClaimedRef.current = true;
        setUncontrolled(next);
      }
    });
  }, [defaultValue, isControlled]);

  const registerTab = useCallback(
    (tabValue: string, opts: { selected?: boolean }) => {
      const existing = registryRef.current.findIndex((r) => r.value === tabValue);
      if (existing >= 0) {
        registryRef.current[existing] = { value: tabValue, selected: opts.selected };
      } else {
        registryRef.current.push({ value: tabValue, selected: opts.selected });
      }

      if (!isControlled && defaultValue === undefined && !defaultClaimedRef.current) {
        if (opts.selected) {
          defaultClaimedRef.current = true;
          setUncontrolled(tabValue);
        } else {
          resolveFirstTabFallback();
        }
      }

      return () => {
        registryRef.current = registryRef.current.filter((r) => r.value !== tabValue);
      };
    },
    [defaultValue, isControlled, resolveFirstTabFallback],
  );

  const ctx = useMemo<TabsContextValue>(
    () => ({
      baseId,
      variant,
      value,
      setValue,
      registerTab,
      orientation: "horizontal",
      listLabel: ariaLabel,
      listLabelledBy: ariaLabelledBy,
    }),
    [ariaLabel, ariaLabelledBy, baseId, registerTab, setValue, value, variant],
  );

  return (
    <TabsProvider value={ctx}>
      <div {...otherProps} className={clsx(styles.Root, className)} data-variant={variant}>
        {children}
      </div>
    </TabsProvider>
  );
};

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Tab: TabsTab,
  Viewport: TabsViewport,
  Panel: TabsPanel,
};

export type { TabsVariant };
