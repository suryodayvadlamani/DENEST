import React from "react";
import Dashboard from "@components/Dashboard/Dashboard";
import { getExpense } from "@/app/server_functions/Expense";
import { getDashboard } from "@/app/server_functions/manageDashboard";
import { getHostels } from "@/app/server_functions/Hostels";

const page = async () => {
  const { data: hostelsData } = await getHostels();
  const { data: dashboardData } = await getDashboard();
  const { data: allExpenseData } = await getExpense();
  return (
    <Dashboard
      hostelsData={hostelsData}
      dashboardData={dashboardData}
      allExpenseData={allExpenseData}
    />
  );
};

export default page;
