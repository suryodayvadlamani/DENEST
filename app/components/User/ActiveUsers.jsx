"use client";
import { DataTable } from "@components/DataTable/DataTable";
import { columns } from "@components/User/Columns";
import { getUsersFn } from "@/app/helpers/user";
import { useMemo } from "react";

function ActiveUsers() {
  const {
    isFetchingNextPage,
    isLoading,
    isError,
    data: usersData,
    error,
    fetchNextPage,
    hasNextPage,
  } = getUsersFn("true");

  const flatData = useMemo(() => {
    if (!usersData?.pages[0]) return [];
    return usersData?.pages?.flatMap((page) => page?.data?.data) ?? [];
  }, [usersData?.pages]);

  const tblColumns = useMemo(() => columns, []);
  return (
    <>
      {flatData?.length > 0 && (
        <DataTable
          columns={tblColumns}
          data={flatData}
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

export default ActiveUsers;
