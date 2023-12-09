"use client";
import { DataTable } from "@components/DataTable/DataTable";
import { columns } from "@components/Income/Columns";

import { getUsersFnDayWise } from "@/app/helpers/income";
import { useMemo } from "react";

function DayWiseIncome({ date }) {
  const {
    isFetchingNextPage,
    isLoading,
    isError,
    data: usersDataDayWise,
    error,
    fetchNextPage,
    hasNextPage,
  } = getUsersFnDayWise("true", date);

  const flatData1 = useMemo(() => {
    if (!usersDataDayWise?.pages[0]) return [];
    return usersDataDayWise?.pages?.flatMap((page) => page?.data?.data) ?? [];
  }, [usersDataDayWise?.pages]);
  const tblColumns = useMemo(() => columns, []);

  if (isLoading) {
    return <p>Loading me</p>;
  }

  return (
    <>
      {flatData1?.length > 0 ? (
        <DataTable
          columns={tblColumns}
          data={flatData1}
          title={"Day Wise"}
          filterColumn={"name"}
          searchPlaceholder={"Search Name"}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isLoading}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          sorting={true}
          className={"mt-4 flex-1"}
        />
      ) : (
        <p>No data avaialble</p>
      )}
    </>
  );
}

export default DayWiseIncome;
