"use client";
import AddTenantPay from "@components/TenantPay/AddTenantPay";
import { columns } from "@components/TenantPay/Columns";
import { DataTable } from "@components/DataTable/DataTable";
import FormDialog from "@components/Form/FormDialog";
import { getTenantPayFn } from "@/app/helpers/tenantpay";
import { useMemo } from "react";

function Tenantpay() {
  const {
    isFetchingNextPage,
    isLoading,
    isError,
    data: tenantPayData,
    error,
    fetchNextPage,
    hasNextPage,
  } = getTenantPayFn();

  const flatData = useMemo(() => {
    if (!tenantPayData?.pages[0]) return [];
    return tenantPayData?.pages?.flatMap((page) => page?.data?.data) ?? [];
  }, [tenantPayData?.pages]);

  const tblColumns = useMemo(() => columns, []);
  return (
    <>
      {flatData?.length > 0 && (
        <DataTable
          columns={tblColumns}
          data={flatData}
          title={"Tenant Payments"}
          filterColumn={"contact"}
          searchPlaceholder={"Search Contact"}
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
}

export default Tenantpay;
