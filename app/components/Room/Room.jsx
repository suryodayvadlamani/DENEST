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
          ? parseInt(roomData?.Beds.slice(-1)[0]?.title.replace("Bed", "")) + 1
          : 1;

      createBed({
        title: `Bed${bedName}`,
        isActive: true,
        occupied: false,
        roomId: roomData.id,
      });
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
          <Button
            isLoading={mutationLoading}
            disabled={mutationLoading}
            onClick={AddBed}
          >
            +Add Bed
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default Room;
