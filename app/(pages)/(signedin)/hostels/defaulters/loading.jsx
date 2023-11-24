import { Skeleton } from "@UI/skeleton";
import { Card, CardContent, CardHeader } from "@UI/card";

const loading = () => {
  return (
    <div className="items-center mt-3">
      <Card className="w-full h-screen items-center justify-center">
        <Skeleton className="w-full h-full" />
      </Card>
    </div>
  );
};

export default loading;
