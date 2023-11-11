import { getVendors } from "@/app/server_functions/Vendor";
import Vendors from "@/app/components/Vendor/Vendors";
import StoreInitializer from "@/app/components/StoreInitializer";

const VendorManagment = async () => {
  const { data } = await getVendors();

  return (
    <>
      <StoreInitializer filter={{ nams: "" }} vendors={data} />
      <Vendors />
    </>
  );
};
export default VendorManagment;
