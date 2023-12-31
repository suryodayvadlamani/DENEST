import React from "react";
import Dashboard from "@components/Dashboard/Dashboard";
import { getDashboard } from "@/app/server_functions/manageDashboard";
import Income from "@components/Income/Income";
import getQueryClient from "@lib/getQueryClient";
import Hydrate from "@lib/Hydrate";
import { DASHBOARD } from "@lib/Query_Keys";
import { dehydrate } from "@tanstack/query-core";

export default async function DashboardPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery([DASHBOARD], () => getDashboard());
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Dashboard />
    </Hydrate>
  );
}
