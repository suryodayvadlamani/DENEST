import Tenantpay from "@components/TenantPay/TenantPay";
import { getTenantPay } from "@/app/server_functions/TenantPay";

const page = async () => {
  const { isError, data } = await getTenantPay();

  if (isError) {
    return <p>Sorry Error</p>;
  }
  return <Tenantpay data={data} />;
};

export default page;
