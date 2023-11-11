"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@UI/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { vendorModel } from "@/prisma/zod";
import { useSearchParams } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@UI/form";
import FormInput from "@components/Form/FormInput";
import UserForm from "@components/UserForm";
import AddressForm from "@components/AddressForm";
import { updateVendorByIdFn } from "@/app/helpers/vendor";
import { useRouter } from "next/navigation";
import { Switch } from "@UI/switch";
import { useStore } from "@/app/store/store";
import { getVendorById, updateVendor } from "@/app/server_functions/Vendor";

const EditVendor = () => {
  const userSchema = vendorModel.omit({ id: true });
  const searchParams = useSearchParams();
  const vendorId = searchParams.get("id");
  const vendorData = useStore((state) => {
    return state.vendors.filter((x) => x.id == vendorId)[0];
  });
  const [data, setData] = useState(vendorData);

  useEffect(() => {
    const getData = async () => {
      const { data: vendorData } = await getVendorById(vendorId);

      setData(vendorData);
    };
    if (!data) {
      getData();
    }
  }, []);
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

  const { formState, reset } = form;
  const { isSubmitting } = formState;
  useEffect(() => {
    if (data) {
      reset({
        GSTIN: data.GSTIN,
        name: data.name,
        email: data.email,
        aadhar: data.aadhar,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        pincode: data.pincode,
        district: data.district,
        state: data.state,
        country: data.country,
        contact: data.contact,
        isActive: data.isActive,
      });
    }
  }, [data]);

  const goBack = (e) => {
    e.preventDefault();
    router.replace("/vendorManagment", { scroll: false });
    //router.back();
  };

  const onSubmit = async (formData) => {
    const { isError } = await updateVendor(vendorId, formData);

    if (!isError) router.replace("/vendorManagment");
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
              disabled={isSubmitting || isLoading}
              isLoading={isSubmitting || isLoading}
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
