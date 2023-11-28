// import { MainNavItem, SidebarNavItem } from "types/nav"

import { LuBuilding2, LuIndianRupee } from "react-icons/lu";
import { AiOutlineUsergroupDelete } from "react-icons/ai";
import { FaUserLock, FaUserPlus, FaUser } from "react-icons/fa";
import { LiaMoneyBillWaveAltSolid } from "react-icons/lia";

import AddTenant from "@components/User/AddTenant";
import AddVendor from "@components/Vendor/AddVendor";
import AssignRole from "@components/User/AssignRole";
// interface DocsConfig {
//   mainNav: MainNavItem[]
//   sidebarNav: SidebarNavItem[]
// }

// export const docsConfig: DocsConfig = {
export const docsConfig = {
  mainNav: [
    {
      href: "/dashboard",
      title: "Dashboard",
    },
    {
      href: "/hostels",
      title: "Hostel Managment",
    },
    {
      href: "/userManagment",
      title: "User Managment",
    },
    {
      href: "/vendorManagment",
      title: "Vendor Managment",
    },
  ],
  sidebarNav: {
    "Hostel Managment": [
      {
        href: "/hostels/expenses",
        title: "Expenses",
        icon: LuIndianRupee,
      },
      {
        href: "/hostels/defaulters",
        title: "Rent Unpaid",
        icon: AiOutlineUsergroupDelete,
      },
      {
        href: "/hostels/tenantpay",
        title: "Tenant Pay",
        icon: FaUser,
      },

      {
        href: "/hostels/rooms",
        title: "Rooms",
        icon: LuBuilding2,
      },
      {
        href: "/hostels/income",
        title: "Income",
        icon: LiaMoneyBillWaveAltSolid,
      },
    ],

    "User Managment": [
      {
        title: "Assign Role",
        icon: FaUserLock,
        isForm: true,
        Form: AssignRole,
      },
      {
        title: "Create User",
        isForm: true,
        Form: AddTenant,
        icon: FaUserPlus,
      },
    ],
    "Vendor Managment": [
      {
        href: "/vendorManagment/assignRole",
        title: "Assign Role",
        icon: FaUserLock,
      },
      {
        title: "Create Vendor",
        icon: FaUserPlus,
        isForm: true,
        Form: AddVendor,
      },
    ],
  },
};
