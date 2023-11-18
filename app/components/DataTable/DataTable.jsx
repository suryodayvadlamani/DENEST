"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useInView } from "react-intersection-observer";
import { BsSearch } from "react-icons/bs";
import { Input } from "@UI/input";
import { Skeleton } from "@UI/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@UI/table";
import { Card, CardContent, CardFooter, CardTitle } from "@UI/card";
import { cn } from "@/app/lib/utils";
import { useEffect, useState } from "react";

export function DataTable({
  searchPlaceholder,
  filterColumn,
  data,
  columns,
  className,
  title,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
  sorting,
}) {
  const { ref, inView } = useInView();
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
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  if (sorting)
    tableObj = {
      ...tableObj,
      onSortingChange: setSortData,
      getSortedRowModel: getSortedRowModel(),
      state: { ...tableObj.state, sorting: sortData },
    };

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
      <CardContent className="pb-0 ">
        <Table className="relative ">
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
            {table.getRowModel().rows.map((row) => (
              <TableRow
                className={row.original?.isActive ? "" : "bg-primary"}
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className="flex items-center  py-2">
        {isFetchingNextPage ? (
          <div className="flex flex-row gap-2 items-center  transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted  dark:border-white/40 border-gray-600/60">
            {table.getHeaderGroups()[0].headers.map((cell) => (
              <Skeleton key={`dummyLoader${cell.id}`} className="w-40 h-10" />
            ))}
          </div>
        ) : null}
        <span style={{ visibility: "hidden" }} ref={ref}>
          intersection observer marker
        </span>
      </CardFooter>
    </Card>
  );
}
