import React from "react";

import { getDuesFn } from "@/app/helpers/dues";
import { columns2 } from "./Columns2";
import { DataTable } from "./DataTable";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
const AddDue = () => {
  const { data: dueData } = getDuesFn();
  const tableData = dueData?.data?.slice(0, 8);
  const table = useReactTable({
    data: tableData,
    columns: columns2,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      {tableData?.length > 0 && (
        <DataTable
          columns={columns2}
          table={table}
          title={"Defaulters"}
          pagination={false}
          className={"mt-4 flex-1"}
        />
      )}
    </>
  );
};

export default AddDue;
