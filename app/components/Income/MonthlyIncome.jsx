"use client";
import { DataTable } from "@components/DataTable/DataTable";
import { columns } from "@components/Income/Columns";

import { getUsersFnMonthWise } from "@/app/helpers/income";
import { useMemo } from "react";

function MonthlyIncome() {
  const { data: usersDataDayWise, error } = getUsersFnMonthWise("true");

  const flatData1 = useMemo(() => {
    if (!usersDataDayWise?.pages[0]) return [];
    return usersDataDayWise?.pages?.flatMap((page) => page?.data?.data) ?? [];
  }, [usersDataDayWise?.pages]);

  return <></>;
}

export default MonthlyIncome;
