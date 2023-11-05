"use client";

import React from "react";
import AddExpense from "@components/Expense/AddExpense";
import { DataTable } from "@components/DataTable/DataTable";
import { large_columns } from "./Columns";
import FormDialog from "@components/Form/FormDialog";
import { Button } from "@UI/button";

function Expense({ data, hostelsData }) {
  return (
    <>
      <div className="flex flex-row gap-5 ml-10">
        <Button variant="ghost">Total Expenses : {data.length}</Button>

        <FormDialog title="Add Expense" triggerTitle="Add Expense">
          <AddExpense hostelsData={hostelsData} />
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
