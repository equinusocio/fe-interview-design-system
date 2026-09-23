import { clsx } from "clsx";
import type React from "react";
import { useLayoutEffect, useRef } from "react";

import styles from "./tabs.module.css";
import { panelId, tabId, useTabsContext } from "./tabs-context";

export type TabsTabProps = Omit<React.ComponentPropsWithRef<"button">, "value"> & {
  /**
   * Value associating this tab with its panel.
   */
  value: string;
  /**
   * When true in an uncontrolled tree (and no Root defaultValue/value), seeds this tab as the initial selection. Remains selectable afterward.
   * @defaultValue false
   */
  selected?: boolean;
  /**
   * Decoration rendered after the tab label (e.g. Badge).
   * @defaultValue undefined
   */
  addon?: React.ReactNode;
};

export const TabsTab: React.FC<TabsTabProps> = ({
  value: tabValue,
  selected = false,
  addon,
  className,
  children,
  onClick,
  onKeyDown,
  ref,
  ...otherProps
}) => {
  const { baseId, variant, value, setValue, registerTab } = useTabsContext();
  const isSelected = value === tabValue;
  const id = tabId(baseId, tabValue);
  const controls = panelId(baseId, tabValue);
  const tabRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => registerTab(tabValue, { selected }), [registerTab, selected, tabValue]);

  useLayoutEffect(() => {
    if (!isSelected) {
      return;
    }
    tabRef.current?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [isSelected]);

  const assignRef = (node: HTMLButtonElement | null) => {
    tabRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const activate = () => {
    setValue(tabValue);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) {
      return;
    }

    const list = event.currentTarget.closest('[role="tablist"]');
    if (!list) {
      return;
    }
    const tabs = [...list.querySelectorAll<HTMLElement>('[role="tab"]')];
    const index = tabs.indexOf(event.currentTarget);
    if (index < 0 || tabs.length === 0) {
      return;
    }

    let nextIndex: number | null = null;
    switch (event.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % tabs.length;
        break;
      case "ArrowLeft":
        nextIndex = (index - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = tabs.length - 1;
        break;
      default:
        break;
    }

    if (nextIndex === null) {
      return;
    }

    event.preventDefault();
    const next = tabs[nextIndex];
    next?.focus();
    const nextValue = next?.dataset.value;
    if (nextValue) {
      setValue(nextValue);
    }
  };

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event);
    if (!event.defaultPrevented) {
      activate();
    }
  };

  return (
    <button
      {...otherProps}
      ref={assignRef}
      type="button"
      id={id}
      role="tab"
      className={clsx(styles.Tab, className)}
      data-variant={variant}
      data-selected={isSelected ? "true" : "false"}
      data-value={tabValue}
      aria-selected={isSelected}
      aria-controls={controls}
      tabIndex={isSelected ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <span className={styles.Label}>{children}</span>
      {addon ? <span className={styles.Addon}>{addon}</span> : null}
    </button>
  );
};
