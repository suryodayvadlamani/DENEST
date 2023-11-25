import React from "react";
import { Skeleton } from "@UI/skeleton";
import { Card, CardContent, CardHeader } from "@UI/card";
const loading = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-5 items-center w-full">
        <Skeleton className="min-w-[16rem] h-10"></Skeleton>
        <div className="flex flex-row gap-1">
          <Skeleton className="min-w-[11rem] h-10"></Skeleton>
          <Skeleton className="min-w-[8rem] h-10"></Skeleton>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-2 my-2">
        <Skeleton className="min-w-[8rem] md:w-1/3 h-70" />
        <Skeleton className="w-2/3 h-80" />
      </div>
    </>
  );
};

export default loading;
