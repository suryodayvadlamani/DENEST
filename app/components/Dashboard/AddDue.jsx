"use client";
import { columns2 } from "./Columns2";
import { DataTable } from "@components/DataTable/DataTable";
import { getDuesFn } from "@/app/helpers/dues";
import { useMemo } from "react";
const AddDue = () => {
  const {
    isFetchingNextPage,
    isLoading,
    isError,
    data: dueData,
    error,
    fetchNextPage,
    hasNextPage,
  } = getDuesFn();
  const flatData = useMemo(() => {
    if (!dueData?.pages[0]) return [];
    return dueData?.pages?.flatMap((page) => page?.data) ?? [];
  }, [dueData?.pages]);

  const tblColumns = useMemo(() => columns2, []);
  return (
    <>
      {flatData?.length > 0 && (
        <DataTable
          columns={tblColumns}
          data={flatData}
          filterColumn={"userName"}
          searchPlaceholder={"Search Name"}
          title={"Defaulters"}
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

export default AddDue;
