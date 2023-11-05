"use client";
import AddTenantPay from "@components/TenantPay/AddTenantPay";
import { columns } from "@components/TenantPay/Columns";
import { DataTable } from "@components/DataTable/DataTable";
import FormDialog from "@components/Form/FormDialog";
import { BsSearch } from "react-icons/bs";
import { Input } from "@UI/input";
import { Button } from "@UI/button";

function Tenantpay({ data }) {
  return (
    <>
      <div className="flex flex-row gap-5 ml-10">
        <Button variant="ghost">Total Payments : {data.length}</Button>

        <FormDialog title="Add TenantPay" triggerTitle="Add Tenant Payment">
          <AddTenantPay />
        </FormDialog>
      </div>
      {data?.length > 0 && (
        <DataTable
          columns={columns}
          data={data}
          pagination={true}
          sorting={true}
          className={"mt-4 flex-1"}
        />
      )}
    </>
  );
}

export default Tenantpay;
