"use client";

import { LuMoreHorizontal, LuArrowDownUp } from "react-icons/lu";

import { Button } from "@UI/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@UI/dropdown-menu";
import { DataTableColumnHeader } from "@components/DataTable/DataTableColumnHeader";
import { putCall } from "@/app/helpers/httpHelper";
import { useRouter } from "next/navigation";
import { deleteUser } from "@/app/server_functions/User";

export const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "hostel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hostel" />
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "rent",
    header: "Rent",
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "contact",
    header: "Contact",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <LuMoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.email)}
            >
              Copy Email ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                router.push(`/userManagment/editUser?id=${user.id}`);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                try {
                  await deleteUser({
                    id: user.id,
                    isActive: !user.isActive,
                  });
                } catch (error) {
                  console.log("Error during registration: ", error);
                }
              }}
            >
              {user.isActive ? "Delete" : "Activate"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
