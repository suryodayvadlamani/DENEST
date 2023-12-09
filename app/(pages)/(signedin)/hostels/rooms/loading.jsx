import { Skeleton } from "@UI/skeleton";
import { Card, CardContent, CardHeader } from "@UI/card";
const loading = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center">
        <div className="flex gap-5 p-2 flex-row ">
          <div className="text-sm ">Vacant</div>
          <div className="text-sm ">Occupied</div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 mt-2">
        <Card className="items-center justify-center flex cursor-pointer ">
          <Skeleton className="w-72 h-28" />
        </Card>
        <Card className="items-center justify-center flex cursor-pointer ">
          <Skeleton className="w-72 h-28" />
        </Card>
        <Card className="items-center justify-center flex cursor-pointer ">
          <Skeleton className="w-72 h-28" />
        </Card>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 mt-2">
        <Card className="items-center justify-center flex cursor-pointer ">
          <Skeleton className="w-72 h-28" />
        </Card>
        <Card className="items-center justify-center flex cursor-pointer ">
          <Skeleton className="w-72 h-28" />
        </Card>
        <Card className="items-center justify-center flex cursor-pointer ">
          <Skeleton className="w-72 h-28" />
        </Card>
      </div>
    </div>
  );
};

export default loading;
