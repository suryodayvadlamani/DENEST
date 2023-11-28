"use client";

import React, { useState } from "react";
import { Button } from "@UI/button";
import { Input } from "@UI/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { tenantRoomModel } from "../../../prisma/zod";
import { z } from "zod";
import FormInput from "@components/Form/FormInput";
import { Form } from "@UI/form";
import { useToast } from "@UI/use-toast";
import { updateTenantRoomFn } from "@/app/helpers/tenantRoom";
import { DialogClose } from "@radix-ui/react-dialog";
import { useRef } from "react";
import { Separator } from "@UI/separator";
import { getUserById } from "@/app/helpers/user";
import { Label } from "@UI/label";
const AssignTenant = ({ bedId }) => {
  const userSchema = tenantRoomModel.omit({ id: true }).extend({
    tenantContact: z
      .string({ message: "Must be 10 digit number" })
      .min(10, { message: "Must be 10 digit number" }),
  });
  const [userName, setUserName] = useState("");
  const cancelRef = useRef(null);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      rent: 6000,
      advance: 12000,
      userId: "",
      tenantContact: "",
      bedId,
      isActive: true,
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
    },
  });
  const { getFieldState, trigger, formState, setError, clearErrors } = form;
  const { errors } = formState;
  const {
    mutate: updateTenantRom,
    isLoading: mutationLoading,
    error,
  } = updateTenantRoomFn(cancelRef);

  const onSubmit = async (data) => {
    try {
      updateTenantRom({
        rent: data.rent,
        advance: data.advance,
        tenantContact: data.tenantContact,
        bedId,
      });
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };
  const searchCallback = async (value) => {
    try {
      await trigger("tenantContact");
      const { error } = getFieldState("tenantContact");
      if (!error?.message) {
        const data = await getUserById(value);
        if (data.status == 200) {
          clearErrors("tenantContact");

          setUserName(data?.data.name);
        } else {
          setError("tenantContact", {
            type: "manual",
            message:
              "Please check your contact number otherwise create a new tenant",
          });
        }
      }
    } catch (e) {
      console.log("inside this");
    }
  };
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm px-6 py-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
          <FormInput
            className="mb-3"
            name="tenantContact"
            form={form}
            id="tenantContact"
            type="tel"
            label="Tenant contact"
            maxLength="10"
            isSearchable={true}
            searchCallback={searchCallback}
          />
          {userName && (
            <>
              <Label className="ml-4 text-primary">{userName}</Label>
              <Separator className="my-4" />
            </>
          )}
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
      {error && (
        <Label className="text-primary">Check the contact Number</Label>
      )}
    </div>
  );
};

export default AssignTenant;
