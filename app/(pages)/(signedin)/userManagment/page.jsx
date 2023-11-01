import { getUsers } from "@/app/server_functions/User";
import Users from "@components/User/Users";
export default async function UserManagement() {
  const { data } = await getUsers();

  return <Users data={data} />;
}
