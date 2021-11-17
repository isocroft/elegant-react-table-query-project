import React from "react";
import { composeClasses } from "../../libs/utils";
import styles from "./ProgressBar.module.css";

export enum ProgressBarDisplay {
  FillAvailable = "block",
  FitInline = "inline"
}

export enum ProgressModes {
  IDTM = "indeterminate",
  DTM = "determinate"
}

export interface ProgressBarProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  mode?: ProgressModes;
  display?: ProgressBarDisplay;
  percentage?: number;
}

const Filler = (props: { type: ProgressModes; percentage: number }) => {
  return (
    <div className={composeClasses(styles.filler, styles.animate)}>
      <span
        className={styles[props.type]}
        style={{ width: `${props.percentage > 100 ? 100 : props.percentage}%` }}
      >
        {props.type === ProgressModes.IDTM ? <span></span> : null}
      </span>
    </div>
  );
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  mode = ProgressModes.DTM,
  display = ProgressBarDisplay.FillAvailable,
  percentage = 0,
  ...props
}: ProgressBarProps) => {
  return (
    <div
      className={composeClasses(styles.progressBar, styles[display])}
      {...props}
    >
      <Filler
        type={mode}
        percentage={mode === ProgressModes.IDTM ? 100 : percentage}
      />
    </div>
  );
};

export default ProgressBar;
