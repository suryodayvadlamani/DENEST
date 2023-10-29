import Tenantpay from "@components/TenantPay/Tenantpay";
import { getTenantPay } from "@/app/server_functions/Tenantpay";

const page = async () => {
  const { isError, data } = await getTenantPay();

  if (isError) {
    return <p>Sorry Error</p>;
  }
  return <Tenantpay data={data} />;
};

export default page;
