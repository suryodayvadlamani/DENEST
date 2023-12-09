"use client";

import { LuMoreHorizontal } from "react-icons/lu";

import { Button } from "@UI/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@UI/dropdown-menu";
import { useRouter } from "next/navigation";
import { deleteExpenseFn } from "@/app/helpers/expense";
const actionColumn = {
  id: "actions",
  cell: ({ row }) => {
    const router = useRouter();
    const expense = row.original;
    const { mutate: deleteExpense, isLoading: mutationLoading } =
      deleteExpenseFn(row.original.expenseType);

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
              router.push(`/hostels/expenses/edit?id=${expense.id}`);
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => deleteExpense({ id: expense.id })}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const columns = [
  {
    accessorKey: "expenseType",
    header: "Expense Type",
  },

  {
    accessorKey: "_sum.amount",
    header: "Amount",
  },
];
export const detailed_columns = [
  {
    accessorKey: "expenseType",
    header: "Expense Type",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "expenseDate",
    header: "ExpenseDate",
    columns: (e) => <></>,
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  { ...actionColumn },
];
