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
import { putCall } from "@/app/helpers/httpHelper";
import { useRouter } from "next/navigation";
import { deleteTenantPayFn } from "@/app/helpers/tenantpay";

export const columns = [
  {
    accessorKey: "user",
    header: "Tenant",
  },
  {
    accessorKey: "roomName",
    header: "Room Name",
  },
  {
    accessorKey: "advance",
    header: "Advance",
  },
  {
    accessorKey: "contact",
    header: "Contact",
  },
  {
    accessorKey: "amount",
    header: "Paid",
  },
  {
    accessorKey: "paymentType",
    header: "Mode of Payment",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
  },

  {
    accessorKey: "endDate",
    header: "End Date",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const tenant = row.original;
      const { mutate: deleteTenantPay, isLoading: mutationLoading } =
        deleteTenantPayFn();

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
              onClick={() => {
                router.push(`/hostels/tenantpay/edit?id=${tenant.id}`);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => deleteTenantPay({ id: tenant.id })}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
