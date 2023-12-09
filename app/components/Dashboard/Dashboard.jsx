"use client";

import KPI from "./KPI";
import { Card, CardContent, CardTitle } from "@UI/card";
import dynamic from "next/dynamic";
import GaugeChart from "@components/Charts/Guage";
import { useEffect, useMemo } from "react";
import { useState } from "react";

import { DataTable } from "@components/DataTable/DataTable";
import AddDue from "@components/Dashboard/AddDue";
import DatePickerWithRange from "@components/DatePickerWithRange";
import { getDashboardsFn } from "@/app/helpers/dashboard";

// const Barchart = dynamic(() => import("@components/Charts/Barchart"), {
//   ssr: false,
// });

const Dashboard = () => {
  const today = new Date();
  const [date, setDate] = useState({
    startDate: new Date(today.getFullYear(), today.getMonth(), 1).toISOString(),
    endDate: today.toISOString(),
  });
  const {
    isLoading,
    isError,
    data: dashboardData,
    error,
    refetch,
  } = getDashboardsFn(date);

  const callBack = (date) => {
    setDate({ ...date });
  };

  return (
    <div className="flex mt-3 flex-col gap-3  items-center justify-center">
      <DatePickerWithRange defaultDate={date} callBack={callBack} />
      <Card className="flex flex-col items-center justify-center  w-80 md:w-1/2">
        <CardContent className="mt-4">
          Total Expenses in given range
        </CardContent>
        <CardTitle className="p-4">
          Expenses : {dashboardData?.data?.totalExpense}
        </CardTitle>
      </Card>
      <Card className="flex flex-col items-center justify-center md:w-1/2 w-80">
        <CardContent className="mt-4">Total Income in given range</CardContent>

        <CardTitle className="p-4">
          Income : {dashboardData?.data.totalRent}
        </CardTitle>
      </Card>
    </div>
  );
};

export default Dashboard;
