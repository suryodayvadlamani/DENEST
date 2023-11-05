import { columns2 } from "./Columns2";
import { DataTable } from "@components/DataTable/DataTable";
const AddDue = ({ data }) => {
  return (
    <>
      {data?.length > 0 && (
        <DataTable
          columns={columns2}
          data={data}
          title={"Defaulters"}
          pagination={true}
          className={"mt-4 flex-1"}
        />
      )}
    </>
  );
};

export default AddDue;
