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

/**
 * APG `tab`. Roving `tabIndex`: selected = 0, others = -1.
 * `aria-controls` / `id` pair this control with its panel via shared `value`.
 */
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
  const {
    baseId,
    variant,
    value,
    setValue,
    registerTab,
    setTabElement,
    moveSelectionFromKeyboard,
  } = useTabsContext();
  const isSelected = value === tabValue;
  const id = tabId(baseId, tabValue);
  const controls = panelId(baseId, tabValue);
  const tabRef = useRef<HTMLButtonElement>(null);
  const { disabled, ...buttonProps } = otherProps;

  /** Register (and unregister) so Root can seed selection when children were not walkable. */
  useLayoutEffect(
    () => registerTab(tabValue, { selected, disabled: Boolean(disabled) }),
    [disabled, registerTab, selected, tabValue],
  );

  /** Keep the active tab visible in an overflowing list. */
  useLayoutEffect(() => {
    if (!isSelected) {
      return;
    }
    const node = tabRef.current;
    if (node && "function" === typeof node.scrollIntoView) {
      node.scrollIntoView({ inline: "center", block: "nearest" });
    }
  }, [isSelected]);

  /** Merge consumer `ref` with the internal node used for scroll-into-view and Root focus. */
  const assignRef = (node: HTMLButtonElement | null) => {
    tabRef.current = node;
    setTabElement(tabValue, node);
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const activate = () => {
    setValue(tabValue);
  };

  /**
   * APG tabs keyboard: arrows wrap, Home/End jump ends.
   * Focus + selection move together via Root registry (no tablist DOM queries).
   */
  const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) {
      return;
    }

    if (moveSelectionFromKeyboard(tabValue, event.key)) {
      event.preventDefault();
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
      {...buttonProps}
      disabled={disabled}
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
