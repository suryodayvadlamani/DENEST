import Expense from "@components/Expense/Expense";
import { getExpense } from "@/app/server_functions/Expense";
import { getHostels } from "@/app/server_functions/Hostels";

import getQueryClient from "@lib/getQueryClient";
import Hydrate from "@lib/Hydrate";
import { HOSTELS, EXPENSES } from "@lib/Query_Keys";
import { dehydrate } from "@tanstack/query-core";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const Expenses = async () => {
  const queryClient = getQueryClient();
  const session = await getServerSession(authOptions);
  const { data: hostelsData } = await getHostels();

  if (session) {
    await queryClient.prefetchQuery([EXPENSES], () => getExpense());
  }
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Expense hostelsData={hostelsData} />
    </Hydrate>
  );
};

export default Expenses;
