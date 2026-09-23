import { clsx } from "clsx";
import type React from "react";

import styles from "./tabs.module.css";
import { useTabsContext } from "./tabs-context";

export type TabsListProps = React.ComponentPropsWithRef<"div">;

export const TabsList: React.FC<TabsListProps> = ({
  className,
  children,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...otherProps
}) => {
  const { variant, orientation, listLabel, listLabelledBy } = useTabsContext();

  return (
    <div
      {...otherProps}
      className={clsx(styles.List, className)}
      data-variant={variant}
      role="tablist"
      aria-orientation={orientation}
      aria-label={ariaLabel ?? listLabel}
      aria-labelledby={ariaLabelledBy ?? listLabelledBy}
    >
      {children}
      {variant === "underline" ? <span className={styles.Indicator} aria-hidden="true" /> : null}
    </div>
  );
};
