import React from "react";
import { useAsyncDebounce } from "react-table";

import styles from "./SearchBar.module.css";
import { composeClasses } from "../../../libs/utils";

interface SearchBarProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  preGlobalFilteredRows: Array<unknown>;
  setGlobalFilter: Function;
  globalFilter: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  preGlobalFilteredRows = [],
  globalFilter,
  setGlobalFilter,
  className,
  ...props
}: SearchBarProps) => {
  const count = preGlobalFilteredRows.length;
  const [, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <div
      className={composeClasses(className, styles.searchBarWrapper)}
      {...props}
    >
      <input
        id={"__react_table_searchbar"}
        className={styles.tableSearchBox}
        placeholder={`Search ${count} records...`}
        onChange={(event: React.FormEvent<HTMLInputElement>) => {
          const element = event.target as HTMLInputElement;
          setValue(element.value);
          onChange(element.value);
        }}
      />
    </div>
  );
};

export default SearchBar;
