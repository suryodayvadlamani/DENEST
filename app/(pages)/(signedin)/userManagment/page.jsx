import Users from "@components/User/Users";
import getQueryClient from "@lib/getQueryClient";
import Hydrate from "@lib/Hydrate";
import { USERS } from "@lib/Query_Keys";
import { dehydrate } from "@tanstack/query-core";
import { getUsers } from "@/app/server_functions/User";

export default async function UserManagement() {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery([USERS], () => getUsers());
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Users />
    </Hydrate>
  );
}
