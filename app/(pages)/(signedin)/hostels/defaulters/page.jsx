import { getDefaulters } from "@/app/server_functions/Hostels";
import AddDue from "@components/Dashboard/AddDue";
async function page() {
  const { isError, data: defaultersData } = await getDefaulters();

  return <AddDue data={defaultersData} />;
}

export default page;
