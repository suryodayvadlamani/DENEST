import React from "react";

import { getDuesFn } from "@/app/helpers/dues";
import { columns2 } from "./Columns2";
import { DataTable } from "@components/DataTable/DataTable";
const AddDue = () => {
  const { data: dueData } = getDuesFn();
  console.log(dueData);
  return (
    <>
      {dueData?.data?.length > 0 && (
        <DataTable
          columns={columns2}
          data={dueData?.data}
          title={"Defaulters"}
          pagination={true}
          className={"mt-4 flex-1"}
        />
      )}
    </>
  );
};

export default AddDue;
