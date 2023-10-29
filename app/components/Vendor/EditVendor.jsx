"use client";
import React, { useEffect } from "react";
import { Button } from "@UI/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { vendorModel } from "@/prisma/zod";
import { useSearchParams } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@UI/form";
import FormInput from "@components/Form/FormInput";
import { useToast } from "@UI/use-toast";
import UserForm from "@components/UserForm";
import AddressForm from "@components/AddressForm";
import { getVendorByIdFn, updateVendorByIdFn } from "@/app/helpers/vendor";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Switch } from "@UI/switch";

const EditVendor = () => {
  const userSchema = vendorModel.omit({ id: true });
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const vendorId = searchParams.get("id");
  const { data } = getVendorByIdFn(vendorId);

  const { toast } = useToast();
  const router = useRouter();

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
      isActive: false,
    },
  });
  const { reset } = form;
  useEffect(() => {
    if (data) {
      reset({
        GSTIN: data?.data.GSTIN,
        name: data?.data.name,
        email: data?.data.email,
        aadhar: data?.data.aadhar,
        addressLine1: data?.data.addressLine1,
        addressLine2: data?.data.addressLine2,
        pincode: data?.data.pincode,
        district: data?.data.district,
        state: data?.data.state,
        country: data?.data.country,
        contact: data?.data.contact,
        isActive: data?.data.isActive,
      });
    }
  }, [data]);
  const route = useRouter();
  const goBack = () => {
    route.back();
  };
  const {
    mutate: updateVendor,
    isLoading: mutationLoading,
    isSuccess,
  } = updateVendorByIdFn();
  if (isSuccess) router.replace("/vendorManagment");
  const onSubmit = () => {
    const data = form.getValues();
    updateVendor({ id: vendorId, data });
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
              onClick={onSubmit}
              disabled={mutationLoading}
              isLoading={mutationLoading}
              className="flex  justify-center gap-2"
            >
              Submit
            </Button>

            <Button
              className="flex w-20 justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6  "
              onClick={goBack}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditVendor;
