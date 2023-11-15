"use client";
import { Button } from "@UI/button";
import { DataTable } from "@components/DataTable/DataTable";
import { columns } from "@components/User/Columns";
import AddTenant from "@components/User/AddTenant";
import { USERS } from "@lib/Query_Keys";
import FormDialog from "@components/Form/FormDialog";
import { getUsersFn } from "@/app/helpers/user";
import { useMemo } from "react";

function Users() {
  const {
    isFetchingNextPage,
    isLoading,
    isError,
    data: usersData,
    error,
    fetchNextPage,
    hasNextPage,
  } = getUsersFn();
  const flatData = useMemo(
    () => usersData?.pages?.flatMap((page) => page.data.data) ?? [],
    [usersData?.pages]
  );

  const tblColumns = useMemo(() => columns, []);
  return (
    <>
      <section className="flex flex-row gap-5 items-center">
        <FormDialog title="Add User" triggerTitle="+Add User">
          <AddTenant />
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
}

export default Users;
