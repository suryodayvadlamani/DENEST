"use client";
import { Card, CardContent, CardHeader } from "@UI/card";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Room from "@components/Room/Room";
import AddRoom from "@components/Hostel/AddRoom";
import FormDialog from "@components/Form/FormDialog";
import { getHostelsFn } from "@/app/helpers/hostel";
import Filters from "./Filters";

function Hostel() {
  const { data: hostelsData } = getHostelsFn();

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

  return (
    <div className="flex flex-col">
      <section className="flex flex-row-reverse w-full ">
        <Filters
          hostelsData={hostelsData}
          setSelectedFilters={setSelectedFilters}
        />
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
