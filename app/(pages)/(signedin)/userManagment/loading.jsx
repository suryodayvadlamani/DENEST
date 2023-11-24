import { Skeleton } from "@UI/skeleton";
import { Card, CardContent, CardHeader } from "@UI/card";

function loading() {
  return (
    <>
      <div className="flex flex-row gap-5 items-center">
        <Skeleton className="min-w-[32rem] h-10"></Skeleton>
      </div>
      <div className="items-center mt-3">
        <Card className="w-full h-screen items-center justify-center">
          <Skeleton className="w-full h-full" />
        </Card>
      </div>
    </>
  );
}

export default loading;
