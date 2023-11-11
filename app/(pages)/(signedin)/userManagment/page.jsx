import Users from "@components/User/Users";
import { getUsers } from "@/app/server_functions/User";
import { useStore } from "@/app/store/store";
import StoreInitializer from "@/app/components/StoreInitializer";

export default async function UserManagement() {
  const { data } = await getUsers();

  useStore.setState({ filter: {}, users: data });

  return (
    <>
      <StoreInitializer filter={{ nams: "" }} users={data} />
      <Users />
    </>
  );
}
