"use client";

import { LuMoreHorizontal } from "react-icons/lu";

import { Button } from "@UI/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@UI/dropdown-menu";
import { useRouter } from "next/navigation";
import { deleteVendor } from "@/app/server_functions/Vendor";

export const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "GSTIN",
    header: "GSTIN",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "contact",
    header: "Contact",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const vendor = row.original;

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
              onClick={() => navigator.clipboard.writeText(vendor.email)}
            >
              Copy Email ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                router.push(`/vendorManagment/editVendor?id=${vendor.id}`);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                try {
                  await deleteVendor({
                    id: vendor.id,
                    isActive: !vendor.isActive,
                  });
                } catch (error) {
                  console.log("Error during registration: ", error);
                }
              }}
            >
              {vendor.isActive ? "Delete" : "Activate"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
