"use client";
import React from "react";
import { Button } from "@UI/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { tenantRoomModel } from "../../../prisma/zod";

import FormInput from "@components/Form/FormInput";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@UI/form";
import { useToast } from "@UI/use-toast";
import { useRouter } from "next/navigation";
import { getUsersFn } from "@/app/helpers/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@UI/select";
import { updateTenantRoomFn } from "@/app/helpers/tenantRoom";
import { useSession } from "next-auth/react";
import { DialogClose } from "@radix-ui/react-dialog";
import { useRef } from "react";
const AssignTenant = ({ bedId }) => {
  const userSchema = tenantRoomModel.omit({ id: true });
  const cancelRef = useRef(null);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      rent: 6000,
      advance: 12000,
      userId: "",
      bedId,
      isActive: true,
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
    },
  });
  const { status, data: session } = useSession({ required: true });

  const route = useRouter();
  const { data: userData } = getUsersFn();

  const { mutate: updateTenantRom, isLoading: mutationLoading } =
    updateTenantRoomFn();

  const onSubmit = async (data) => {
    try {
      updateTenantRom({
        rent: data.rent,
        advance: data.advance,
        userId: data.userId,
        bedId,
      });
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm px-6 py-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem id="formItemUserId" className="relative pt-2">
                <FormLabel>User</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {userData?.data
                      ?.filter((user) => !user.assigned)
                      .map((user) => {
                        return (
                          <SelectItem key={user.id} value={`${user.id}`}>
                            {user.name}
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormInput
            className="mb-3"
            name="rent"
            form={form}
            id="rent"
            type="number"
            label="Rent"
          />

          <FormInput
            className="mb-3"
            name="advance"
            form={form}
            id="advance"
            type="number"
            label="Advance"
          />

          <div className="flex gap-3 justify-around">
            <Button variant="outline" className="w-full">
              + New User
            </Button>
          </div>
          <div className="flex gap-3 justify-around">
            <Button
              className="flex justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 "
              type="submit"
              isLoading={mutationLoading}
              disabled={mutationLoading}
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

export default AssignTenant;
