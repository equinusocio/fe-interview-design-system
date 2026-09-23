import { clsx } from "clsx";
import type React from "react";

import styles from "./tabs.module.css";
import { useTabsContext } from "./tabs-context";

export type TabsViewportProps = React.ComponentPropsWithRef<"div">;

export const TabsViewport: React.FC<TabsViewportProps> = ({
  className,
  children,
  ...otherProps
}) => {
  const { variant } = useTabsContext();

  return (
    <div {...otherProps} className={clsx(styles.Viewport, className)} data-variant={variant}>
      {children}
    </div>
  );
};
