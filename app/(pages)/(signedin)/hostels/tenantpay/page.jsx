import TenantPay from "@components/TenantPay/TenantPay";
import { getTenantPay } from "@/app/server_functions/Tenantpay";
import { useStore } from "@/app/store/store";
import getQueryClient from "@/app/lib/getQueryClient";
import Hydrate from "@lib/Hydrate";
import { TENANT_PAY } from "@lib/Query_Keys";
import { dehydrate } from "@tanstack/query-core";

export default async function TenantPayment() {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery([TENANT_PAY], () => getTenantPay());
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <TenantPay />
    </Hydrate>
  );
}
