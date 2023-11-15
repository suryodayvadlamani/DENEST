"use client";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@UI/form";
import { Card, CardContent, CardHeader } from "@UI/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@UI/select";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Room from "@components/Room/Room";
import AddRoom from "@components/Hostel/AddRoom";
import FormDialog from "@components/Form/FormDialog";
import { getHostelsFn } from "@/app/helpers/hostel";

function Hostel() {
  const { data: hostelsData } = getHostelsFn();
  const [selectedHostel, setSelectedHostel] = useState(hostelsData[0].id);
  const [selectedHostelRooms, setSelectedHostelRooms] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(1);

  useEffect(() => {
    setSelectedHostelRooms(() => {
      return hostelsData
        .filter((x) => x.id == selectedHostel)[0]
        .Rooms?.filter((room) => room.floorId == selectedFloor);
    });
  }, [hostelsData, selectedFloor, selectedHostel]);
  const form = useForm({
    defaultValues: {
      floorId: "1",
      hostelId: hostelsData[0].id,
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center">
        <Form {...form}>
          <form className="flex gap-5 p-2 flex-row flex-1">
            <FormField
              control={form.control}
              name="hostelId"
              render={({ field }) => (
                <FormItem
                  id="formItemHostel"
                  className="w-fit min-w-[192px] pt-2"
                >
                  <FormLabel>Hostel</FormLabel>
                  <Select
                    onValueChange={(e) => {
                      setSelectedHostel(e);
                      field.onChange(e);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {hostelsData?.map((hostel) => {
                        return (
                          <SelectItem key={hostel.id} value={`${hostel.id}`}>
                            {hostel.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="floorId"
              render={({ field }) => (
                <FormItem id="formItemFloor" className="w-28  pt-2">
                  <FormLabel>Floor</FormLabel>
                  <Select
                    onValueChange={(e) => {
                      setSelectedFloor(parseInt(e));
                      field.onChange;
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from(
                        {
                          length: hostelsData.filter(
                            (x) => x.id == selectedHostel
                          )[0]?.floors,
                        },
                        () => 1
                      ).map((hostel, index) => {
                        return (
                          <SelectItem
                            key={`Floor${index + 1}`}
                            value={`${index + 1}`}
                          >
                            {index + 1}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <div className="grid lg:grid-cols-2  items-center gap-3 mt-3">
        {selectedHostelRooms &&
          selectedHostelRooms.map((roomData) => (
            <Room key={roomData.id} roomData={roomData} />
          ))}
        {selectedFloor && (
          <Card className="w-full h-96 items-center justify-center flex cursor-pointer bg-primary">
            <CardHeader className="w-full h-full">
              <CardContent className="w-full h-full">
                <FormDialog
                  triggerClass=" items-center text-3xl w-full  h-full justify-center text-primary-foreground"
                  title="Add Room"
                  triggerTitle="+Add Room"
                >
                  <AddRoom
                    selectedHostel={selectedHostel}
                    selectedFloor={selectedFloor}
                  />
                </FormDialog>
              </CardContent>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Hostel;
