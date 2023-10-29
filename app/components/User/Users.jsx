"use client";
import { Button } from "@UI/button";
import { Input } from "@UI/input";
import { BsSearch } from "react-icons/bs";
import { useState } from "react";
import { DataTable } from "@components/User/DataTable";
import { columns } from "@components/User/Columns";
import AddTenant from "@components/User/AddTenant";
import {
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";

import FormDialog from "@components/Form/FormDialog";

function Users({ data }) {
  const [columnFilters, setColumnFilters] = useState();
  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <>
      <div
        className="flex max-w-sm mx-10 my-5 items-center space-x-2 border-input border
        rounded-md 
        ring-offset-background
        focus-within:outline-none
         focus-within:ring-2 
         focus-within:ring-ring 
         focus-within:ring-offset-2"
      >
        <BsSearch className="mx-2" />
        <Input
          placeholder="Filter emails..."
          value={table.getColumn("email")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className=" border-0 hover:border-0 pl-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div className="flex flex-row gap-5 ml-10">
        <Button variant="ghost">Total Users {data?.length}</Button>

        <FormDialog title="Add User" triggerTitle="+Add User">
          <AddTenant />
        </FormDialog>
      </div>
      {data?.length > 0 && (
        <DataTable className="mt-4" columns={columns} table={table} />
      )}
    </>
  );
}

export default Users;
