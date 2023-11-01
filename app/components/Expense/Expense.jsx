"use client";

import React from "react";
import AddExpense from "@components/Expense/AddExpense";
import { DataTable } from "@components/DataTable/DataTable";
import { large_columns } from "./Columns";
import FormDialog from "@components/Form/FormDialog";
import { BsSearch } from "react-icons/bs";
import { Input } from "@UI/input";
import { Button } from "@UI/button";

function Expense({ data }) {
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
          columns={large_columns}
          data={data}
          pagination={true}
          sorting={true}
          className={"mt-4 flex-1"}
        />
      )}
    </>
  );
}

export default Expense;
