"use client";
import { Button } from "@UI/button";
import { DataTable } from "@components/DataTable/DataTable";
import { columns } from "./Columns";
import { useSession } from "next-auth/react";

import FormDialog from "@components/Form/FormDialog";
import { useStore } from "@/app/store/store";
import AddVendor from "./AddVendor";

const Vendors = () => {
  const { status, data: session } = useSession({ required: true });

  const vendorData = useStore((state) => {
    return state.vendors;
  });
  if (status == "loading") return "loading";
  return (
    <>
      <section className="flex flex-row gap-5 items-center">
        <Button variant="ghost">Total Vendors {vendorData?.length}</Button>
        {session.role === "ADMIN" && (
          <FormDialog title="Add User" triggerTitle="+Add Vendor">
            <AddVendor />
          </FormDialog>
        )}
      </section>

      {vendorData?.length > 0 && (
        <DataTable
          columns={columns}
          data={vendorData}
          pagination={true}
          sorting={true}
          className={"mt-4 flex-1"}
        />
      )}
    </>
  );
};

export default Vendors;
