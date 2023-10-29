"use client";

import React from "react";
import { Button } from "@UI/button";
import { Switch } from "@UI/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { hostelModel } from "@/prisma/zod";
import AddressForm from "@components/AddressForm";
import FormInput from "@components/Form/FormInput";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@UI/form";
import { useRef } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import { createHostel } from "@/app/server_functions/Hostels";

const AddHostel = () => {
  const cancelRef = useRef(null);
  const userSchema = hostelModel.omit({ userId: true, id: true });

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      floors: "",
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

  const { formState } = form;
  const { isSubmitting } = formState;
  const formSubmit = async (formData) => {
    const { isError } = await createHostel(formData);

    if (!isError) {
      cancelRef.current.click();
    }
  };
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm px-6 py-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(formSubmit)} className=" space-y-6">
          <FormInput
            className="mb-3"
            name="name"
            form={form}
            id="hostelname"
            type="text"
            label="Name of the Hostel"
          />
          <FormInput
            className="mb-3"
            name="floors"
            form={form}
            id="floors"
            type="tel"
            maxLength="12"
            label="Number of Floors"
          />
          <AddressForm form={form} />
          <FormInput
            className="mb-3"
            name="contact"
            form={form}
            id="contactnum"
            type="tel"
            label="Contact Number"
            maxLength="10"
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
            {/* <FormButton /> */}
            <Button
              className="flex  justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6  "
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Submit
            </Button>

            <DialogClose asChild>
              <Button
                ref={cancelRef}
                className="flex  justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6   "
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

export default AddHostel;
