import React, { MouseEvent, useMemo } from "react";
import { Column } from "react-table";

import "./styles.css";

import {
  refetchAllVehicles,
  useGetAllVehicles,
  Vehicle
} from "./hooks/vehicles";

import Badge from "./components/Badge/Badge";
import Table from "./components/Table/Table";

interface Post {
  id: number;
  title: string;
  read: boolean;
}

export default function App() {
  const data: Post[] = [
    { id: 1, title: "First", read: false },
    { id: 2, title: "Second", read: true },
    { id: 3, title: "Third", read: false },
    { id: 4, title: "Fourth", read: true },
    { id: 5, title: "Fifth", read: false },
    { id: 6, title: "Sixth", read: false },
    { id: 7, title: "Seventh", read: false },
    { id: 8, title: "Eigth", read: true },
    { id: 9, title: "Ninth", read: true },
    { id: 10, title: "Tenth", read: true },
    { id: 11, title: "Eleventh", read: false },
    { id: 12, title: "Twelfth", read: true },
    { id: 13, title: "Thirteenth", read: true },
    { id: 14, title: "Fourteenth", read: false },
    { id: 15, title: "Fifteenth", read: false },
    { id: 16, title: "Sixteenth", read: true }
  ];

  const columns = useMemo<Column<Post>[]>(
    () => [
      {
        Header: "ID",
        accessor: "id"
      },
      {
        Header: "Title",
        accessor: "title"
      },
      {
        Header: "Marked Read?",
        accessor: "read"
      }
    ],
    []
  );

  const vColumns = useMemo<Column<Vehicle>[]>(
    () => [
      {
        Header: "ID",
        accessor: "id"
      },
      {
        Header: "Model",
        accessor: "model"
      },
      {
        Header: "Make",
        accessor: "make"
      },
      {
        Header: "Price",
        accessor: "price"
      }
    ],
    []
  );

  const { setVehicles, vehicles } = useGetAllVehicles();
  const onTableStateChange = (pageNumber) => {
    refetchAllVehicles(pageNumber).then(setVehicles);
  };

  return (
    <div className="App">
      <Table<Vehicle>
        tableOptions={{
          data: vehicles,
          columns: vColumns,
          canHideColumns: true,
          captionText: "My Top Vehicles",
          paginateManually: false
        }}
        tableInitialState={{
          tablePageCount: 2,
          tablePageSize: 2
        }}
        tableDropdownItems={[
          {
            text: "Retire",
            onClick: (event: MouseEvent, row: Vehicle) => {
              event.stopPropagation();
              alert(`retire "${row.make}" ?`);
            }
          },
          {
            text: "Promote",
            onClick: () => alert("promote ?")
          }
        ]}
        onTableRowsSelected={(rows: Vehicle[]) => {
          alert(`${rows.map((row) => row.make).join(", ")};  selected!`);
        }}
        onTableStateChange={onTableStateChange}
      />

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      <Table<Post>
        tableOptions={{
          columns,
          data,
          paginateManually: false
        }}
        tableInitialState={{
          tablePageCount: 2,
          tablePageSize: 8
        }}
        tableCellValueFormatter={(id: string, row: Post) => {
          const value = row[id as keyof Post];

          if (id === "title") {
            return <Badge text={String(value).toUpperCase()} />;
          }

          return typeof value === "boolean" ? String(value) : value;
        }}
        onTableStateChange={() => alert("state changed!")}
      />
    </div>
  );
}
