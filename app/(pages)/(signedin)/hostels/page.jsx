import React from "react";
import { getHostels } from "@/app/server_functions/Hostels";
import getQueryClient from "@lib/getQueryClient";
import Hydrate from "@lib/Hydrate";
import { HOSTELS } from "@lib/Query_Keys";
import { dehydrate } from "@tanstack/query-core";
import Main from "./Main";
export default async function Hostels() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const filters = `startDate=${firstDay.toISOString()}`;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery([HOSTELS], () => getHostels(filters));
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Main />
    </Hydrate>
  );
}
