// import React, { useState } from "react";

// const [ progressState, setProgressState ] = useState<number>(0)
// const nextProgressStep = (step = 1) => {
//   if(progressState.percentage === 100) return
//   setProgressState(prevState => ({ percentage: prevState.percentage + step }))
// }
import React, { useEffect } from "react";

import {
  useRowSelect,
  useTable,
  useFilters,
  usePagination,
  useGlobalFilter,
  Row,
  Cell,
  Column,
  TableToggleCommonProps,
  IdType,
  TableInstance
} from "react-table";

import SearchBar from "./SearchBar/SearchBar";
import Paginator from "./Paginator/Paginator";
import ProgressBar, {
  ProgressBarDisplay,
  ProgressModes
} from "../../components/ProgressBar/ProgressBar";
import Dropdown, {
  DropdownMenuItem,
  DropdownDisplay,
  AlignOptions
} from "../../components/Dropdown/Dropdown";

import styles from "./Table.module.css";
import { composeClasses, formatHTMLEntity } from "../../libs/utils";

declare module "react-table" {
  /* eslint-disable @typescript-eslint/no-unused-vars */

  // tslint:disable:no-empty-interface
  // no-empty-interface is disabled to allow easy extension with declaration merging

  // tslint:disable:no-unnecessary-generics

  /* eslint-disable @typescript-eslint/no-namespace */

  /**
   * The empty definitions of below provides a base definition for the parts used by useTable, that can then be extended in the users code.
   *
   * @example
   *  export interface TableOptions<D extends object = {}}>
   *    extends
   *      UseExpandedOptions<D>,
   *      UseFiltersOptions<D> {}
   * see https://gist.github.com/ggascoigne/646e14c9d54258e40588a13aabf0102d for more details
   */
  export interface TableOptions<D extends object> extends UseTableOptions<D> {
    manualPagination?: boolean;
    pageCount?: number;
  }

  export interface TableInstance<D extends object = {}>
    extends Omit<TableOptions<D>, "columns" | "pageCount">,
      UseTableInstanceProps<D> {}

  export interface TableState<D extends object = {}>
    extends UsePaginationState<D>,
      UseGlobalFiltersState<D>,
      UseRowSelectState<D> {
    hiddenColumns?: Array<IdType<D>> | undefined;
  }

  export interface Hooks<D extends object = {}> extends UseTableHooks<D> {}

  export interface Cell<D extends object = {}, V = any>
    extends UseTableCellProps<D, V> {}

  export interface ColumnInterface<D extends object = {}>
    extends UseTableColumnOptions<D> {}

  export interface ColumnInterfaceBasedOnValue<D extends object = {}, V = any> {
    Cell?: Renderer<CellProps<D, V>> | undefined;
  }

  export interface ColumnInstance<D extends object = {}>
    extends Omit<ColumnInterface<D>, "id">,
      ColumnInterfaceBasedOnValue<D>,
      UseTableColumnProps<D> {}

  export interface HeaderGroup<D extends object = {}>
    extends ColumnInstance<D>,
      UseTableHeaderGroupProps<D> {}

  export interface Row<D extends object = {}>
    extends UseTableRowProps<D>,
      UseRowSelectRowProps<D> {}

  export interface ReducerTableState<D extends object>
    extends TableState<D>,
      Record<string, any> {}

  type UpdateHiddenColumns<D extends object> = (
    oldHidden: Array<IdType<D>>
  ) => Array<IdType<D>>;

  export interface TableToggleHideAllColumnProps
    extends TableToggleCommonProps {}

  export interface UseTableInstanceProps<D extends object>
    extends UsePaginationInstanceProps<D>,
      UseGlobalFiltersInstanceProps<D>,
      UseRowSelectInstanceProps<D> {
    state: TableState<D>;
    plugins: Array<PluginHook<D>>;
    dispatch: TableDispatch;
    columns: Array<ColumnInstance<D>>;
    allColumns: Array<ColumnInstance<D>>;
    visibleColumns: Array<ColumnInstance<D>>;
    headerGroups: Array<HeaderGroup<D>>;
    footerGroups: Array<HeaderGroup<D>>;
    headers: Array<ColumnInstance<D>>;
    flatHeaders: Array<ColumnInstance<D>>;
    rows: Array<Row<D>>;
    rowsById: Record<string, Row<D>>;
    getTableProps: (propGetter?: TablePropGetter<D>) => TableProps;
    getTableBodyProps: (propGetter?: TableBodyPropGetter<D>) => TableBodyProps;
    prepareRow: (row: Row<D>) => void;
    flatRows: Array<Row<D>>;
    totalColumnsWidth: number;
    allColumnsHidden: boolean;
    toggleHideColumn: (columnId: IdType<D>, value?: boolean) => void;
    setHiddenColumns: (
      param: Array<IdType<D>> | UpdateHiddenColumns<D>
    ) => void;
    toggleHideAllColumns: (value?: boolean) => void;
    getToggleHideAllColumnsProps: (
      props?: Partial<TableToggleHideAllColumnProps>
    ) => TableToggleHideAllColumnProps;
    getHooks: () => Hooks<D>;
  }
}

enum Direction {
  Next = "next",
  Prev = "previous"
}

const IndeterminateCheckbox = React.forwardRef<
  HTMLInputElement,
  TableToggleCommonProps
>(({ indeterminate, ...rest }, ref: React.Ref<HTMLInputElement>) => {
  const defaultRef = React.useRef<HTMLInputElement>(null);
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    if (typeof resolvedRef === "object" && resolvedRef.current) {
      resolvedRef.current.indeterminate = Boolean(indeterminate);
    }
  }, [resolvedRef, indeterminate]);

  return (
    <>
      <input type="checkbox" ref={resolvedRef} {...rest} />
    </>
  );
});

interface TableProps<T extends object>
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  tableDropdownItems?: DropdownMenuItem[];
  tableInitialState: {
    tablePageCount: number;
    tablePageSize?: number;
    tablePageIndex?: number;
  };
  onTableRowsSelected?: (selectedRows: T[]) => void;
  onTableStateChange: (pageNumber: number, pageSize?: number) => void;
  tableOptions: {
    columns: Array<Column<T>>;
    data: Array<T>;
    canHideColumns?: boolean;
    paginateManually?: boolean;
    captionText?: string;
  };
  tableCellValueFormatter?: (
    columnAccessor: IdType<T>,
    rowDatum: T
  ) => React.ReactNode;
}

function Table<P extends object>({
  className = "",
  tableDropdownItems = [],
  onTableRowsSelected,
  onTableStateChange,
  tableCellValueFormatter,
  tableInitialState,
  tableOptions,
  ...props
}: TableProps<P>) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setGlobalFilter,
    canPreviousPage,
    canNextPage,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    pageOptions,
    preGlobalFilteredRows,
    selectedFlatRows,
    state,
    allColumns,
    pageCount,
    page
  } = useTable<P>(
    {
      columns: tableOptions.columns,
      data: tableOptions.data,
      initialState: {
        pageIndex: tableInitialState.tablePageIndex || 0,
        pageSize:
          tableInitialState.tablePageSize ||
          Math.floor(tableOptions.data.length / 2) ||
          1
      },
      manualPagination: tableOptions.paginateManually,
      pageCount: tableInitialState.tablePageCount
    },
    useFilters,
    useGlobalFilter,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => {
        type CustomColumnInstance = {
          id: string;
          Header?: (instance: TableInstance<P>) => JSX.Element | null;
          Cell: (cell: Cell<P>) => React.ReactNode;
        };

        const modifiedColumns: CustomColumnInstance[] = [
          /* @HINT: Let's make a column for selection */
          {
            id: "selection",
            /* @HINT: The header can use the table's getToggleAllRowsSelectedProps method */
            /* @HINT: to render a checkbox */
            Header: ({ getToggleAllRowsSelectedProps }: TableInstance<P>) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            /* @HINT: The cell can use the individual row's getToggleRowSelectedProps method */
            /* @HINT: to the render a checkbox */
            Cell: ({ row }: Cell<P>) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            )
          },
          /* @HINT: here we modify the column details to suite what we want */
          ...columns.map((column, index) => {
            const allColumnsIndex = index + 1;
            return {
              ...column,
              Header: () => {
                return (
                  <label>
                    {tableOptions.canHideColumns ? (
                      <input
                        type="checkbox"
                        {...allColumns[allColumnsIndex].getToggleHiddenProps()}
                      />
                    ) : null}{" "}
                    {typeof column.Header === "function"
                      ? (column.Header as Function)()
                      : column.Header}
                  </label>
                );
              },
              Cell: ({ row, value }: Cell<P>) => {
                if (typeof tableCellValueFormatter === "function") {
                  return tableCellValueFormatter(
                    column.id,
                    Object.assign({}, row.original)
                  );
                }

                return String(value);
              }
            } as CustomColumnInstance;
          })
        ];

        if (tableDropdownItems.length) {
          /* @HINT: Let's make a column for actions - custom dropdown controls column */
          modifiedColumns.push({
            id: "actions",
            Cell: ({ row }: Cell<P>) => {
              return (
                <Dropdown<P>
                  links={tableDropdownItems.map((dropdownItem) => {
                    const { onClick } = dropdownItem;
                    return {
                      ...dropdownItem,
                      onClick: (event: React.MouseEvent) => {
                        return onClick(event, Object.assign({}, row.original));
                      }
                    };
                  })}
                  display={DropdownDisplay.FillAvailable}
                  align={AlignOptions.Right}
                >
                  <span className={styles.tableKebabIcon}>
                    {formatHTMLEntity("", "22EE")}
                  </span>
                </Dropdown>
              );
            }
          });
        }

        return modifiedColumns;
      });
    }
  );

  useEffect(() => {
    /* @HINT: we wish to be notified each time a row select checkbox is checked */
    if (typeof onTableRowsSelected === "function") {
      if (selectedFlatRows.length) {
        onTableRowsSelected(selectedFlatRows.map((row) => row.original));
      }
    }
  }, [onTableRowsSelected, selectedFlatRows]);

  useEffect(() => {
    /* @HINT: When these table states change, fetch new data! */

    /* @CHECK: https://react-table.tanstack.com/docs/faq#how-can-i-use-the-table-state-to-fetch-new-data */
    if (state.pageIndex !== 0 && tableOptions.data.length !== 0) {
      onTableStateChange(state.pageIndex + 1, state.pageSize);
    }
  }, [onTableStateChange, tableOptions.data, state.pageIndex, state.pageSize]);

  const canPageChange = (direction: string) => {
    if (direction === Direction.Next) {
      return canNextPage;
    }
    return canPreviousPage;
  };

  return (
    <div className={composeClasses(className, styles.tableWrapper)} {...props}>
      <section className={styles.tableControlsWrapper}>
        {
          <aside>
            <SearchBar
              setGlobalFilter={setGlobalFilter}
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={state.globalFilter}
            />
          </aside>
        }
        {
          <aside>
            <Paginator
              pageState={{
                pageCount,
                pageIndex: state.pageIndex,
                pageSize: state.pageSize,
                totalPageItemsCount: pageOptions.length
              }}
              setPageSize={setPageSize}
              requestNextPage={nextPage}
              requestPrevPage={previousPage}
              requestAnyPage={gotoPage}
              canProceedTo={canPageChange}
            />
          </aside>
        }
      </section>
      <table
        className={composeClasses(
          className,
          styles.table,
          tableDropdownItems.length ? styles.centerLastColumn : ""
        )}
        {...getTableProps()}
      >
        {tableOptions.captionText && (
          <caption>{tableOptions.captionText}</caption>
        )}
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {tableOptions.data.length ? (
            page.map((row: Row<P>) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell: Cell<P>) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })
          ) : (
            <tr data-progress-holder={true}>
              <td
                colSpan={
                  tableOptions.columns.length +
                  (tableDropdownItems.length > 0 ? 2 : 1)
                }
              >
                {
                  <ProgressBar
                    display={ProgressBarDisplay.FitInline}
                    mode={ProgressModes.IDTM}
                  />
                }
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
