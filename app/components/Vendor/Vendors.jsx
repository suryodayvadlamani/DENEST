"use client";
import { DataTable } from "@components/DataTable/DataTable";
import { columns } from "./Columns";
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
          filterColumn={"name"}
          searchPlaceholder={"Search Name"}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isLoading}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          sorting={true}
          title={"Vendors"}
          className={"mt-4 flex-1"}
        />
      )}
    </>
  );
};

export default Vendors;
