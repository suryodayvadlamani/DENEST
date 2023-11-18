"use client";
import * as z from "zod";
import React, { useRef } from "react";
import { Button } from "@UI/button";
import UserForm from "@components/UserForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userModel } from "../../../prisma/zod";
import { Switch } from "@UI/switch";
import { DialogClose } from "@radix-ui/react-dialog";

import FormInput from "@components/Form/FormInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@UI/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@UI/form";

import { useSession } from "next-auth/react";
import { useToast } from "@UI/use-toast";
import AddressForm from "@components/AddressForm";

import { getHostelsFn } from "@/app/helpers/hostel";
import { createUserFn } from "@/app/helpers/user";
const AddTenant = () => {
  const userSchema = userModel.omit({ id: true, createdDate: true }).extend({
    hostelId: z.string(),
  });
  const { data: session } = useSession({ required: true });
  const cancelRef = useRef(null);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      profession: "",
      aadhar: "",
      addressLine1: "",
      addressLine2: "",
      pinCode: "",
      district: "",
      state: "",
      country: "",
      contact: "",
      hostelId: "",
      isActive: true,
    },
  });

  const { data: hostelData } = getHostelsFn();

  const { mutate: postUser, isLoading: mutationLoading } =
    createUserFn(cancelRef);

  const onSubmit = async (data) => {
    try {
      postUser({
        ...data,
        hostelId: data.hostelId || session.user.hostelId,
      });
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm px-6 py-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
          <UserForm form={form} />
          <FormInput
            className="mb-3"
            name="aadhar"
            form={form}
            id="aadharText"
            type="tel"
            label="Aadhar Number"
          />

          <FormInput
            className="mb-3"
            name="profession"
            form={form}
            id="professionText"
            type="text"
            label="Profession"
          />
          {session?.role == "OWNER" && (
            <FormField
              control={form.control}
              name="hostelId"
              render={({ field }) => (
                <FormItem id="formItemRole" className="relative pt-2">
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
                      {hostelData?.data.map((hostel) => {
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
          )}
          <AddressForm form={form} />
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
              className="flex  justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6  "
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

export default AddTenant;
