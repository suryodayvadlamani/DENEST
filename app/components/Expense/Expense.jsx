"use client";

import React, { useState } from "react";
import AddExpense from "@components/Expense/AddExpense";
import { mobile_columns, large_columns } from "@components/Expense/Columns";
import { DataTable } from "@components/Expense/DataTable";
import FormDialog from "@components/Form/FormDialog";
import { BsSearch } from "react-icons/bs";
import { Input } from "@UI/input";
import { Button } from "@UI/button";
import {
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import useWindowDimensions from "@/app/hooks/useWindowDimension";

function Expense({ data }) {
  const { width, height } = useWindowDimensions();

  const [columnFilters, setColumnFilters] = useState();
  const table = useReactTable({
    data: data,
    columns: width >= "900" ? large_columns : mobile_columns,
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
          placeholder="Filter expenseType..."
          value={table.getColumn("expenseType")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("expenseType")?.setFilterValue(event.target.value)
          }
          className=" border-0 hover:border-0 pl-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div className="flex flex-row gap-5 ml-10">
        <Button variant="ghost">Total Expenses : {data.length}</Button>

        <FormDialog title="Add Expense" triggerTitle="Add Expense">
          <AddExpense />
        </FormDialog>
      </div>
      {data.length > 0 && (
        <DataTable
          className="mt-4"
          columns={width >= "900" ? large_columns : mobile_columns}
          table={table}
        />
      )}
    </>
  );
}

export default Expense;
