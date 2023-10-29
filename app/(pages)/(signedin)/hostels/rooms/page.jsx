import { getHostels } from "@/app/server_functions/Hostels";

import Hostel from "@components/Hostel/Hostel";

async function page() {
  const { isError, data: hostelsData } = await getHostels();
  return <Hostel hostelsData={hostelsData} />;
}

export default page;
