"use client";

import { DataTableColumnHeader } from "@components/DataTable/DataTableColumnHeader";

export const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },

  {
    accessorKey: "hostel.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hostel" />
    ),
  },

  {
    accessorKey: "amount",
    header: "Rent",
  },

  {
    accessorKey: "contact",
    header: "Contact",
  },
];
