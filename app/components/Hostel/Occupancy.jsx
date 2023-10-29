import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@UI/card";
import Mypiechart from "@components/Charts/piechart";
import KPI from "./KPI";
function Occupancy({ Rooms }) {
  const occupied = Rooms.reduce(function (acc, room) {
    return acc + room.Beds.filter((bed) => bed.occupied).length;
  }, 0);

  const totalBeds = Rooms.reduce(function (acc, room) {
    return acc + room.Beds.length;
  }, 0);
  const data = [
    { name: "occupied", value: occupied, fill: "fill-primary" },
    {
      name: "un-occupied",
      value: totalBeds - occupied,
      fill: "fill-muted-foreground",
    },
  ];
  return (
    <Card className="md:w-1/2 shadow-2xl">
      <CardHeader>
        <CardTitle>Occupancy</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row gap-2 items-center pr-2">
        <Mypiechart
          width={"100%"}
          height={200}
          name={"occupancy"}
          data={data}
          statusPer={Math.round((data[0].value / totalBeds) * 100)}
        />
        <div className="flex flex-col gap-2">
          <KPI label={"Total Rooms"} value={Rooms.length} />
          <KPI label={"Total Beds"} value={totalBeds} />
          <KPI label={"Occupied"} value={occupied} />
        </div>
      </CardContent>
    </Card>
  );
}

export default Occupancy;
