import { clsx } from "clsx";
import type React from "react";
import {
  Children,
  isValidElement,
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import styles from "./tabs.module.css";
import { type TabsContextValue, TabsProvider, type TabsVariant } from "./tabs-context";
import { TabsList } from "./tabs-list";
import { TabsPanel } from "./tabs-panel";
import { TabsTab, type TabsTabProps } from "./tabs-tab";
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

type TabSeeds = {
  first?: string;
  selected?: string;
};

const collectTabSeeds = (node: React.ReactNode): TabSeeds => {
  let first: string | undefined;
  let selected: string | undefined;

  Children.forEach(node, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    if (child.type === TabsTab) {
      const tabProps = child.props as TabsTabProps;
      if (undefined === first) {
        first = tabProps.value;
      }
      if (tabProps.selected && undefined === selected) {
        selected = tabProps.value;
      }
      return;
    }

    const nestedChildren = (child.props as { children?: React.ReactNode }).children;
    if (nestedChildren) {
      const nested = collectTabSeeds(nestedChildren);
      if (undefined === first) {
        first = nested.first;
      }
      if (undefined === selected) {
        selected = nested.selected;
      }
    }
  });

  return { first, selected };
};

const resolveUncontrolledDefault = (
  children: React.ReactNode,
  defaultValue: string | undefined,
): string => {
  if (undefined !== defaultValue) {
    return defaultValue;
  }
  const seeds = collectTabSeeds(children);
  return seeds.selected ?? seeds.first ?? "";
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
  const defaultClaimedRef = useRef(false);
  const registryRef = useRef<TabRegistration[]>([]);
  const [uncontrolled, setUncontrolled] = useState(() => {
    const initial = resolveUncontrolledDefault(children, defaultValue);
    if (undefined !== defaultValue || "" !== initial) {
      defaultClaimedRef.current = true;
    }
    return initial;
  });

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

  const claimDefault = useCallback(
    (next: string) => {
      if (isControlled || undefined !== defaultValue || defaultClaimedRef.current) {
        return;
      }
      defaultClaimedRef.current = true;
      setUncontrolled(next);
    },
    [defaultValue, isControlled],
  );

  useLayoutEffect(() => {
    if (isControlled || undefined !== defaultValue || defaultClaimedRef.current) {
      return;
    }
    const regs = registryRef.current;
    const selectedReg = regs.find((registration) => registration.selected);
    const next = selectedReg?.value ?? regs[0]?.value;
    if (next) {
      claimDefault(next);
    }
  }, [claimDefault, defaultValue, isControlled]);

  const registerTab = useCallback(
    (tabValue: string, opts: { selected?: boolean }) => {
      const existing = registryRef.current.findIndex((r) => r.value === tabValue);
      if (existing >= 0) {
        registryRef.current[existing] = { value: tabValue, selected: opts.selected };
      } else {
        registryRef.current.push({ value: tabValue, selected: opts.selected });
      }

      if (opts.selected) {
        claimDefault(tabValue);
      }

      return () => {
        registryRef.current = registryRef.current.filter((r) => r.value !== tabValue);
      };
    },
    [claimDefault],
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
