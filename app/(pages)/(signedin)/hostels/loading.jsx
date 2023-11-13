import React from "react";
import { Skeleton } from "@UI/skeleton";
import { Card, CardContent, CardHeader } from "@UI/card";
import { cn } from "@lib/utils";
import { buttonVariants } from "@UI/button";
function loading() {
  return (
    <>
      <div className="flex flex-row gap-5 my-4">
        <div
          className={cn(
            buttonVariants({
              variant: "ghost",
            }),
            "text-lg"
          )}
        >
          Total Hostels <Skeleton className="w-10" />
        </div>
        <Skeleton className="w-20" />
      </div>
      <div className="flex flex-col gap-2">
        <Card className="mt-2 bg-gradient-to-tr from-muted-foreground/40 h-[390px]">
          <CardHeader className="px-6">
            <Skeleton className="w-32 h-8" />
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row w-full gap-4 px-1 ">
            <div className="md:w-1/3  justify-between flex flex-col items-center">
              <address className="mr-2 ml-4">
                <Skeleton className="w-64 h-8" />
                <br />
                <Skeleton className="w-48 h-8" />
                <br />
                <Skeleton className="w-32 h-8" />
              </address>

              <Skeleton className="w-1/2 my-2 lg:w-full" />
            </div>
            <div className="flex md:w-2/3 flex-col md:flex-row gap-2">
              <Skeleton className="h-72 w-80" />
              <Skeleton className="h-72 w-80" />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default loading;
