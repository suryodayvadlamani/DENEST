import Tenantpay from "@components/TenantPay/TenantPay";
import { getTenantPay } from "@/app/server_functions/Tenantpay";
import { useStore } from "@/app/store/store";
const page = async () => {
  useStore.setState({ filter: { name: "surya" } });
  const { isError, data } = await getTenantPay();
  if (isError) {
    return <p>Sorry Error</p>;
  }
  return <Tenantpay data={data} />;
};

export default page;
