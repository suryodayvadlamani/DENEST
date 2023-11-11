"use client";
import { Button } from "@UI/button";
import { useStore } from "@/app/store/store";
import { DataTable } from "@components/DataTable/DataTable";
import { columns } from "@components/User/Columns";
import AddTenant from "@components/User/AddTenant";

import FormDialog from "@components/Form/FormDialog";

function Users() {
  const usersData = useStore((state) => {
    return state.users;
  });

  return (
    <>
      <section className="flex flex-row gap-5 items-center">
        <Button variant="ghost">Total Users {usersData?.length}</Button>

        <FormDialog title="Add User" triggerTitle="+Add User">
          <AddTenant />
        </FormDialog>
      </section>

      {usersData?.length > 0 && (
        <DataTable
          columns={columns}
          data={usersData}
          pagination={true}
          sorting={true}
          className={"mt-4 flex-1"}
        />
      )}
    </>
  );
}

export default Users;
