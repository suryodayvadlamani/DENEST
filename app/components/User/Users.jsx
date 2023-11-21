"use client";

import { useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@UI/tabs";
import ActiveUsers from "@components/User/ActiveUsers";
import InActiveUsers from "@components/User/InActiveUsers";

function Users() {
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("activeTab") || "active";

  return (
    <Tabs defaultValue={activeTab}>
      <TabsList className="grid w-1/2 grid-cols-2">
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="inactive">Inactive</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <ActiveUsers />
      </TabsContent>
      <TabsContent value="inactive">
        <InActiveUsers />
      </TabsContent>
    </Tabs>
  );
}

export default Users;
