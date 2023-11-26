"use client";

import React, { useState } from "react";
import DatePickerWithRange from "@components/DatePickerWithRange";
import { Skeleton } from "@UI/skeleton";
import AddIncome from "@components/Income/AddIncome";
import FormDialog from "@components/Form/FormDialog";
import { Button } from "@UI/button";
import { useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@UI/tabs";
import MonthlyIncome from "@components/Income/MonthlyIncome";
import DayWiseIncome from "@components/Income/DayWiseIncome";

const Income = () => {
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("activeTab") || "daywise";
  const today = new Date();
  const [date, setDate] = useState({
    startDate: new Date(today.getFullYear(), today.getMonth(), 1).toISOString(),
    endDate: today.toISOString(),
  });
  const callBack = (date) => {
    setDate({ ...date });
  };
  return (
    <>
      <div className="flex flex-col md:flex-row gap-5 items-center w-full">
        <DatePickerWithRange defaultDate={date} callBack={callBack} />
        <div className="flex flex-row gap-1">
          <FormDialog title="Add Income" triggerTitle="Add Income">
            <AddIncome />
          </FormDialog>
        </div>
      </div>
      <div className="my-2">
        <DayWiseIncome />
      </div>
    </>
  );
};

export default Income;
