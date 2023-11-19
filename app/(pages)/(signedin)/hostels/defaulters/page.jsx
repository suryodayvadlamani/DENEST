import { getDefaulters } from "@/app/server_functions/Hostels";
import AddDue from "@components/Dashboard/AddDue";
import getQueryClient from "@/app/lib/getQueryClient";
import Hydrate from "@lib/Hydrate";

import { dehydrate } from "@tanstack/query-core";
import { DUES } from "@/app/lib/Query_Keys";

export default async function Defaulters() {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery([DUES], () => getDefaulters());
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <AddDue />
    </Hydrate>
  );
}
