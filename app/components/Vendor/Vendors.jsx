"use client";
import { Button } from "@UI/button";
import { DataTable } from "@components/DataTable/DataTable";
import { columns } from "./Columns";
import { useSession } from "next-auth/react";
import FormDialog from "@components/Form/FormDialog";
import AddVendor from "./AddVendor";
import { getVendorsFn } from "@/app/helpers/vendor";

const Vendors = () => {
  const { data: vendorData } = getVendorsFn();

  return (
    <>
      <section className="flex flex-row gap-5 items-center">
        <FormDialog title="Add User" triggerTitle="+Add Vendor">
          <AddVendor />
        </FormDialog>
      </section>

      {vendorData?.data.length > 0 && (
        <DataTable
          columns={columns}
          data={vendorData.data}
          pagination={true}
          sorting={true}
          className={"mt-4 flex-1"}
        />
      )}
    </>
  );
};

export default Vendors;
