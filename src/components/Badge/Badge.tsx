import React from "react";

import styles from "./Badge.module.css";
import { composeClasses } from "../../libs/utils";

export enum BadgeTypes {
  Danger = "danger",
  Safe = "safe",
  Warning = "warn",
  Info = "info"
}

export interface BadgeProps
  extends React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  as?: BadgeTypes;
  text: string;
}

const Badge: React.FC<BadgeProps> = ({
  text = "",
  className = "",
  as = BadgeTypes.Safe,
  ...props
}: BadgeProps) => {
  return (
    <div className={composeClasses(className, styles.badgeWrapper)} {...props}>
      <span className={composeClasses(styles.badgeStatus, styles[as])}>
        {text}
      </span>
    </div>
  );
};

export default Badge;
