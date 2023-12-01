import React from "react";
import { Skeleton } from "@UI/skeleton";
import { Card } from "@UI/card";
const loading = () => {
  return (
    <>
      <div className="flex flex-row gap-5 items-center">
        <Skeleton className="min-w-[8rem] h-10"></Skeleton>
      </div>
      <div className="items-center mt-3">
        <Card className="w-full h-screen items-center justify-center">
          <Skeleton className="w-full h-full" />
        </Card>
      </div>
    </>
  );
};

export default loading;
