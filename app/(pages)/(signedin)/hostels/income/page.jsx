import Income from "@components/Income/Income";
import getQueryClient from "@lib/getQueryClient";
import Hydrate from "@lib/Hydrate";
import { INCOME } from "@lib/Query_Keys";
import { dehydrate } from "@tanstack/query-core";
import { getDayIncome } from "@/app/server_functions/Income";

export default async function DayIncome() {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery([INCOME, "false"], () =>
    getDayIncome()
  );
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Income />
    </Hydrate>
  );
}
