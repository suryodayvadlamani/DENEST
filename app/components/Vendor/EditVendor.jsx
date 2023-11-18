"use client";
import React, { useEffect } from "react";
import { Button } from "@UI/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { vendorModel } from "@/prisma/zod";
import { useSearchParams } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@UI/form";
import FormInput from "@components/Form/FormInput";
import UserForm from "@components/UserForm";
import AddressForm from "@components/AddressForm";
import { updateVendorByIdFn, getVendorByIdFn } from "@/app/helpers/vendor";
import { useRouter } from "next/navigation";
import { Switch } from "@UI/switch";

const EditVendor = () => {
  const userSchema = vendorModel.omit({ id: true });
  const searchParams = useSearchParams();
  const vendorId = searchParams.get("id");

  const { data: vendorData } = getVendorByIdFn(vendorId);

  const { mutate: updateVendor, isLoading: mutationLoading } =
    updateVendorByIdFn();
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
    if (vendorData?.data) {
      reset({
        GSTIN: vendorData.data.GSTIN,
        name: vendorData.data.name,
        email: vendorData.data.email,
        aadhar: vendorData.data.aadhar,
        addressLine1: vendorData.data.addressLine1,
        addressLine2: vendorData.data.addressLine2,
        pincode: vendorData.data.pincode,
        district: vendorData.data.district,
        state: vendorData.data.state,
        country: vendorData.data.country,
        contact: vendorData.data.contact,
        isActive: vendorData.data.isActive,
      });
    }
  }, [vendorData?.data]);

  const goBack = (e) => {
    e.preventDefault();
    router.replace("/vendorManagment", { scroll: false });
    //router.back();
  };

  const onSubmit = async (formData) => {
    await updateVendor({ id: vendorId, data: { ...formData } });
    router.replace("/vendorManagment");
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
              type="submit"
              disabled={mutationLoading}
              isLoading={mutationLoading}
              className="flex  justify-center gap-2"
            >
              Submit
            </Button>

            <Button
              className="flex w-20 justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6  "
              onClick={(e) => goBack(e)}
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
