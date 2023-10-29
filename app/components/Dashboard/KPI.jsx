import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@UI/card";
function KPI({ icon, value, title }) {
  return (
    <Card className="mt-4 w-fit h-min bg-gradient-to-tr from-muted-foreground/40">
      <CardHeader className="px-1 md:px-2">
        <CardTitle className="flex text-sm gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex font-bold text-2xl  items-center justify-center p-0">
        {value}
      </CardContent>
    </Card>
  );
}

export default KPI;
