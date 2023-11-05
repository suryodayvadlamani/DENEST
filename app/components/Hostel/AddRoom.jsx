"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@UI/button";
import { Switch } from "@UI/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { roomModel } from "@/prisma/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@UI/form";
import FormInput from "@components/Form/FormInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@UI/select";
import { DialogClose } from "@radix-ui/react-dialog";
import { getHostels } from "@/app/server_functions/Hostels";
import { createRoom } from "@/app/server_functions/Rooms";
const AddRoom = ({ selectedHostel, selectedFloor }) => {
  const roomSchema = roomModel.omit({ id: true });
  const [hostelsData, setHostelsData] = useState([]);
  const cancelRef = useRef(null);

  useEffect(() => {
    async function getData() {
      const { isError, data } = await getHostels();
      if (!isError) setHostelsData([...data]);
    }
    getData();
  }, []);
  const form = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      title: "",
      capacity: 1,
      roomType: "NON_AC",
      floorId: selectedFloor || "",
      hostelId: selectedHostel || "",
      isActive: true,
    },
  });
  const { formState } = form;
  const { isSubmitting } = formState;

  const onSubmit = async (data) => {
    const { isError } = await createRoom(data);

    if (!isError) {
      cancelRef.current.click();
    }
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm px-6 py-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
          <FormInput
            className="mb-3"
            name="title"
            form={form}
            id="roomTitle"
            label="Room Title"
          />
          <FormInput
            className="mb-3"
            name="capacity"
            form={form}
            id="roomCapacity"
            type="number"
            label="Capacity"
          />
          <FormInput
            className="mb-3"
            name="floorId"
            form={form}
            id="roomFloorId"
            type="number"
            label="Floor Number"
          />
          <FormField
            control={form.control}
            name="roomType"
            render={({ field }) => (
              <FormItem id="formItemRole" className="relative pt-2">
                <FormLabel>Room Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type of room" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="NON_AC">NON_AC</SelectItem>
                    <SelectItem value="AC">AC</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hostelId"
            render={({ field }) => (
              <FormItem id="formItemHostel" className="relative pt-2">
                <FormLabel>Hostel</FormLabel>
                <Select
                  onValueChange={field.onChange}
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
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between ">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex gap-3 justify-around">
            <Button
              type="submit"
              className="flex  justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6  "
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Submit
            </Button>
            <DialogClose asChild>
              <Button
                ref={cancelRef}
                className="flex w-20 justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6  "
              >
                Cancel
              </Button>
            </DialogClose>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddRoom;
