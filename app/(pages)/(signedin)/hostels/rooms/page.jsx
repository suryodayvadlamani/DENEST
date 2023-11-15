import { getHostels } from "@/app/server_functions/Hostels";
import Hostel from "@components/Hostel/Hostel";
import getQueryClient from "@lib/getQueryClient";
import Hydrate from "@lib/Hydrate";
import { HOSTELS } from "@lib/Query_Keys";
import { dehydrate } from "@tanstack/query-core";

async function page() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery([HOSTELS], () => getHostels());
  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <Hostel />
    </Hydrate>
  );
}

export default page;
