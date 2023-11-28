import SideNav from "@components/SideNav";
import { docsConfig } from "@/config/docs";

export const metadata = {
  title: "User Management",
  description: "Manage your users",
};

export default async function UserLayout({ children }) {
  const items = docsConfig.sidebarNav["User Managment"];

  return (
    <div className="container relative max-sm:px-4">
      <div className="flex  mt-2 ">
        <SideNav
          className="max-w-[280px] w-1/3  mb-6 rounded-md mx-2 hidden md:flex"
          items={items}
        />
        <div className="overflow-hidden rounded-[0.5rem]  flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
