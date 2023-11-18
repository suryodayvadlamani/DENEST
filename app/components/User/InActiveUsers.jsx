"use client";
import { DataTable } from "@components/DataTable/DataTable";
import { columns } from "@components/User/Columns";
import AddTenant from "@components/User/AddTenant";
import FormDialog from "@components/Form/FormDialog";
import { getUsersFn } from "@/app/helpers/user";
import { useMemo } from "react";

function InActiveUsers() {
  const {
    isFetchingNextPage,
    isLoading,
    isError,
    data: usersData,
    error,
    fetchNextPage,
    hasNextPage,
  } = getUsersFn("false");

  const flatData1 = useMemo(() => {
    if (!usersData?.pages[0]) return [];
    return usersData?.pages?.flatMap((page) => page?.data?.data) ?? [];
  }, [usersData?.pages]);

  const tblColumns = useMemo(() => columns, []);
  return (
    <>
      {flatData1?.length > 0 && (
        <DataTable
          columns={tblColumns}
          data={flatData1}
          title={"Users"}
          filterColumn={"name"}
          searchPlaceholder={"Search Name"}
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

export default InActiveUsers;
