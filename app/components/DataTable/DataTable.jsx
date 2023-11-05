"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import { BsSearch } from "react-icons/bs";
import { Input } from "@UI/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@UI/table";
import { Card, CardContent, CardFooter, CardTitle } from "@UI/card";
import { DataTablePagination } from "./DataTablePagination";
import { cn } from "@/app/lib/utils";
import { useState } from "react";
export function DataTable({
  searchPlaceholder,
  filterColumn,
  data,
  columns,
  className,
  title,
  pagination,
  sorting,
}) {
  const [sortData, setSortData] = useState([]);
  const [columnFilters, setColumnFilters] = useState();
  let tableObj = {
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  };
  if (sorting)
    tableObj = {
      ...tableObj,
      onSortingChange: setSortData,
      getSortedRowModel: getSortedRowModel(),
      state: { ...tableObj.state, sorting: sortData },
    };

  if (pagination)
    tableObj = { ...tableObj, getPaginationRowModel: getPaginationRowModel() };
  const table = useReactTable(tableObj);

  return (
    <Card className={cn(className)}>
      {title && (
        <CardTitle className="pl-6 flex flex-row items-center justify-between">
          {title}
          <div
            className="flex max-w-sm mx-10 my-5 items-center space-x-2 border-input border
       rounded-md 
       ring-offset-background
       focus-within:outline-none
        focus-within:ring-2 
        focus-within:ring-ring 
        focus-within:ring-offset-2"
          >
            <BsSearch className="mx-2" />

            <Input
              placeholder={searchPlaceholder}
              value={table.getColumn(filterColumn)?.getFilterValue() ?? ""}
              onChange={(event) =>
                table
                  .getColumn(filterColumn)
                  ?.setFilterValue(event.target.value)
              }
              className=" border-0 hover:border-0 pl-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </CardTitle>
      )}
      <CardContent className="pb-0">
        <Table className="relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      {pagination && (
        <CardFooter className="flex items-center justify-end space-x-2 py-2">
          <DataTablePagination table={table} />
        </CardFooter>
      )}
    </Card>
  );
}
