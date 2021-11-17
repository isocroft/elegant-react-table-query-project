import React from "react";

import styles from "./Dropdown.module.css";
import { composeClasses } from "../../libs/utils";

export enum DropdownDisplay {
  FillAvailable = "fill",
  FitInline = "shrink"
}

export enum AlignOptions {
  Left = "left",
  Right = "right"
}

export type DropdownMenuItem = {
  text: string;
  onClick: Function;
};

export interface DropdownProps<T extends object>
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLMenuElement>,
    HTMLMenuElement
  > {
  children: React.ReactChild;
  align?: AlignOptions;
  display?: DropdownDisplay;
  links: Array<
    DropdownMenuItem & {
      onClick: (event: React.MouseEvent<HTMLElement>, data?: T) => void;
    }
  >;
}

function Dropdown<S extends object>({
  children,
  className = "",
  links,
  align = AlignOptions.Left,
  display = DropdownDisplay.FitInline,
  ...props
}: DropdownProps<S>) {
  return (
    <div
      className={composeClasses(
        className,
        styles.dropdownBox,
        display === DropdownDisplay.FitInline
          ? ""
          : styles[DropdownDisplay.FillAvailable]
      )}
    >
      <section className={styles.dropdownChildBox}>{children}</section>
      <section
        className={composeClasses(styles.dropdownWrapper, styles[align])}
      >
        <menu className={styles.dropdownMenu} {...props}>
          {links.map((link, index) => {
            return (
              <li onClick={link.onClick} key={String(index)}>
                <span>{link.text}</span>
              </li>
            );
          })}
        </menu>
      </section>
    </div>
  );
}

export default Dropdown;
