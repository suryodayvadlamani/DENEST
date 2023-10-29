import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@UI/card";
import Bed from "@components/Bed/Bed";
import { Button } from "@UI/button";
import { createBed } from "@/app/server_functions/Bed";

function Room({ roomData }) {
  const [loading, SetLoading] = useState(false);
  const AddBed = async () => {
    try {
      const bedName =
        roomData?.Beds.length > 0
          ? parseInt(roomData?.Beds.slice(-1)[0]?.title.replace("Bed", "")) + 1
          : 1;
      SetLoading(true);
      await createBed({
        title: `Bed${bedName}`,
        isActive: true,
        occupied: false,
        roomId: roomData.id,
      });
      SetLoading(false);
    } catch (error) {
      console.log("Error during Bed Addition: ", error);
    }
  };
  return (
    <Card className="w-full h-96">
      <CardHeader>
        <CardTitle>{roomData?.title}</CardTitle>
        <CardDescription>
          {roomData?.capacity} {roomData?.roomType}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-3 items-center h-52 overflow-auto gap-2 justify-between">
        {roomData?.Beds?.map((bed) => {
          return <Bed key={bed.id} bedData={bed} />;
        })}
      </CardContent>
      <CardFooter className="flex justify-end">
        {roomData?.Beds.length < roomData?.capacity && (
          <Button isLoading={loading} disabled={loading} onClick={AddBed}>
            +Add Bed
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default Room;
