import React from "react";
import Mypiechart from "./UI/piechart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Occupancy() {
  return (
    <div className="flex  flex-row content-center  gap-x-4 w=15 ">
      <Card className="flex-none">
        <CardTitle>Hostel 1</CardTitle>
        <CardContent>
          <Mypiechart />
        </CardContent>
      </Card>
      <Card className="flex-none">
        <CardTitle>Hostel 2</CardTitle>
        <CardContent>
          <Mypiechart />
        </CardContent>
      </Card>
      <Card className="flex-none">
        <CardTitle>Hostel 3</CardTitle>
        <CardContent>
          <Mypiechart />
        </CardContent>
      </Card>
    </div>
  );
}

export default Occupancy;
