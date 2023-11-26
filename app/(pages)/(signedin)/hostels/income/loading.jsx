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
      <div className="flex flex-row gap-5 items-center mt-2">
        <Skeleton className="min-w-[32rem] h-10"></Skeleton>
      </div>
    </>
  );
};

export default loading;
