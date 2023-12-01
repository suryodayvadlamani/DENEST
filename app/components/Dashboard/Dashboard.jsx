"use client";

import KPI from "./KPI";
import { Card, CardContent, CardTitle } from "@UI/card";
import dynamic from "next/dynamic";
import GaugeChart from "@components/Charts/Guage";
import { useEffect, useMemo } from "react";
import { useState } from "react";
import { columns } from "@components/Dashboard/Columns";
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
  const tblColumns = useMemo(() => columns, []);

  const callBack = (date) => {
    setDate({ ...date });
  };

  return (
    <div className="  flex justify-center items-center gap-3 h-full">
      <div className="flex flex-col gap-3 w-1/2  md:h-1/3">
        <DatePickerWithRange defaultDate={date} callBack={callBack} />
        <Card className="flex flex-col md:w-2/3 w-full">
          <CardContent className="m-2">
            Total Expenses in given range
          </CardContent>
          <CardTitle className="p-6">
            Expenses : {dashboardData?.data.totalExpense}
          </CardTitle>
        </Card>
        <Card className="flex flex-col  md:w-2/3 w-full">
          <CardContent className="m-2">Total Income in given range</CardContent>

          <CardTitle className="p-6">
            Income : {dashboardData?.data.totalRent}
          </CardTitle>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
