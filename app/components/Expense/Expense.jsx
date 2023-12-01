"use client";
import { getExpensesFn } from "@/app/helpers/expense";
import React, { Suspense, useMemo, useState } from "react";
import AddExpense from "@components/Expense/AddExpense";
import { DataTable } from "@components/DataTable/DataTable";
import { columns, detailed_columns } from "./Columns";
import FormDialog from "@components/Form/FormDialog";
import { Button } from "@UI/button";
import { getExpensesTypeFn } from "@/app/helpers/expense";
import DatePickerWithRange from "@components/DatePickerWithRange";
import { Skeleton } from "@UI/skeleton";

function Expense({ hostelsData }) {
  const today = new Date();
  const [date, setDate] = useState({
    startDate: new Date(today.getFullYear(), today.getMonth(), 1).toISOString(),
    endDate: today.toISOString(),
  });

  const {
    data,
    isFetching: mainFetch,
    refetch: mainRefetch,
  } = getExpensesFn("All", date);

  const [expType, setExpType] = useState("");
  const rowClicked = (data) => {
    setExpType(data.expenseType);
  };

  const getSum = (total, cur) => {
    return total + cur._sum.amount;
  };

  const {
    data: expenseTypeData,
    refetch,
    isFetching,
  } = getExpensesTypeFn(expType, date);
  const totalExpenses = useMemo(() => {
    if (!data?.data) return 0;
    return data.data.reduce(getSum, 0);
  }, [data?.data]);
  const callBack = (date) => {
    setDate({ ...date });
  };
  const flatData = useMemo(() => {
    if (!expenseTypeData?.pages[0]) return [];
    return expenseTypeData?.pages?.flatMap((page) => page?.data) ?? [];
  }, [expenseTypeData?.pages]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-5 items-center w-full">
        <DatePickerWithRange defaultDate={date} callBack={callBack} />
        <div className="flex flex-row gap-1">
          <Button variant="ghost">Total Expenses : {totalExpenses}</Button>

          <FormDialog title="Add Expense" triggerTitle="Add Expense">
            <AddExpense hostelsData={hostelsData} />
          </FormDialog>
        </div>
      </div>

      <section className="flex flex-col md:flex-row gap-2">
        {mainFetch ? (
          <Skeleton className="w-1/3 h-70" />
        ) : (
          data?.data?.length > 0 && (
            <DataTable
              columns={columns}
              data={data.data}
              pagination={true}
              rowClick={rowClicked}
              sorting={true}
              className={"mt-4 md:w-1/3 "}
            />
          )
        )}
        {isFetching ? (
          <Skeleton className="w-2/3 h-80" />
        ) : (
          flatData.length > 0 && (
            <DataTable
              columns={detailed_columns}
              data={flatData}
              pagination={true}
              sorting={true}
              className={"mt-4 md:w-2/3 "}
            />
          )
        )}
      </section>
    </>
  );
}

export default Expense;
