"use client";
import { useEffect, useState } from "react";
import Room from "@components/Room/Room";
import { getHostelsFn } from "@/app/helpers/hostel";
import Filters from "./Filters";
import { addBedFn } from "@/app/helpers/bed";
import { Button } from "@UI/button";
import { Input } from "@UI/input";
import { Label } from "@UI/label";
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
  const { data: hostelsData } = getHostelsFn();
  const [selectedRoom, setSelectedRoom] = useState("");
  const [filters, setSelectedFilters] = useState({
    floorId: "",
    hostelId: hostelsData.data[0].id,
    roomType: "",
    sharing: "",
    status: "Vacant",
  });
  const [selectedHostelRooms, setSelectedHostelRooms] = useState([]);

  useEffect(() => {
    setSelectedHostelRooms(() => {
      let roomsData = hostelsData.data
        .filter((x) => x.id == filters?.hostelId)[0]
        .Rooms?.filter((room) => {
          let returnData = true;
          if (filters?.floorId) {
            returnData = room.floorId == filters?.floorId;
          }
          if (filters?.sharing) {
            returnData = returnData && room.capacity == filters?.sharing;
          }
          if (filters?.roomType) {
            returnData = returnData && room.roomType == filters?.roomType;
          }
          return returnData;
        });
      if (filters?.status) {
        roomsData = roomsData
          .map((room) => {
            return {
              ...room,
              Beds: room.Beds.filter(
                (bed) => bed.occupied == (filters.status == "Occupied")
              ),
            };
          })
          .filter((x) => x.Beds.length > 0);
      }

      console.log(roomsData);
      return roomsData;
    });
  }, [
    filters.hostelId,
    filters.floorId,
    filters.sharing,
    filters?.roomType,
    filters?.status,
  ]);

  const { mutate: createBed, isLoading: mutationLoading } = addBedFn();

  const AddBed = () => {
    try {
      const bedName =
        hostelsData.data
          .filter((x) => x.id == filters?.hostelId)[0]
          .Rooms?.filter((room) => room.id == selectedRoom)[0].Beds.length > 0
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
      <section className="flex flex-row-reverse w-full items-center gap-4">
        <Filters
          hostelsData={hostelsData}
          setSelectedFilters={setSelectedFilters}
        />
        <Popover open={bedOpen} onOpenChange={setBedOpen}>
          <PopoverTrigger asChild>
            <Button>+Add Bed</Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <Select onValueChange={setSelectedRoom}>
              <SelectTrigger>
                <SelectValue placeholder="Select Room" />
              </SelectTrigger>

              <SelectContent>
                {hostelsData.data
                  .filter((x) => x.id == filters?.hostelId)[0]
                  .Rooms?.map((room) => {
                    return (
                      <SelectItem key={room.id} value={`${room.id}`}>
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
        {selectedHostelRooms &&
          selectedHostelRooms.map((roomData) => (
            <Room key={roomData.id} roomData={roomData} />
          ))}
      </div>
    </div>
  );
}

export default Hostel;
