"use client";

import { Button } from "@UI/button";
import { Input } from "@UI/input";
import Link from "next/link";
import { BsSearch } from "react-icons/bs";
import { buttonVariants } from "@UI/button";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { DataTable } from "@components/Vendor/DataTable";
import { columns } from "@components/Vendor/Columns";
import { getVendorsFn } from "@/app/helpers/vendor";
import {
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import FormDialog from "@components/Form/FormDialog";
import AddVendor from "@components/Vendor/AddVendor";

const Hostels = () => {
  const { status, data: session } = useSession({ required: true });
  const { isLoading, data, isError, error } = getVendorsFn(
    session?.role !== "ADMIN"
  );

  const [columnFilters, setColumnFilters] = useState();
  const table = useReactTable({
    data: data?.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  if (status == "loading") return "loading";
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
          placeholder="Filter emails..."
          value={table.getColumn("email")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className=" border-0 hover:border-0 pl-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div className="flex flex-row gap-5 ml-10">
        <Button variant="ghost">Total Vendors {data?.data?.length}</Button>
        {session.role === "ADMIN" && (
          <FormDialog title="Add Vendor" triggerTitle="Add Vendor">
            <AddVendor />
          </FormDialog>
        )}
      </div>
      {data?.data?.length > 0 && (
        <DataTable className="mt-4" columns={columns} table={table} />
      )}
    </>
  );
};
export default Hostels;
