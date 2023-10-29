"use client";
import AddTenantPay from "@components/TenantPay/AddTenantPay";
import { columns } from "@components/TenantPay/Columns";
import { DataTable } from "@components/TenantPay/DataTable";
import FormDialog from "@components/Form/FormDialog";
import { BsSearch } from "react-icons/bs";
import { Input } from "@UI/input";
import { Button } from "@UI/button";
import {
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useState } from "react";

function Tenantpay({ data }) {
  const [columnFilters, setColumnFilters] = useState();
  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnFilters,
    },
  });
  return (
    <>
      <div
        className="flex max-w-sm mx-10 my-5 items-center space-x-2 border-input border
           rounded-md 
           ring-offset-background
           focus-within:outline-none
            focus-within:ring-2 
            focus-within:ring-ring 
            focus-within:ring-offset-2"
      >
        <BsSearch className="mx-2" />

        <Input
          placeholder="Filter paymentType..."
          value={table.getColumn("paymentType")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("paymentType")?.setFilterValue(event.target.value)
          }
          className=" border-0 hover:border-0 pl-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div className="flex flex-row gap-5 ml-10">
        <Button variant="ghost">Total Payments : {data.length}</Button>

        <FormDialog title="Add TenantPay" triggerTitle="Add Tenant Payment">
          <AddTenantPay />
        </FormDialog>
      </div>
      {data?.length > 0 && (
        <DataTable className="mt-4" columns={columns} table={table} />
      )}
    </>
  );
}

export default Tenantpay;
