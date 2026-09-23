import { clsx } from "clsx";
import type React from "react";

import styles from "./badge.module.css";

export type BadgeProps = React.ComponentPropsWithRef<"span"> & {
  /**
   * Visual status treatment.
   * @defaultValue 'neutral'
   */
  variant?: "neutral" | "positive" | "negative";
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = "neutral",
  ...otherProps
}) => (
  <span {...otherProps} className={clsx(styles.Badge, className)} data-variant={variant}>
    {children}
  </span>
);
