"use client";
import { Button } from "@UI/button";
import { DataTable } from "@components/DataTable/DataTable";
import { columns } from "./Columns";
import { useSession } from "next-auth/react";
import FormDialog from "@components/Form/FormDialog";
import AddVendor from "./AddVendor";
import { getVendorsFn } from "@/app/helpers/vendor";
import { useMemo } from "react";

const Vendors = () => {
  const {
    isFetchingNextPage,
    isLoading,
    isError,
    data: vendorData,
    error,
    fetchNextPage,
    hasNextPage,
  } = getVendorsFn();

  const flatData = useMemo(() => {
    if (!vendorData?.pages[0]) return [];
    return vendorData?.pages?.flatMap((page) => page?.data?.data) ?? [];
  }, [vendorData?.pages]);
  const tblColumns = useMemo(() => columns, []);
  return (
    <>
      <section className="flex flex-row gap-5 items-center">
        <FormDialog title="Add Vendor" triggerTitle="+Add Vendor">
          <AddVendor />
        </FormDialog>
      </section>

      {flatData?.length > 0 && (
        <DataTable
          columns={tblColumns}
          data={flatData}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isLoading}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          sorting={true}
          className={"mt-4 flex-1"}
        />
      )}
    </>
  );
};

export default Vendors;
