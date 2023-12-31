import SideNav from "@components/SideNav";

import { docsConfig } from "@/config/docs";
export const metadata = {
  title: "Vendor Management",
  description: "Manage your vendors",
};
import { FaUserLock, FaUserPlus } from "react-icons/fa";
export default function RootLayout({ children }) {
  const items = docsConfig.sidebarNav["Vendor Managment"];
  return (
    <>
      <div className="container relative max-sm:px-4">
        <div className="flex mt-2 ">
          <SideNav
            className="max-w-[280px] w-1/3  mb-6 rounded-md mx-2 hidden md:block"
            items={items}
          />
          <div className="overflow-hidden rounded-[0.5rem] flex-1">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
