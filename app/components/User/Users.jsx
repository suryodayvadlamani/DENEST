"use client";
import { Button } from "@UI/button";
import { Input } from "@UI/input";
import { BsSearch } from "react-icons/bs";
import { DataTable } from "@components/DataTable/DataTable";
import { columns } from "@components/User/Columns";
import AddTenant from "@components/User/AddTenant";

import FormDialog from "@components/Form/FormDialog";

function Users({ data }) {
  return (
    <>
      <section className="flex flex-row gap-5 items-center">
        <Button variant="ghost">Total Users {data?.length}</Button>

        <FormDialog title="Add User" triggerTitle="+Add User">
          <AddTenant />
        </FormDialog>
      </section>

      {data?.length > 0 && (
        <DataTable
          columns={columns}
          data={data}
          pagination={true}
          sorting={true}
          className={"mt-4 flex-1"}
        />
      )}
    </>
  );
}

export default Users;
