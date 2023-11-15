import { getVendors } from "@/app/server_functions/Vendor";
import Vendors from "@/app/components/Vendor/Vendors";
import { VENDORS } from "@lib/Query_Keys";

import getQueryClient from "@lib/getQueryClient";
import Hydrate from "@lib/Hydrate";

import { dehydrate } from "@tanstack/query-core";

const VendorManagment = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery([VENDORS], () => getVendors());
  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <Vendors />
    </Hydrate>
  );
};
export default VendorManagment;
