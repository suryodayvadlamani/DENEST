"use client";

import React, { useState } from "react";
import DatePickerWithRange from "@components/DatePickerWithRange";
import { Skeleton } from "@UI/skeleton";
import AddIncome from "@components/Income/AddIncome";
import FormDialog from "@components/Form/FormDialog";
import { Button } from "@UI/button";
import { useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@UI/tabs";

import DayWiseIncome from "@components/Income/DayWiseIncome";

const Income = () => {
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("activeTab") || "daywise";
  const today = new Date();
  const starDate = new Date(today.getFullYear(), today.getMonth(), 1);

  today.setHours(23, 59, 59, 999);
  starDate.setHours(0, 0, 0, 0);
  const [date, setDate] = useState({
    startDate: starDate.toISOString(),
    endDate: today.toISOString(),
  });

  const callBack = (selectedDate) => {
    setDate({ ...selectedDate });
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
        <DayWiseIncome date={date} />
      </div>
    </>
  );
};

export default Income;
