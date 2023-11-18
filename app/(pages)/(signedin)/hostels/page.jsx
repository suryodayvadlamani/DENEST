import { getHostels } from "@/app/server_functions/Hostels";
import getQueryClient from "@lib/getQueryClient";
import Hydrate from "@lib/Hydrate";
import { HOSTELS } from "@lib/Query_Keys";
import { dehydrate } from "@tanstack/query-core";
import Main from "./Main";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Hostels() {
  const queryClient = getQueryClient();
  const session = await getServerSession(authOptions);
  if (session) await queryClient.prefetchQuery([HOSTELS], () => getHostels());

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Main />
    </Hydrate>
  );
}
