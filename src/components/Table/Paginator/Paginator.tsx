import React from "react";
import styles from "./Paginator.module.css";
import { composeClasses } from "../../../libs/utils";

export interface PaginatorProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  requestNextPage: Function;
  requestPrevPage: Function;
  requestAnyPage: Function;
  canProceedTo: Function;
  pageState: {
    pageCount: number;
    pageIndex: number;
    totalPageItemsCount: number;
    pageSize: number;
  };
  setPageSize?: Function;
}

const calculateRange = (
  fromIndex: number,
  toIndex: number,
  step: number = 1
): number[] => {
  let index = fromIndex;
  const range = [];

  while (index <= toIndex) {
    range.push(index);
    index += step;
  }

  return range;
};

const fetchPageNumbers = (pageCount: number, currentPageIndex: number) => {
  let pages = calculateRange(1, pageCount);
  return {
    pageNumbers: pages
  };
};

const Paginator: React.FC<PaginatorProps> = ({
  requestNextPage,
  requestPrevPage,
  requestAnyPage,
  canProceedTo,
  pageState = {
    pageIndex: 0,
    pageCount: -1,
    totalPageItemsCount: 0,
    pageSize: 0
  },
  setPageSize = () => undefined,
  className = "",
  ...props
}: PaginatorProps) => {
  const { pageNumbers } = fetchPageNumbers(
    pageState.pageCount,
    pageState.pageIndex
  );

  return (
    <div
      className={composeClasses(className, styles.paginatorWrapper)}
      {...props}
    >
      <div className={styles.paginatorCarousel}>
        <span>
          {pageState.pageIndex + 1}-{pageState.pageSize}
        </span>
        <span>
          <button
            className={composeClasses(
              styles.paginatorPin,
              canProceedTo("previous") ? "" : styles.inActive
            )}
            onClick={() => requestPrevPage()}
          >
            {"<"}
          </button>
          {pageNumbers.map((pageNumber, index) => {
            return (
              <button
                key={String(index)}
                className={styles.paginatorPin}
                onClick={() => requestAnyPage(Number(pageNumber) - 1)}
                disabled={Number(pageNumber) - 1 === pageState.pageIndex}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            className={composeClasses(
              styles.paginatorPin,
              canProceedTo("next") ? "" : styles.inActive
            )}
            onClick={() => requestNextPage()}
          >
            {">"}
          </button>
        </span>
      </div>
    </div>
  );
};

export default Paginator;
