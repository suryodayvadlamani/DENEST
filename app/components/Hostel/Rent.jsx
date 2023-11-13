import { Card, CardContent, CardHeader, CardTitle } from "@UI/card";
import Mypiechart from "@components/Charts/piechart";
import KPI from "./KPI";
function Rent({ expectedRent, collectedRent }) {
  const revenueData = [
    { name: "occupied", value: collectedRent, fill: "fill-primary" },
    {
      name: "un-occupied",
      value: expectedRent - collectedRent,
      fill: "fill-muted-foreground",
    },
  ];
  return (
    <Card className="md:w-1/2 shadow-2xl">
      <CardHeader>
        <CardTitle>Rent</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row gap-2 items-center pr-2">
        <Mypiechart
          width={"100%"}
          height={200}
          data={revenueData}
          statusPer={Math.round((collectedRent / expectedRent) * 100)}
          name={"revenue"}
        />
        <div className="flex flex-col gap-2 rounded-sm ">
          <KPI label={"Expected"} value={expectedRent} />
          <KPI label={"Collected"} value={collectedRent} />
          <KPI label={"Remaining"} value={expectedRent - collectedRent} />
        </div>
      </CardContent>
    </Card>
  );
}

export default Rent;
