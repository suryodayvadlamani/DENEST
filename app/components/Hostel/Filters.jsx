import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@UI/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@UI/select";
import { Button } from "@UI/button";
import { Input } from "@UI/input";
import { Label } from "@UI/label";
import { useForm } from "react-hook-form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@UI/sheet";
import { useState } from "react";
import { useEffect } from "react";
import { LuFilter } from "react-icons/lu";

const Filters = ({ setSelectedFilters, hostelsData }) => {
  const numberToString = [
    "Ground",
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Sixth",
    "Seventh",
    "Eighth",
    "Ninth",
    "Tenth",
    "Eleventh",
    "Twelfth",
    "Thirteenth",
    "Fourteenth",
    "Fifteenth",
    "Sixteenth",
    "Seventeenth",
    "Eighteenth",
    "Nineteenth",
  ];

  const form = useForm({
    defaultValues: {
      floorId: "",
      hostelId: hostelsData.data[0].id,
      roomType: "",
      sharing: "",
      status: "Vacant",
    },
  });
  const { reset } = form;
  const formReset = () => {
    reset({
      floorId: "",

      roomType: "",
      sharing: "",
      status: "",
    });
  };
  const onSubmit = (formData) => {
    setSelectedFilters(formData);
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <LuFilter className="cursor-pointer text-2xl" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Select filters you want to apply.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col items-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5 w-full"
            >
              <FormField
                control={form.control}
                name="hostelId"
                render={({ field }) => (
                  <FormItem
                    id="formItemHostel"
                    className="w-full min-w-[192px] pt-2"
                  >
                    <FormLabel>Hostel</FormLabel>
                    <Select
                      onValueChange={(e) => {
                        field.onChange(e);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hostelsData.data?.map((hostel) => {
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
                  <FormItem
                    id="formItemFloor"
                    className="w-full min-w-[192px] pt-2"
                  >
                    <FormLabel>Floor</FormLabel>
                    <Select
                      onValueChange={(e) => {
                        field.onChange(e);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from(
                          {
                            length: hostelsData.data.filter(
                              (x) => x.id == hostelsData.data[0].id
                            )[0]?.floors,
                          },
                          () => 1
                        ).map((hostel, index) => {
                          return (
                            <SelectItem
                              key={`Floor${index + 1}`}
                              value={`${index + 1}`}
                            >
                              {`${numberToString[index + 1]} Floor`}
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
                name="sharing"
                render={({ field }) => (
                  <FormItem
                    id="formItemsharing"
                    className="w-full min-w-[192px] pt-2"
                  >
                    <FormLabel>Sharing</FormLabel>
                    <Select
                      onValueChange={(e) => {
                        field.onChange(e);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select here" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="1">Single Room</SelectItem>
                          <SelectItem value="2">Two Share</SelectItem>
                          <SelectItem value="3">Three Share</SelectItem>
                          <SelectItem value="4">Four Share</SelectItem>
                          <SelectItem value="5">Five Share</SelectItem>
                          <SelectItem value="6">Six Share</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roomType"
                render={({ field }) => (
                  <FormItem
                    id="formItemRoomType"
                    className="w-full min-w-[192px] pt-2"
                  >
                    <FormLabel>Room Type</FormLabel>
                    <Select
                      onValueChange={(e) => {
                        field.onChange(e);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="AC">AC</SelectItem>
                          <SelectItem value="NON_AC">Non AC</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem
                    id="formItemStatus"
                    className="w-full min-w-[192px] pt-2"
                  >
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={(e) => {
                        field.onChange(e);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select here" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Occupied">Occupied</SelectItem>
                          <SelectItem value="Vacant">Vacant</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <section className=" flex sm:justify-around justify-around pt-4 gap-6 w-full">
                <SheetClose asChild>
                  <Button type="submit">Search</Button>
                </SheetClose>

                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    formReset();
                  }}
                >
                  Clear
                </Button>
              </section>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Filters;
