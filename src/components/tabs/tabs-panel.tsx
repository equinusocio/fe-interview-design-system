import { clsx } from "clsx";
import type React from "react";

import styles from "./tabs.module.css";
import { panelId, tabId, useTabsContext } from "./tabs-context";

export type TabsPanelProps = Omit<React.ComponentPropsWithRef<"div">, "value"> & {
  /**
   * Value associating this panel with its tab.
   */
  value: string;
};

export const TabsPanel: React.FC<TabsPanelProps> = ({
  value: panelValue,
  className,
  children,
  ...otherProps
}) => {
  const { baseId, value, variant } = useTabsContext();
  const isActive = value === panelValue;
  const id = panelId(baseId, panelValue);
  const labelledBy = tabId(baseId, panelValue);

  return (
    <div
      {...otherProps}
      id={id}
      role="tabpanel"
      className={clsx(styles.Panel, className)}
      data-variant={variant}
      data-state={isActive ? "active" : "inactive"}
      aria-labelledby={labelledBy}
      hidden={!isActive}
      tabIndex={isActive ? 0 : undefined}
    >
      {children}
    </div>
  );
};
