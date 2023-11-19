import { Skeleton } from "@UI/skeleton";
import { Card, CardContent, CardHeader } from "@UI/card";
const loading = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center">
        <div className="flex gap-5 p-2 flex-row flex-1">
          <div>
            Hostel
            <Skeleton className="min-w-[8rem] h-10" />
          </div>
          <div>
            Floor
            <Skeleton className="min-w-[8rem] h-10" />
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2  items-center gap-3 mt-3">
        <Card className="w-full h-96 items-center justify-center flex cursor-pointer ">
          <Skeleton className="w-full h-full" />
        </Card>
      </div>
    </div>
  );
};

export default loading;
