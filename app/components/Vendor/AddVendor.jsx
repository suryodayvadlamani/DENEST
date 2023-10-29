"use client";
import React, { useRef } from "react";
import { Button } from "@UI/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { vendorModel } from "../../../prisma/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@UI/form";
import FormInput from "@components/Form/FormInput";
import UserForm from "@components/UserForm";
import AddressForm from "@components/AddressForm";
import { Switch } from "@UI/switch";
import { createVendorFn } from "@/app/helpers/vendor";
import { DialogClose } from "@radix-ui/react-dialog";

const AddVendor = () => {
  const userSchema = vendorModel.omit({ id: true });
  const cancelRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      GSTIN: "",
      name: "",
      email: "",
      aadhar: "",
      addressLine1: "",
      addressLine2: "",
      pincode: "",
      district: "",
      state: "",
      country: "",
      contact: "",
      isActive: true,
    },
  });

  const { mutate: postVendor, isLoading: mutationLoading } =
    createVendorFn(cancelRef);

  const onSubmit = async (data) => {
    try {
      postVendor(data);
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
            name="GSTIN"
            id="gstin"
            type="tel"
            label={"GSTIN"}
            form={form}
          />

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

export default AddVendor;
