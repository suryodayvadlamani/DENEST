import React from "react";
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
import { addBedFn } from "@/app/helpers/bed";

function Room({ roomData }) {
  const { mutate: createBed, isLoading: mutationLoading } = addBedFn();

  const AddBed = () => {
    try {
      const bedName =
        roomData?.Beds.length > 0
          ? parseInt(roomData?.Beds.slice(-1)[0]?.title.replace("B", "")) + 1
          : 1;

      createBed({
        title: `B${bedName}`,
        isActive: true,
        occupied: false,
        roomId: roomData.id,
      });
    } catch (error) {
      console.log("Error during Bed Addition: ", error);
    }
  };
  return (
    <div className="flex items-center justify-center">
      <Card className="h-28 w-72 ">
        <CardHeader className="p-2">
          <CardTitle className="text-sm">{roomData?.title}</CardTitle>
          <CardDescription className="text-xs">
            {roomData?.capacity} {roomData?.roomType}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row items-center h-20 overflow-auto gap-2 ">
          {roomData?.Beds?.map((bed) => {
            return <Bed key={bed.id} bedData={bed} />;
          })}
        </CardContent>
        <CardFooter className="flex justify-end"></CardFooter>
      </Card>
    </div>
  );
}

export default Room;
