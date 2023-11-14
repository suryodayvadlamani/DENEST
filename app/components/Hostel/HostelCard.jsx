import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@UI/card";
import AddRoom from "@components/Hostel/AddRoom";
import FormDialog from "@components/Form/FormDialog";
import Occupancy from "./Occupancy";
import Rent from "./Rent";
function HostelCard({ hostel }) {
  const {
    name,
    addressLine1,
    addressLine2,
    pincode,
    district,
    state,
    country,
    contact,
    floors,
    Rooms,
  } = hostel;

  return (
    <Card className="mt-2 bg-gradient-to-tr from-muted-foreground/40">
      <CardHeader className="px-6">
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row w-full gap-4 px-1 ">
        <div className="md:w-1/3  justify-between flex flex-col items-center">
          <address className="mr-2 ml-4">
            {addressLine1} {addressLine2}
            <br />
            {district} {state}
            <br />
            {country} {pincode}
          </address>
          <FormDialog
            triggerClass={"w-1/2 my-2 lg:w-full"}
            title="Add Room"
            triggerTitle="+Add Room"
          >
            <AddRoom selectedHostel={hostel.id} />
          </FormDialog>
        </div>
        <div className="flex md:w-2/3 flex-col md:flex-row gap-2">
          <Occupancy Rooms={Rooms} />
          <Rent
            expectedRent={hostel.rentData}
            collectedRent={hostel.collectedData}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default HostelCard;
