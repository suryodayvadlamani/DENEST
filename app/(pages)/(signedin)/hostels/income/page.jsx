import Income from "@components/Income/Income";
import getQueryClient from "@lib/getQueryClient";
import Hydrate from "@lib/Hydrate";
import { INCOME } from "@lib/Query_Keys";
import { dehydrate } from "@tanstack/query-core";
import { getDayIncome } from "@/app/server_functions/Income";

export default async function DayIncome() {
  const queryClient = getQueryClient();
  const today = new Date();
  let startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  startDate.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);
  const date = {
    startDate: startDate.toISOString(),
    endDate: today.toISOString(),
  };
  await queryClient.prefetchInfiniteQuery([INCOME, { ...date }], () =>
    getDayIncome(date)
  );
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Income />
    </Hydrate>
  );
}
