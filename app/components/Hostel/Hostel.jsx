"use client";
import { useEffect, useState } from "react";
import Room from "@components/Room/Room";
import { getHostelsFn } from "@/app/helpers/hostel";
import Filters from "./Filters";
import { addBedFn } from "@/app/helpers/bed";
import { Button } from "@UI/button";
import { Label } from "@UI/label";
import { BiSolidBed } from "react-icons/bi";
import { BiBed } from "react-icons/bi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@UI/select";
import { Popover, PopoverContent, PopoverTrigger } from "@UI/popover";
function Hostel() {
  const [bedOpen, setBedOpen] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState("");
  const [filters, setSelectedFilters] = useState({
    floorId: "",
    hostelId: "",
    roomType: "",
    sharing: "",
    status: "",
  });
  const { data: hostelsData } = getHostelsFn(filters);
  const { mutate: createBed, isLoading: mutationLoading } = addBedFn();

  const AddBed = () => {
    try {
      const roomData = hostelsData.data
        .filter((x) => x.id == filters?.hostelId)[0]
        .Rooms?.filter((room) => room.id == selectedRoom)[0];
      const bedName =
        roomData?.Beds.length > 0
          ? parseInt(roomData?.Beds.slice(-1)[0]?.title.replace("B", "")) + 1
          : 1;

      createBed({
        title: `B${bedName}`,
        isActive: true,
        occupied: false,
        roomId: selectedRoom,
      });
      setBedOpen(false);
    } catch (error) {
      console.log("Error during Bed Addition: ", error);
    }
  };

  return (
    <div className="flex flex-col">
      <section className="flex flex-row w-full items-center gap-4 flex-wrap">
        <BiBed id="Vacant" className="text-xl lg:text-xl " />
        <Label htmlFor="Vacant">Vacant</Label>
        <BiSolidBed
          id="Occupied"
          className="text-xl lg:text-2xl text-primary"
        />
        <Label htmlFor="Occupied" className="text-primary">
          Occupied
        </Label>

        <Filters
          hostelsData={hostelsData}
          setSelectedFilters={setSelectedFilters}
        />
        <Popover open={bedOpen} onOpenChange={setBedOpen}>
          <PopoverTrigger asChild>
            <Button>+Add Bed</Button>
          </PopoverTrigger>
          <PopoverContent className="w-60">
            <Select onValueChange={setSelectedRoom}>
              <SelectTrigger>
                <SelectValue placeholder="Select Room" />
              </SelectTrigger>

              <SelectContent>
                {hostelsData?.data
                  ?.filter((x) => x.id == filters?.hostelId)[0]
                  ?.Rooms?.map((room) => {
                    return (
                      <SelectItem
                        key={room.id}
                        value={`${room.id}`}
                        disabled={room.capacity <= room.Beds.length}
                      >
                        {room.title}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
            <Button className="mt-3" onClick={() => AddBed()}>
              Select
            </Button>
          </PopoverContent>
        </Popover>
      </section>
      <div className="flex flex-row items-center justify-center gap-3 mt-3 w-full flex-wrap ">
        {hostelsData?.data &&
          hostelsData?.data.map((hostel) =>
            hostel.Rooms.map((roomData) => (
              <Room key={roomData.id} roomData={roomData} />
            ))
          )}
      </div>
    </div>
  );
}

export default Hostel;
