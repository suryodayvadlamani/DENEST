"use client";
import { getExpensesFn } from "@/app/helpers/expense";
import React, { useMemo, useState } from "react";
import AddExpense from "@components/Expense/AddExpense";
import { DataTable } from "@components/DataTable/DataTable";
import { columns, detailed_columns } from "./Columns";
import FormDialog from "@components/Form/FormDialog";
import { Button } from "@UI/button";
import { getExpensesTypeFn } from "@/app/helpers/expense";
function Expense({ hostelsData }) {
  const { data } = getExpensesFn("All");

  const [expType, setExpType] = useState("");
  const rowClicked = (data) => {
    setExpType(data.expenseType);
  };

  const getSum = (total, cur) => {
    return total + cur._sum.amount;
  };

  const { data: expenseTypeData } = getExpensesTypeFn(expType);
  const totalExpenses = useMemo(() => {
    if (!data?.data) return 0;
    return data.data.reduce(getSum, 0);
  }, [data?.data]);

  const flatData = useMemo(() => {
    if (!expenseTypeData?.pages[0]) return [];
    return expenseTypeData?.pages?.flatMap((page) => page?.data) ?? [];
  }, [expenseTypeData?.pages]);

  return (
    <>
      <div className="flex flex-row gap-5 ml-10">
        <Button variant="ghost">Total Expenses : {totalExpenses}</Button>

        <FormDialog title="Add Expense" triggerTitle="Add Expense">
          <AddExpense hostelsData={hostelsData} />
        </FormDialog>
      </div>
      <section className="flex flex-col md:flex-row gap-2">
        {data?.data.length > 0 && (
          <DataTable
            columns={columns}
            data={data.data}
            pagination={true}
            rowClick={rowClicked}
            sorting={true}
            className={"mt-4 md:w-1/3 "}
          />
        )}
        {flatData.length > 0 && (
          <DataTable
            columns={detailed_columns}
            data={flatData}
            pagination={true}
            sorting={true}
            className={"mt-4 md:w-2/3 "}
          />
        )}
      </section>
    </>
  );
}

export default Expense;
